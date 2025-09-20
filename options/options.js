const DEFAULTS = {
  replaceCopiedLink: true,
  hideGrok: true,
  hidePremiumSignUp: true,
  hideSelectors: true,
  hideVerifiedOrgs: true,
  hideother: true,
  hideExplore: false,
  hideNotifications: false,
  hideBookmarks: false,
  hideMessages: false,
  hideCommunities: false,
  hideMutedNotices: false,
  hideRightColumn: false,
  useLargerCSS: false,
  cssWidth: 680,
  useCustomPadding: false,
  paddingWidth: 20
};

function h(tag, props = {}, children = []){
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k,v])=>{
    if (k === 'class') el.className = v; else if (k === 'text') el.textContent = v; else el.setAttribute(k, v);
  });
  [].concat(children).forEach(c=>{ if (typeof c === 'string') el.appendChild(document.createTextNode(c)); else if (c) el.appendChild(c); });
  return el;
}

function render(items){
  const mount = document.getElementById('mount');
  mount.innerHTML = '';
  
  // Create sections like original script
  const sections = [
    {
      title: chrome.i18n.getMessage('hideGrok') || 'Hide Elements',
      keys: ['replaceCopiedLink', 'hideGrok', 'hidePremiumSignUp', 'hideSelectors', 'hideVerifiedOrgs', 'hideother']
    },
    {
      title: chrome.i18n.getMessage('hideExplore') || 'Hide Navigation',
      keys: ['hideExplore', 'hideNotifications', 'hideMessages', 'hideCommunities', 'hideBookmarks']
    },
    {
      title: chrome.i18n.getMessage('hideMutedNotices') || 'Hide Notices',
      keys: ['hideMutedNotices', 'hideRightColumn']
    },
    {
      title: chrome.i18n.getMessage('useLargerCSS') || 'Layout Settings',
      keys: ['useLargerCSS', 'cssWidth', 'useCustomPadding', 'paddingWidth']
    }
  ];
  
  sections.forEach(section => {
    const sectionDiv = h('div', {class:'section'}, [
      h('h2', {class:'section-title', text: section.title})
    ]);
    
    const grid = h('div', {class:'grid'});
    section.keys.forEach(key => {
      if (typeof DEFAULTS[key] === 'boolean'){
        const row = h('label', {class:'row'}, [
          h('input', {type:'checkbox', id:key}),
          h('span', {text: chrome.i18n.getMessage(key) || key})
        ]);
        grid.appendChild(row);
      } else {
        const row = h('div', {class:'row'}, [
          h('span', {text: chrome.i18n.getMessage(key) || key}),
          h('div', {class:'input-wrapper'}, [
            h('input', {type:'number', id:key, min:key==='cssWidth'?'400':'0', max:key==='cssWidth'?'1200':'100'}),
            h('span', {class:'unit', text:'px'})
          ])
        ]);
        grid.appendChild(row);
      }
    });
    
    sectionDiv.appendChild(grid);
    mount.appendChild(sectionDiv);
  });
  
  const actions = h('div', {class:'actions'}, [
    h('button', {id:'save', class:'primary', text: chrome.i18n.getMessage('save') || 'Save'}),
  ]);
  mount.appendChild(actions);

  chrome.storage.sync.get(DEFAULTS, (state)=>{
    Object.keys(DEFAULTS).forEach(k=>{
      const el = document.getElementById(k);
      if (!el) return;
      if (typeof DEFAULTS[k] === 'boolean') el.checked = !!state[k];
      else el.value = state[k];
    });
  });

  // Add linkage: hideRightColumn -> useLargerCSS (one-way)
  const rightColumnEl = document.getElementById('hideRightColumn');
  const largerCSSEl = document.getElementById('useLargerCSS');
  if (rightColumnEl && largerCSSEl) {
    rightColumnEl.addEventListener('change', () => {
      if (rightColumnEl.checked) {
        largerCSSEl.checked = true;
      } else {
        largerCSSEl.checked = false;
      }
    });
    // useLargerCSS can be toggled independently, no reverse linkage
  }

  document.getElementById('save').addEventListener('click', ()=>{
    const data = {};
    Object.keys(DEFAULTS).forEach(k=>{
      const el = document.getElementById(k);
      if (!el) return;
      if (typeof DEFAULTS[k] === 'boolean') data[k] = el.checked; else data[k] = Number(el.value) || DEFAULTS[k];
    });
    chrome.storage.sync.set(data, ()=>{
      // Show success feedback
      const btn = document.getElementById('save');
      const originalText = btn.textContent;
      btn.textContent = chrome.i18n.getMessage('save') === '保存' ? '已保存!' : 'Saved!';
      btn.style.background = '#00ba7c';
      
      // Only reload Twitter/X tabs
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          if (tab.url && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
            chrome.tabs.reload(tab.id);
          }
        });
      });
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#1d9bf0';
      }, 1500);
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  // simple i18n apply for static header
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.textContent = msg;
  });
  render();
});


