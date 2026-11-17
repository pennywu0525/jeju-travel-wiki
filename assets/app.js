(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const reader = document.querySelector('.reader');
  const select = document.querySelector('#page-select');
  const prev = document.querySelector('#previous');
  const next = document.querySelector('#next');
  let current = 1;
  function go(value, updateHash = true) {
    current = Math.min(slides.length, Math.max(1, Number(value) || 1));
    slides.forEach((slide, i) => { slide.hidden = i !== current - 1; });
    select.value = String(current);
    prev.disabled = current === 1;
    next.disabled = current === slides.length;
    document.querySelector('#page-counter').textContent = `${String(current).padStart(2,'0')} / 15`;
    document.querySelector('.progress-fill').style.width = `${current / slides.length * 100}%`;
    document.querySelector('#page-status').textContent = `第 ${current} 頁，共 15 頁：${slides[current-1].dataset.title}`;
    document.title = `${slides[current-1].dataset.title}｜濟州自由行`;
    document.querySelectorAll('[data-chapter]').forEach(b => {
      const ranges = {3:[3,3],4:[4,7],8:[8,8],9:[9,10],11:[11,11],12:[12,14]};
      const range = ranges[b.dataset.chapter];
      b.setAttribute('aria-current', String(current >= range[0] && current <= range[1]));
    });
    if(updateHash) history.replaceState(null,'',`#slide-${current}`);
    reader.scrollTop = 0;
  }
  prev.addEventListener('click', () => go(current-1));
  next.addEventListener('click', () => go(current+1));
  select.addEventListener('change', () => go(select.value));
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  document.querySelectorAll('[data-chapter]').forEach(b => b.addEventListener('click', () => go(b.dataset.chapter)));
  document.addEventListener('keydown', e => {
    if(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest('input,select,textarea,[contenteditable=true]')) return;
    if(e.key === 'ArrowRight') {e.preventDefault();go(current+1);}
    if(e.key === 'ArrowLeft') {e.preventDefault();go(current-1);}
    if(e.key === 'Home') {e.preventDefault();go(1);}
    if(e.key === 'End') {e.preventDefault();go(slides.length);}
  });
  window.addEventListener('hashchange', () => go(location.hash.match(/^#slide-(\d+)$/)?.[1], false));
  document.querySelectorAll('[data-switcher]').forEach(group => {
    group.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
      group.querySelectorAll('[data-choice]').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
      group.querySelectorAll('[data-panel]').forEach(panel => {panel.hidden = panel.dataset.panel !== button.dataset.choice;});
    }));
  });
  const regions = [
    ['北部市區','市場與城市散步','東門市場、中央地下街與七星路。抵達或離境日，依航班挑一個逛街點。'],
    ['東部','城山與離島選項','城山日出峰、牛島與涉地可支。先選主活動；安排牛島前，先確認船班與回程。'],
    ['西部','海邊與咖啡時間','涯月咖啡街、挾才海邊。以散步或休息為主，天候與店家開放仍須查詢。'],
    ['南部','海岸地景與西歸浦','柱狀節理、正房瀑布與中文觀光區。選一個自然景點，再配市區或休息。']
  ];
  document.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const [tag,title,body] = regions[Number(button.dataset.region)];
    const panel = document.querySelector('#region-info');
    panel.querySelector('.tag').textContent=tag;panel.querySelector('h3').textContent=title;panel.querySelector('p').textContent=body;
  }));
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-answer]').forEach(b=>{delete b.dataset.result;b.setAttribute('aria-pressed',String(b===button));});
    button.dataset.result=button.dataset.answer;
    document.querySelector('#quiz-feedback').textContent=(button.dataset.answer==='right'?'答對了。':'還要多一個步驟：')+'無右轉專用號誌、前方車輛號誌紅燈時，無論有無行人，均須先在停止線或行人穿越道前停車。轉彎仍須停讓行人；有專用號誌則依綠箭頭。';
  }));
  function updateChecks(){const inputs=[...document.querySelectorAll('[data-check^="final-"]')];document.querySelector('#check-progress').textContent=`已完成 ${inputs.filter(i=>i.checked).length}／6 項自查`;}
  document.querySelectorAll('[data-check]').forEach(input=>input.addEventListener('change',updateChecks));
  document.querySelector('#reset-checks').addEventListener('click',()=>{document.querySelectorAll('[data-check^="final-"]').forEach(i=>{i.checked=false;});updateChecks();});
  go(location.hash.match(/^#slide-(\d+)$/)?.[1]);
})();
