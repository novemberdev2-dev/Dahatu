(function(){
  const IMG = window.DAHATU_IMAGES;

  // ===== DATA =====
  const COURSES = [
    { id:'electrical', title:'ئەندازیاری کارەبا', img:IMG.electrical, score:8.2, cat:'endaziyari', stream:'zanisti', own:'gov' },
    { id:'mechanical', title:'ئەندازیاری میکانیک', img:IMG.mechanical, score:7.3, cat:'endaziyari', stream:'zanisti', own:'gov' },
    { id:'programming', title:'پڕۆگرامسازی', img:IMG.programming, score:9.1, cat:'endaziyari', stream:'zanisti', own:'private' },
    { id:'generalmed', title:'پزیشکی گشتی', img:IMG.generalmed, score:8.5, cat:'pizishki', stream:'zanisti', own:'gov' },
    { id:'nursing', title:'پەرستاری', img:IMG.nursing, score:7.3, cat:'pizishki', stream:'zanisti', own:'gov' },
    { id:'architecture', title:'تەلارسازی', img:IMG.architecture, score:8.0, cat:'endaziyari', stream:'zanisti', own:'private' },
    { id:'dentistry', title:'دکتۆری ددان', img:IMG.dentistry, score:9.4, cat:'pizishki', stream:'zanisti', own:'gov' },
    { id:'pharmacy', title:'دەرمانسازی', img:IMG.pharmacy, score:7.4, cat:'pizishki', stream:'zanisti', own:'private' },
    { id:'aviation', title:'فڕۆکەوانی', img:IMG.aviation, score:8.8, cat:'other', stream:'zanisti', own:'private' },
    { id:'veterinary', title:'ڤێرتێرنەری', img:IMG.veterinary, score:6.8, cat:'pizishki', stream:'zanisti', own:'gov' },
    { id:'law', title:'قانوون', img:IMG.law, score:6.0, cat:'other', stream:'edebi', own:'gov' },
    { id:'roadbuilding', title:'ئەندازیاری ڕێگاو بان', img:IMG.roadbuilding, score:6.0, cat:'endaziyari', stream:'zanisti', own:'gov' },
  ];

  const LANG_COURSES = [
    { id:'lang-en', title:'زمانی ئینگلیزی', flag:'🇬🇧', grad:'linear-gradient(135deg,#1d3557,#457b9d)', score:4.6, cat:'zaman', stream:'edebi', own:'gov' },
    { id:'lang-fa', title:'زمانی فارسی', flag:'🇮🇷', grad:'linear-gradient(135deg,#264653,#2a9d8f)', score:5.6, cat:'zaman', stream:'edebi', own:'gov' },
    { id:'lang-zh', title:'زمانی چینی', flag:'🇨🇳', grad:'linear-gradient(135deg,#7f1d1d,#b91c1c)', score:4.0, cat:'zaman', stream:'edebi', own:'private' },
    { id:'lang-fr', title:'زمانی فەڕەنسی', flag:'🇫🇷', grad:'linear-gradient(135deg,#1e3a8a,#3730a3)', score:3.9, cat:'zaman', stream:'edebi', own:'private' },
    { id:'lang-de', title:'زمانی ئەڵمانی', flag:'🇩🇪', grad:'linear-gradient(135deg,#3a3a3a,#111111)', score:5.0, cat:'zaman', stream:'edebi', own:'gov' },
  ];

  const ALL_ITEMS = COURSES.concat(LANG_COURSES);

  // ===== STATE =====
  let state = {
    homeCat: 'all',
    uniType: 'zanko',
    uniOwn: 'all',
    stream: 'all',
    sort: null, // 'asc' | 'desc' | null
  };

  // ===== HELPERS =====
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

  function toast(msg){
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(()=> t.classList.remove('show'), 2200);
  }

  function applyStreamAndSort(list){
    let out = list.slice();
    if(state.stream !== 'all'){
      out = out.filter(c => c.stream === state.stream);
    }
    if(state.sort === 'asc') out.sort((a,b)=> a.score - b.score);
    if(state.sort === 'desc') out.sort((a,b)=> b.score - a.score);
    return out;
  }

  function cardHTML(item){
    if(item.flag){
      return `<div class="card" data-id="${item.id}">
        <div class="card-lang" style="background:${item.grad}">
          <div class="flag">${item.flag}</div>
          <div class="card-title-on-img" style="position:static; text-shadow:none;">${item.title}</div>
          <div class="card-badge" style="position:absolute;bottom:8px;right:8px;"><span class="star">★</span> ${item.score}</div>
        </div>
        <div class="card-caption">${item.title}</div>
      </div>`;
    }
    return `<div class="card" data-id="${item.id}">
      <div class="card-img">
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="card-badge"><span class="star">★</span> ${item.score}</div>
      </div>
      <div class="card-caption">${item.title}</div>
    </div>`;
  }

  function renderGrid(container, items){
    if(items.length === 0){
      container.innerHTML = `<div class="empty-note" style="grid-column:1/-1;">هیچ ئەنجامێک نەدۆزرایەوە</div>`;
      return;
    }
    container.innerHTML = items.map(cardHTML).join('');
  }

  // Departments that have their own dedicated detail page. Clicking their
  // card image navigates to that page instead of opening the quick modal.
  const DETAIL_PAGES = {
    generalmed: 'medicine.html',
    programming: 'programming.html'
  };

  function bindCardClicks(container){
    container.querySelectorAll('.card').forEach(el=>{
      el.addEventListener('click', ()=>{
        const id = el.getAttribute('data-id');
        if(DETAIL_PAGES[id]){
          window.location.href = DETAIL_PAGES[id];
          return;
        }
        const item = ALL_ITEMS.find(c=>c.id===id);
        if(item) openDetail(item);
      });
    });
  }

  // ===== HOME PAGE =====
  function renderHome(){
    let items;
    if(state.homeCat === 'all'){
      items = ALL_ITEMS;
    } else {
      items = ALL_ITEMS.filter(c => c.cat === state.homeCat);
    }
    items = applyStreamAndSort(items);
    const grid = $('#homeGrid');
    renderGrid(grid, items);
    bindCardClicks(grid);
  }

  $all('#homeTabs .tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      $all('#homeTabs .tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      state.homeCat = tab.getAttribute('data-cat');
      renderHome();
    });
  });

  // ===== UNIVERSITIES PAGE =====
  function renderUni(){
    let items = ALL_ITEMS.slice();
    if(state.uniOwn !== 'all'){
      items = items.filter(c => c.own === state.uniOwn);
    }
    items = applyStreamAndSort(items);
    const grid = $('#uniGrid');
    renderGrid(grid, items);
    bindCardClicks(grid);
  }

  $('#uniSwitchBtn').addEventListener('click', (e)=>{
    e.stopPropagation();
    $('#uniDropdown').classList.toggle('show');
  });
  $all('#uniDropdown .opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      $all('#uniDropdown .opt').forEach(o=>o.classList.remove('active'));
      opt.classList.add('active');
      state.uniType = opt.getAttribute('data-type');
      $('#uniSwitchLabel').textContent = state.uniType === 'zanko' ? 'زانکۆکان' : 'پەیمانگاکان';
      $('#uniDropdown').classList.remove('show');
      renderUni();
    });
  });
  $all('#uniTabs .tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      $all('#uniTabs .tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      state.uniOwn = tab.getAttribute('data-own');
      renderUni();
    });
  });

  // ===== GRADE FINDER =====
  $('#finderSearch').addEventListener('click', ()=>{
    const gradeVal = parseFloat($('#gradeInput').value);
    const stream = $('#finderStream').value;
    const type = $('#finderType').value;
    const resultsEl = $('#finderResults');

    if(isNaN(gradeVal)){
      toast('تکایە نمرەکەت بنووسە');
      return;
    }
    let items = ALL_ITEMS.filter(c => c.stream === stream && c.score <= gradeVal);
    // "type" (zanko/peymanga) filter reserved for when that data distinction is available.
    items.sort((a,b)=> b.score - a.score);

    if(items.length === 0){
      resultsEl.innerHTML = `<h4>ئەنجامەکان</h4><div class="empty-note">بەداخەوە بەشێکی گونجاو بۆ ئەم نمرەیە نەدۆزرایەوە</div>`;
      return;
    }
    resultsEl.innerHTML = `<h4>بەشە گونجاوەکان بۆ نمرەی ${gradeVal}</h4>` + items.map(it=>`
      <div class="result-row" data-id="${it.id}">
        ${it.img ? `<img src="${it.img}">` : `<div style="width:46px;height:60px;border-radius:8px;background:${it.grad||'#333'};display:flex;align-items:center;justify-content:center;font-size:20px;">${it.flag||''}</div>`}
        <div class="rname">${it.title}</div>
        <div class="rscore">★ ${it.score}</div>
      </div>
    `).join('');
    resultsEl.querySelectorAll('.result-row').forEach(row=>{
      row.addEventListener('click', ()=>{
        const id = row.getAttribute('data-id');
        if(DETAIL_PAGES[id]){
          window.location.href = DETAIL_PAGES[id];
          return;
        }
        const item = ALL_ITEMS.find(c=>c.id === id);
        if(item) openDetail(item);
      });
    });
  });

  $('#finderReset').addEventListener('click', ()=>{
    $('#gradeInput').value = '';
    $('#finderStream').value = 'zanisti';
    $('#finderType').value = 'all';
    $('#finderResults').innerHTML = '';
  });

  // ===== SEARCH =====
  // Returns the grid element + base item list for whichever page is
  // currently visible, so search can filter in place without ever
  // clearing/hiding the grid of image boxes.
  function getActiveSearchTarget(){
    if($('#page-uni').style.display !== 'none'){
      let items = ALL_ITEMS.slice();
      if(state.uniOwn !== 'all'){
        items = items.filter(c => c.own === state.uniOwn);
      }
      return { grid: $('#uniGrid'), items: applyStreamAndSort(items), restore: renderUni };
    }
    // default: home page
    let items = state.homeCat === 'all' ? ALL_ITEMS : ALL_ITEMS.filter(c => c.cat === state.homeCat);
    return { grid: $('#homeGrid'), items: applyStreamAndSort(items), restore: renderHome };
  }

  $('#searchToggle').addEventListener('click', ()=>{
    $('#topbarActions').style.display = 'none';
    $('#headerSearchRow').style.display = 'flex';
    $('#searchInput').value = '';
    $('#searchInput').focus();
  });
  $('#searchBack').addEventListener('click', closeSearch);
  function closeSearch(){
    $('#headerSearchRow').style.display = 'none';
    $('#topbarActions').style.display = 'flex';
    $('#searchInput').value = '';
    const target = getActiveSearchTarget();
    target.restore();
  }
  $('#searchClearBtn').addEventListener('click', ()=>{
    $('#searchInput').value = '';
    const target = getActiveSearchTarget();
    target.restore();
    $('#searchInput').focus();
  });
  $('#searchInput').addEventListener('input', (e)=>{
    const q = e.target.value.trim();
    const target = getActiveSearchTarget();
    if(q === ''){
      target.restore();
      return;
    }
    const items = target.items.filter(c => c.title.includes(q));
    renderGrid(target.grid, items);
    bindCardClicks(target.grid);
  });

  // ===== FILTER PANEL =====
  $('#filterToggle').addEventListener('click', (e)=>{
    e.stopPropagation();
    $('#filterPanel').classList.toggle('show');
    $('#profilePanel').classList.remove('show');
  });
  $('#streamSelect').addEventListener('change', (e)=>{
    state.stream = e.target.value;
    refreshCurrentView();
  });
  $('#sortLowHigh').addEventListener('click', ()=>{
    const on = !$('#sortLowHigh').classList.contains('on');
    $('#sortLowHigh').classList.toggle('on', on);
    $('#sortHighLow').classList.remove('on');
    state.sort = on ? 'asc' : null;
    refreshCurrentView();
  });
  $('#sortHighLow').addEventListener('click', ()=>{
    const on = !$('#sortHighLow').classList.contains('on');
    $('#sortHighLow').classList.toggle('on', on);
    $('#sortLowHigh').classList.remove('on');
    state.sort = on ? 'desc' : null;
    refreshCurrentView();
  });

  function refreshCurrentView(){
    const activePage = $('#page-home').style.display !== 'none' ? 'home'
      : $('#page-uni').style.display !== 'none' ? 'uni' : null;
    if(activePage === 'home') renderHome();
    if(activePage === 'uni') renderUni();
  }

  // ===== PROFILE PANEL =====
  $('#avatarToggle').addEventListener('click', (e)=>{
    e.stopPropagation();
    $('#profilePanel').classList.toggle('show');
    $('#filterPanel').classList.remove('show');
  });
  document.addEventListener('click', ()=>{
    $('#filterPanel').classList.remove('show');
    $('#profilePanel').classList.remove('show');
    $('#uniDropdown').classList.remove('show');
  });

  $('#darkSwitch').addEventListener('click', (e)=>{
    e.stopPropagation();
    const on = !$('#darkSwitch').classList.contains('on');
    $('#darkSwitch').classList.toggle('on', on);
    document.documentElement.classList.toggle('dark', on);
  });

  $all('.profile-row').forEach(row=>{
    row.addEventListener('click', (e)=>{
      const action = row.getAttribute('data-action');
      if(action === 'dark') return; // handled separately
      e.stopPropagation();
      toast('بەردەست نییە لە ئێستادا');
      $('#profilePanel').classList.remove('show');
    });
  });

  // ===== SIDEBAR =====
  function openSidebar(){
    $('#sidebar').classList.add('open');
    $('#sidebarScrim').classList.add('show');
  }
  function closeSidebar(){
    $('#sidebar').classList.remove('open');
    $('#sidebarScrim').classList.remove('show');
  }
  $('#sidebarToggle').addEventListener('click', openSidebar);
  $('#sidebarClose').addEventListener('click', closeSidebar);
  $('#sidebarScrim').addEventListener('click', closeSidebar);

  $all('.side-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      $all('.side-item').forEach(i=>i.classList.remove('active'));
      item.classList.add('active');
      const page = item.getAttribute('data-page');
      showPage(page, item.getAttribute('data-label'));
      closeSidebar();
      closeSearch();
    });
  });

  function showPage(page, label){
    $('#page-home').style.display = page === 'home' ? 'block' : 'none';
    $('#page-uni').style.display = page === 'uni' ? 'block' : 'none';
    $('#page-finder').style.display = page === 'finder' ? 'block' : 'none';
    $('#page-placeholder').style.display = page === 'placeholder' ? 'block' : 'none';
    if(page === 'placeholder'){
      $('#placeholderLabel').textContent = 'بەردەست نییە لە ئێستادا';
    }
    window.scrollTo({top:0, behavior:'smooth'});
  }

  // ===== DETAIL MODAL =====
  function openDetail(item){
    const streamLabel = item.stream === 'zanisti' ? 'لقی زانستی' : 'لقی ئەدەبی';
    const ownLabel = item.own === 'gov' ? 'زانکۆ/پەیمانگای حکومی' : 'زانکۆ/پەیمانگای تایبەت';
    const media = item.img
      ? `<img class="modal-img" src="${item.img}" alt="${item.title}">`
      : `<div class="modal-img" style="background:${item.grad};display:flex;align-items:center;justify-content:center;font-size:56px;">${item.flag}</div>`;
    $('#modalSheet').innerHTML = `
      ${media}
      <div class="modal-title">${item.title}</div>
      <div class="modal-tags">
        <span class="modal-tag">★ کەمترین نمرە: ${item.score}</span>
        <span class="modal-tag">${streamLabel}</span>
        <span class="modal-tag">${ownLabel}</span>
      </div>
      <div style="color:var(--text-dim); font-size:13.5px; line-height:1.8;">
        زانیاری تەواو دەربارەی ئەم بەشە لە ماوەیەکی داهاتوودا زیاد دەکرێت. ئەمە تەنها نمایشێکی سەرەتاییە بۆ تاقیکردنەوە.
      </div>
      <button class="btn primary modal-close" id="modalCloseBtn">داخستن</button>
    `;
    $('#modalScrim').classList.add('show');
    $('#modalCloseBtn').addEventListener('click', closeDetail);
  }
  function closeDetail(){ $('#modalScrim').classList.remove('show'); }
  $('#modalScrim').addEventListener('click', (e)=>{
    if(e.target.id === 'modalScrim') closeDetail();
  });

  // ===== INIT =====
  renderHome();
  renderUni();
})();
