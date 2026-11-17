"""Check local Markdown targets, source/topic reciprocity and project structure.
Does not test external URLs, factual truth, browser layout, or Mermaid rendering.
"""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import argparse
import json
import re
import sys
from urllib.parse import unquote, urlsplit

sys.stdout.reconfigure(encoding='utf-8')
root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--report', default='logs/evidence/wiki-check.json')
args = parser.parse_args()
errors, links, edges, source_rows, topic_rows = [], [], {}, [], []

def clean(text):
    text = re.sub(r'^```.*?^```[^\n]*', '', text, flags=re.M | re.S)
    return re.sub(r'`[^`\n]*`', '', text)

files = sorted(root.rglob('*.md'))
for path in files:
    rel = path.relative_to(root).as_posix()
    raw = path.read_text(encoding='utf-8-sig')
    text = clean(raw)
    edges[path.resolve()] = set()
    # All project links currently use inline Markdown; reject unsupported reference syntax.
    if re.search(r'^\s*\[[^\]]+\]:', text, re.M):
        errors.append(f'{rel}: reference-style link requires checker extension')
    for match in re.finditer(r'!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)', text):
        target = match.group(1).strip('<>')
        parts = urlsplit(target)
        if parts.scheme or parts.netloc:
            continue
        target_path = (path.parent / unquote(parts.path)).resolve() if parts.path else path.resolve()
        exists = target_path.is_file()
        exact_case = exists and target_path.name in [p.name for p in target_path.parent.iterdir()]
        row = {'from': rel, 'target': target, 'exists': exists, 'filename_case_matches': exact_case}
        if parts.fragment:
            # Current authored links have no fragments. Fail explicitly instead of silently ignoring.
            errors.append(f'{rel}: fragment needs explicit validation: {target}')
        if not exists or not exact_case:
            errors.append(f'{rel}: missing or wrong-case target: {target}')
        links.append(row)
        edges[path.resolve()].add(target_path)

required = ['id', 'title', 'url', 'published_date', 'access_date', 'author_or_site', 'topics']
for n in range(1, 11):
    p = root / f'wiki/sources/SRC-{n:02}.md'
    if not p.is_file():
        errors.append(f'Missing {p.name}')
        continue
    text = p.read_text(encoding='utf-8-sig')
    front = text.split('---', 2)[1] if text.startswith('---') else ''
    missing = [k for k in required if not re.search(r'^'+k+r':', front, re.M)]
    topic_links = sorted(x.name for x in edges[p.resolve()] if x.parent == root/'wiki/topics')
    if missing or not topic_links:
        errors.append(f'{p.name}: missing metadata {missing} or topic link')
    source_rows.append({'id': p.stem, 'metadata_missing': missing, 'topics': topic_links})

for name in ['prep', 'transport', 'stay', 'spots', 'food', 'itinerary']:
    p = root / f'wiki/topics/{name}.md'
    if not p.is_file():
        errors.append(f'Missing {p.name}')
        continue
    text = p.read_text(encoding='utf-8')
    sources = sorted(x.name for x in edges[p.resolve()] if x.parent == root/'wiki/sources')
    if len(text) < 400 or len(sources) < 2:
        errors.append(f'{p.name}: insufficient content or fewer than two source references')
    topic_rows.append({'topic': p.name, 'characters': len(text), 'source_count': len(sources), 'sources': sources})

pairs = set()
for p, targets in edges.items():
    for target in targets:
        if {p.parent, target.parent} == {root/'wiki/topics', root/'wiki/sources'}:
            pairs.add(tuple(sorted([str(p.relative_to(root)), str(target.relative_to(root))])))
            if p not in edges.get(target, set()):
                errors.append(f'No backlink: {p.relative_to(root)} -> {target.relative_to(root)}')
index = root/'wiki/INDEX.md'
for folder in ['sources', 'topics']:
    for p in (root/'wiki'/folder).glob('*.md'):
        if p.resolve() not in edges.get(index.resolve(), set()):
            errors.append(f'Index missing {p.name}')
outline = root/'docs/presentation_outline.md'
outline_rows = []
if outline.exists():
    text = outline.read_text(encoding='utf-8')
    sections = re.split(r'^## 第 (\d+) 頁', text, flags=re.M)
    nums = [int(sections[i]) for i in range(1, len(sections), 2)]
    if nums != list(range(1, 16)):
        errors.append(f'Outline page numbers: {nums}')
    for i in range(1, len(sections), 2):
        body = sections[i+1]
        ok = all(k in body for k in ['主要內容', '呈現與互動', 'Wiki 與來源'])
        outline_rows.append({'page': int(sections[i]), 'required_fields': ok})
        if not ok:
            errors.append(f'Outline page {sections[i]} missing fields')

report = {
    'executed_at': datetime.now(timezone(timedelta(hours=8))).isoformat(),
    'scope': 'All project Markdown files; code examples excluded; external URLs not tested',
    'markdown_files': len(files), 'local_links': len(links), 'bidirectional_source_topic_pairs': len(pairs),
    'sources': source_rows, 'topics': topic_rows, 'outline': outline_rows,
    'errors': errors, 'passed': not errors, 'links': links,
}
out = root / args.report
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps({k: report[k] for k in ['executed_at', 'markdown_files', 'local_links', 'bidirectional_source_topic_pairs', 'passed', 'errors']}, ensure_ascii=False, indent=2))
print(f'Sources: {len(source_rows)}/10; topics: {len(topic_rows)}/6; outline pages: {len(outline_rows)}')
print(f'Report: {out.relative_to(root).as_posix()}')
sys.exit(0 if not errors else 1)
