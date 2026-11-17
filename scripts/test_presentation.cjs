const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');const output=path.join(root,'logs/evidence/browser');fs.mkdirSync(output,{recursive:true});
const report={executed_at:new Date().toISOString(),browser:'Microsoft Edge / Chromium, headless',checks:[],layouts:[],errors:[],screenshots:[]};
function check(name,ok,details=''){report.checks.push({name,passed:!!ok,details});if(!ok)report.errors.push(name+': '+details);}
async function main(){
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
report.browser_version=browser.version();
const context=await browser.newContext({viewport:{width:1440,height:960}});const page=await context.newPage();
const consoleErrors=[],failedRequests=[];
page.on('pageerror',e=>consoleErrors.push(String(e)));page.on('requestfailed',r=>failedRequests.push(r.url()));
page.on('response',r=>{if(r.status()>=400)failedRequests.push(`${r.status()} ${r.url()}`);});
await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
const current=()=>page.locator('.slide:visible').getAttribute('id');
check('15 slides present',await page.locator('.slide').count()===15);
check('one visible slide',await page.locator('.slide:visible').count()===1);
check('previous disabled at first page',await page.locator('#previous').isDisabled());
await page.locator('#next').click();check('next button',await current()==='slide-2');
await page.locator('#previous').click();check('previous button',await current()==='slide-1');
await page.keyboard.press('ArrowRight');check('ArrowRight',await current()==='slide-2');
await page.keyboard.press('ArrowLeft');check('ArrowLeft',await current()==='slide-1');
await page.keyboard.press('End');check('last boundary',await current()==='slide-15'&&await page.locator('#next').isDisabled());
await page.keyboard.press('ArrowRight');check('cannot pass page 15',await current()==='slide-15');
await page.keyboard.press('Home');check('Home returns first',await current()==='slide-1');
for(const n of [3,4,8,9,11,12]){await page.locator(`[data-chapter="${n}"]`).click();check(`chapter ${n}`,await current()===`slide-${n}`);}
await page.selectOption('#page-select','4');await page.locator('[data-switcher="transport"] [data-choice="1"]').click();
check('transport public panel',await page.locator('[data-switcher="transport"] [data-panel="1"]').isVisible()&&!await page.locator('[data-switcher="transport"] [data-panel="0"]').isVisible());
await page.locator('[data-switcher="transport"] [data-choice="0"]').click();check('transport driving panel',await page.locator('[data-switcher="transport"] [data-panel="0"]').isVisible());
for(const [n,key,count] of [[7,'bus',2],[8,'stay',4],[9,'east',2],[11,'food',3],[13,'itinerary',2]]){
 await page.selectOption('#page-select',String(n));for(let i=0;i<count;i++){await page.locator(`[data-switcher="${key}"] [data-choice="${i}"]`).click();check(`${key} choice ${i}`,await page.locator(`[data-switcher="${key}"] [data-panel="${i}"]`).isVisible());}
}
await page.selectOption('#page-select','2');for(let i=0;i<4;i++){await page.locator(`[data-region="${i}"]`).click();check(`region ${i}`,await page.locator(`[data-region="${i}"]`).getAttribute('aria-pressed')==='true');}
await page.selectOption('#page-select','6');for(const answer of ['wrong','right']){await page.locator(`[data-answer="${answer}"]`).click();check(`quiz ${answer}`, (await page.locator('#quiz-feedback').textContent()).includes(answer==='right'?'答對了':'多一個步驟'));}
await page.selectOption('#page-select','12');for(const summary of await page.locator('#slide-12 summary').all()){await summary.click();check('day expandable',await summary.evaluate(e=>e.parentElement.open));}
await page.selectOption('#page-select','14');for(const input of await page.locator('[data-check^="final-"]').all())await input.check();
check('checklist completion',(await page.locator('#check-progress').textContent()).includes('6／6'));await page.locator('#reset-checks').click();check('checklist reset',await page.locator('[data-check^="final-"]:checked').count()===0);
// Keyboard activation and select-focus arrow handling.
await page.selectOption('#page-select','4');await page.locator('[data-switcher="transport"] [data-choice="1"]').focus();await page.keyboard.press('Enter');check('keyboard activates comparison',await page.locator('[data-switcher="transport"] [data-panel="1"]').isVisible());
await page.locator('#page-select').focus();await page.keyboard.press('ArrowLeft');check('arrow key does not hijack select',await current()===`slide-${await page.locator('#page-select').inputValue()}` && Math.abs(Number(await page.locator('#page-select').inputValue())-4)<=1);
await page.goto('http://127.0.0.1:8765/#slide-9');check('direct page hash',await current()==='slide-9');
await page.goto('http://127.0.0.1:8765/#slide-999');check('invalid high page clamped',await current()==='slide-15');
// All viewports: all pages, horizontal overflow, reachable source footer, and screenshots.
for(const [label,width,height] of [['desktop',1440,960],['laptop',1366,768],['mobile',390,844],['small-mobile',320,740]]){
 await page.setViewportSize({width,height});
 for(let n=1;n<=15;n++){
  await page.selectOption('#page-select',String(n));await page.waitForTimeout(40);
  const size=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,view:innerWidth,reader:document.querySelector('.reader').scrollWidth,readerWidth:document.querySelector('.reader').clientWidth}));
  const overflow=size.doc>size.view+1||size.reader>size.readerWidth+1;
  report.layouts.push({viewport:label,page:n,width,height,horizontal_overflow:overflow,...size});
  if(overflow)report.errors.push(`Overflow ${label} page ${n}: ${JSON.stringify(size)}`);
  const sources=page.locator('.slide:visible .sources');await sources.scrollIntoViewIfNeeded();check(`source footer reachable ${label} ${n}`,await sources.isVisible());
  await page.locator('.reader').evaluate(e=>{e.scrollTop=0;});
  if(label==='desktop'||label==='mobile'){
   await page.screenshot({path:path.join(output,`${label}-${String(n).padStart(2,'0')}.png`),animations:'disabled'});report.screenshots.push(`${label}-${String(n).padStart(2,'0')}.png`);
  }
 }
}
// All local HTML/CSS/image/script targets and Wiki routes, without hitting external sites.
const links=await page.locator('a[href],img[src],script[src],link[href]').evaluateAll(els=>els.map(e=>e.getAttribute('href')||e.getAttribute('src')));
let localCount=0;
for(const target of links){if(/^(https?:|mailto:)/.test(target))continue;const [file,hash]=target.split('#');if(file){localCount++;check(`local target ${file}`,fs.existsSync(path.join(root,file)));}if(file==='wiki.html'&&hash)check(`Wiki route ${hash}`,fs.existsSync(path.join(root,'wiki',hash)));}
report.local_target_checks=localCount;
await page.selectOption('#page-select','1');check('SVG image loaded',await page.locator('.hero-art img').evaluate(e=>e.complete&&e.naturalWidth>0));
const [wikiPage]=await Promise.all([context.waitForEvent('page'),page.locator('#slide-1 .sources a').first().click()]);await wikiPage.waitForLoadState();check('source link opens readable Wiki',await wikiPage.locator('.wiki-article:visible').count()===1);await wikiPage.close();
await page.goto('http://127.0.0.1:8765/wiki.html#sources/SRC-04.md');check('Wiki source route',(await page.locator('.wiki-article:visible').getAttribute('data-wiki'))==='sources/SRC-04.md');
await page.locator('.wiki-article:visible a[href="#topics/transport.md"]').click();check('Wiki reciprocal navigation',(await page.locator('.wiki-article:visible').getAttribute('data-wiki'))==='topics/transport.md');
// Real touch emulation: interactions rather than viewport size alone.
const touchContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const touch=await touchContext.newPage();await touch.goto('http://127.0.0.1:8765/#slide-4');await touch.locator('[data-switcher="transport"] [data-choice="1"]').tap();check('touch comparison',await touch.locator('[data-switcher="transport"] [data-panel="1"]').isVisible());await touch.locator('#next').tap();check('touch next',(await touch.locator('.slide:visible').getAttribute('id'))==='slide-5');await touchContext.close();
// file:// offline preview, no HTTP server needed.
await page.goto(pathToFileURL(path.join(root,'index.html')).href);check('file preview loads',await current()==='slide-1');await page.locator('#next').click();check('file preview interaction',await current()==='slide-2');
await page.goto(pathToFileURL(path.join(root,'wiki.html')).href+'#sources/SRC-05.md');check('file Wiki source view',(await page.locator('.wiki-article:visible').getAttribute('data-wiki'))==='sources/SRC-05.md');
check('no browser JavaScript errors',consoleErrors.length===0,consoleErrors.join('\n'));check('no failed local requests',failedRequests.length===0,failedRequests.join('\n'));
report.console_errors=consoleErrors;report.failed_requests=failedRequests;
await browser.close();report.passed=report.errors.length===0;fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,layouts:report.layouts.length,screenshots:report.screenshots.length,errors:report.errors},null,2));process.exitCode=report.passed?0:1;
}
main().catch(e=>{report.errors.push(String(e));fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));console.error(e);process.exitCode=1;});
