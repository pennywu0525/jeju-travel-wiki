const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname,'..');
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const topicNames = {prep:'行前準備',transport:'交通與租車',stay:'住宿區域',spots:'熱門景點',food:'美食與購物',itinerary:'行程規劃'};
const plain = s => s.replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const srcId = n => `SRC-${String(n).padStart(2,'0')}`;
async function main(){
 const {marked} = await import(pathToFileURL(require.resolve('marked')).href);
 const slides = JSON.parse(fs.readFileSync(path.join(root,'content/slides.json'),'utf8'));
 if(slides.length!==15) throw Error('Expected exactly 15 slides');
 const sources = Array.from({length:10},(_,i)=>{
  const id=srcId(i+1);const text=fs.readFileSync(path.join(root,`wiki/sources/${id}.md`),'utf8');
  const get=k=>text.match(new RegExp('^'+k+': "([^"]*)"','m'))?.[1]||'未知';
  return {id,title:get('title'),author:get('author_or_site'),url:get('url'),date:get('published_date'),access:get('access_date')};
 });
 const refs = sources.map(s=>`<details><summary><span class="ref-id">${s.id}</span>${esc(s.title)}</summary><p>${esc(s.author)}<br>發布日期：${esc(s.date)} · 查閱：${esc(s.access)}</p><a href="wiki.html#sources/${s.id}.md" target="_blank" rel="noopener">來源筆記與更新日期 ↗</a> · <a href="${esc(s.url)}" target="_blank" rel="noopener">原網站 ↗</a></details>`).join('');
 const rendered = slides.map((s,i)=>{
  s.topics.forEach(t=>{if(!fs.existsSync(path.join(root,`wiki/topics/${t}.md`)))throw Error(t);});
  s.refs.forEach(n=>{if(!sources[n-1])throw Error(n);});
  return `<section class="slide ${s.kind}" id="slide-${i+1}" data-title="${esc(plain(s.title))}" aria-labelledby="title-${i+1}" ${i?'hidden':''}><header><p class="kicker">${esc(s.kicker)}</p><${i?'h2':'h1'} id="title-${i+1}">${s.title}</${i?'h2':'h1'}><p class="lead">${esc(s.lead)}</p></header><div class="slide-body">${s.body.replace('<div id="references" class="references"></div>',`<div id="references" class="references">${refs}</div>`)}</div><footer class="sources"><span>本頁依據</span>${s.topics.map(t=>`<a href="wiki.html#topics/${t}.md" target="_blank" rel="noopener">${topicNames[t]}</a>`).join('')}${s.refs.map(n=>`<a href="wiki.html#sources/${srcId(n)}.md" target="_blank" rel="noopener">${srcId(n)}</a>`).join('')}<span class="source-date">資料查閱 2026.11.16 · 行前重查</span></footer></section>`;
 }).join('\n');
 fs.writeFileSync(path.join(root,'index.html'),`<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="第一次去濟州島自由行：15頁互動指南，交通、住宿、景點與行程均可追溯至Wiki。"><title>第一次去濟州島自由行完整攻略</title><link rel="icon" href="assets/jeju-coast.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/style.css"><script src="assets/app.js" defer></script></head><body><a class="skip-link" href="#reader">跳至簡報內容</a><header class="topbar"><a href="#slide-1" class="brand"><i aria-hidden="true"></i>濟州 · 初次見面</a><nav class="chapter-nav" aria-label="六大主題">${Object.keys(topicNames).map((t,i)=>`<button data-chapter="${[3,4,8,9,11,12][i]}">${topicNames[t]}</button>`).join('')}</nav></header><main id="reader" class="reader" tabindex="-1">${rendered}<noscript><p>互動功能需要啟用 JavaScript；<a href="wiki.html">也可以閱讀完整 Wiki</a>。</p></noscript></main><footer class="bottom-bar"><div class="progress-track" aria-hidden="true"><div class="progress-fill"></div></div><span id="page-counter" class="page-counter">01 / 15</span><label for="page-select" class="sr-only">跳至頁面</label><select id="page-select" class="page-select">${slides.map((s,i)=>`<option value="${i+1}">${String(i+1).padStart(2,'0')} ${esc(plain(s.title))}</option>`).join('')}</select><div class="pager"><button id="previous" disabled>← 上一頁</button><button id="next">下一頁 →</button></div></footer><div id="page-status" class="sr-only" role="status" aria-live="polite"></div></body></html>`);
 const wikiFiles=['INDEX.md',...fs.readdirSync(path.join(root,'wiki/topics')).filter(x=>x.endsWith('.md')).map(x=>'topics/'+x),...fs.readdirSync(path.join(root,'wiki/sources')).filter(x=>x.endsWith('.md')).map(x=>'sources/'+x)];
 const wikiHtml=wikiFiles.map(file=>{
  let text=fs.readFileSync(path.join(root,'wiki',file),'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
  let html=marked.parse(text);
  html=html.replace(/href="([^"]+)"/g,(m,target)=>{
   if(/^(https?:|mailto:|#)/.test(target))return m;
   const resolved=path.resolve(root,'wiki',path.dirname(file),target);
   const relative=path.relative(path.join(root,'wiki'),resolved).replaceAll('\\','/');
   return wikiFiles.includes(relative)?`href="#${relative}"`:`href="${path.relative(root,resolved).replaceAll('\\','/')}"`;
  });
  return `<article class="wiki-article" data-wiki="${file}" ${file==='INDEX.md'?'':'hidden'}>${html}</article>`;
 }).join('\n');
 fs.writeFileSync(path.join(root,'wiki.html'),`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>濟州自由行 Wiki</title><link rel="stylesheet" href="assets/wiki.css"><script src="assets/wiki.js" defer></script></head><body><header><a href="index.html">← 回簡報</a><a href="#INDEX.md">Wiki 總索引</a><label for="wiki-select">閱讀筆記</label><select id="wiki-select">${wikiFiles.map(f=>`<option value="${f}">${f==='INDEX.md'?'總索引':f.startsWith('topics/')?topicNames[path.basename(f,'.md')]:path.basename(f,'.md')}</option>`).join('')}</select></header><main>${wikiHtml}</main></body></html>`);
 const content='# 簡報逐頁完整內容\n\n由 content/slides.json 產生；HTML與此文件使用同一份文案。互動回饋與分區文案另位於 assets/app.js，對應同頁Wiki。\n\n'+slides.map((s,i)=>`## 第 ${i+1} 頁｜${plain(s.title)}\n\n${s.lead}\n\n${plain(s.body)}\n\n主題：${s.topics.map(t=>`[${topicNames[t]}](../wiki/topics/${t}.md)`).join('、')}；來源：${s.refs.map(n=>`[${srcId(n)}](../wiki/sources/${srcId(n)}.md)`).join('、')}\n`).join('\n');
 fs.writeFileSync(path.join(root,'docs/presentation_content.md'),content);
 const grounding={created_at:new Date().toISOString(),basis:'Approved outline and existing Wiki only; references validated for existence, factual scope manually reviewed',pages:slides.map((s,i)=>({page:i+1,title:plain(s.title),topics:s.topics,sources:s.refs.map(srcId),manual_scope:'Wiki-supported facts and explicitly labelled editorial advice; dynamic unverified claims excluded'}))};
 fs.writeFileSync(path.join(root,'logs/evidence/slide-grounding.json'),JSON.stringify(grounding,null,2)+'\n');
 console.log('Built index.html, wiki.html, full content and 15-page source mapping.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
