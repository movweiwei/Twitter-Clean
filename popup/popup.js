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

function byId(id){return document.getElementById(id)}

function load(){
  chrome.storage.sync.get(DEFAULTS, (items)=>{
    Object.keys(DEFAULTS).forEach(k=>{
      if (typeof DEFAULTS[k] === 'boolean') byId(k).checked = !!items[k];
      else byId(k).value = items[k];
    });
  })
}

function save(){
  const data = {};
  Object.keys(DEFAULTS).forEach(k=>{
    if (typeof DEFAULTS[k] === 'boolean') data[k] = byId(k).checked;
    else data[k] = Number(byId(k).value) || DEFAULTS[k];
  })
  chrome.storage.sync.set(data, ()=>{
    chrome.tabs.query({active:true,currentWindow:true}, tabs=>{
      if (tabs[0]) {
        const url = tabs[0].url;
        // Only reload if on Twitter/X domains
        if (url && (url.includes('twitter.com') || url.includes('x.com'))) {
          chrome.tabs.reload(tabs[0].id);
        }
      }
      window.close();
    })
  })
}

function applyI18n(){
  const t = (k)=> chrome.i18n.getMessage(k) || k;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  applyI18n();
  load();
  byId('save').addEventListener('click', save)
  // linkage: hideRightColumn -> useLargerCSS (one-way)
  const right = byId('hideRightColumn');
  const larger = byId('useLargerCSS');
  if (right && larger){
    right.addEventListener('change', ()=>{
      if (right.checked) {
        larger.checked = true;
      } else {
        larger.checked = false;
      }
    });
    // useLargerCSS can be toggled independently, no reverse linkage
  }
});


