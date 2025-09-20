(function() {
  'use strict';

  // IMMEDIATE EXIT if not on Twitter/X domains
  const hostname = window.location.hostname;
  const url = window.location.href;
  const isTwitterDomain = (hostname === 'twitter.com' || hostname === 'x.com' || 
                           hostname.endsWith('.twitter.com') || hostname.endsWith('.x.com')) &&
                          (url.includes('twitter.com') || url.includes('x.com'));
  
  if (!isTwitterDomain) {
    console.log('X Clean: Not on Twitter/X domain, exiting immediately. Current URL:', url);
    return;
  }
  
  console.log('X Clean: Running on Twitter/X domain:', url);

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

  let settings = { ...DEFAULTS };

  function loadSettings() {
    return new Promise(resolve => {
      chrome.storage.sync.get(DEFAULTS, items => {
        settings = { ...DEFAULTS, ...items };
        if (settings.hideRightColumn) settings.useLargerCSS = true;
        resolve(settings);
      });
    });
  }

  // Feature 1: Replace copied links x.com -> twitter.com
  function handleCopyFix() {
    if (!settings.replaceCopiedLink) return;
    document.addEventListener('copy', () => {
      try {
        const selection = window.getSelection().toString();
        if (selection && selection.startsWith('https://x.com/')) {
          const modified = selection.replace('https://x.com/', 'https://twitter.com/');
          navigator.clipboard.writeText(modified).catch(() => {});
        }
      } catch (e) {}
    });
  }

  // Utilities
  function addGlobalStyle(css) {
    // Only apply styles on Twitter/X domains
    if (!checkTwitterDomain()) return null;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
    return style;
  }

  function checkTwitterDomain() {
    // Since we already checked at the top, just return true
    return true;
  }

  // Observers that mirror the userscript behaviors
  function initHideSelectors() {
    if (!settings.hideSelectors || !checkTwitterDomain()) return;
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll('.css-175oi2r.r-1habvwh.r-eqz5dr.r-uaa2di.r-1mmae3n.r-3pj75a.r-bnwqim');
      elements.forEach(el => {
        const parent = el.closest('div');
        if (parent) parent.remove();
      });

      const verifiedUpsell = document.querySelectorAll('.css-175oi2r.r-yfoy6g.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x[data-testid="verified_profile_upsell"]');
      verifiedUpsell.forEach(el => {
        const parent = el.closest('div');
        if (parent) parent.remove(); else el.remove();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    addGlobalStyle('.css-175oi2r.r-1xpp3t0{display:none!important}.css-175oi2r.r-yfoy6g.r-18bvks7.r-1q9bdsx.r-rs99b7{display:none!important}');
  }

  function initHideGrok() {
    if (!settings.hideGrok || !checkTwitterDomain()) return;
    const targetPathD = "M2.205 7.423L11.745 21h4.241L6.446 7.423H2.204zm4.237 7.541L2.2 21h4.243l2.12-3.017-2.121-3.02zM16.957 0L9.624 10.435l2.122 3.02L21.2 0h-4.243zm.767 6.456V21H21.2V1.51l-3.476 4.946z";
    const observer = new MutationObserver(() => {
      const svgs = document.querySelectorAll('svg[aria-hidden="true"].r-4qtqp9');
      svgs.forEach(svg => {
        const path = svg.querySelector('path');
        if (path && path.getAttribute('d') === targetPathD) {
          const container = svg.closest('button') || svg.closest('div');
          if (container) container.remove();
        }
      });

      document.querySelectorAll('button[data-testid="grokImgGen"]').forEach(btn => btn.remove());
    });
    observer.observe(document.body, { childList: true, subtree: true });
    addGlobalStyle('a[href="/i/grok"]{display:none!important}.css-175oi2r.r-1867qdf.r-xnswec.r-13awgt0.r-1ce3o0f.r-1udh08x.r-u8s1d.r-13qz1uu.r-173mn98.r-1e5uvyk.r-ii8lfi.r-40lpo0.r-rs99b7.r-12jitg0{display:none}.css-175oi2r.r-16y2uox.r-1wbh5a2.r-tzz3ar.r-1pi2tsx.r-buy8e9.r-mfh4gg.r-2eszeu.r-10m9thr.r-lltvgl.r-18u37iz.r-9aw3ui{display:none}.css-175oi2r.r-1s2bzr4.r-dnmrzs.r-bnwqim{display:none}');
  }

  function initHideCommunities() {
    if (!settings.hideCommunities || !checkTwitterDomain()) return;
    const targetCommunitiesPathD = "M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z";
    const observer = new MutationObserver(() => {
      const svgs = document.querySelectorAll('svg[aria-hidden="true"].r-4qtqp9');
      svgs.forEach(svg => {
        const path = svg.querySelector('path');
        if (path && path.getAttribute('d') === targetCommunitiesPathD) {
          const container = svg.closest('a') || svg.closest('div');
          if (container) container.remove();
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyCSSFromSettings() {
    // Only apply on Twitter/X domains
    if (!checkTwitterDomain()) return;
    
    let css = '';
    if (settings.hidePremiumSignUp) css += 'a[href="/i/premium_sign_up"]{display:none!important}';
    if (settings.hideVerifiedOrgs) css += 'a[href="/i/verified-orgs-signup"]{display:none!important}';
    if (settings.hideother) {
      css += 'a[href="/jobs"]{display:none!important}';
      css += '.css-175oi2r.r-l00any.r-109y4c4.r-kuekak{display:none!important}';
      css += 'a.css-175oi2r.r-5oul0u.r-knv0ih.r-faml9v.r-2dysd3.r-13qz1uu.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21{display:none!important}';
      css += 'a.css-175oi2r.r-5oul0u.r-1wzrnnt.r-1c4vpko.r-1c7gwzm.r-13qz1uu.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21{display:none!important}';
    }
    if (settings.hideExplore) css += 'a[href="/explore"]{display:none!important}';
    if (settings.hideNotifications) css += 'a[href="/notifications"]{display:none!important}';
    if (settings.hideBookmarks) css += 'a[href="/i/bookmarks"]{display:none!important}';
    if (settings.hideMessages) css += 'a[href="/messages"]{display:none!important}';
    if (settings.hideRightColumn) {
      css += '.css-175oi2r.r-yfoy6g.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x{display:none!important}';
      css += '.css-175oi2r.r-18bvks7.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64{display:none!important}';
    }
    if (settings.useLargerCSS) {
      css += 'div[data-testid="sidebarColumn"]{padding-left:20px}';
      css += `.r-1ye8kvj{max-width:${settings.cssWidth}px!important}`;
      css += '.r-10f7w94{margin-tuning-right:0!important}';
    }
    if (settings.useCustomPadding) {
      css += `div[data-testid="sidebarColumn"]{padding-left:${settings.paddingWidth}px!important}`;
    }
    if (settings.hideMutedNotices) {
      const hide = () => {
        const replyCells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        replyCells.forEach(cell => {
          cell.querySelectorAll('.css-175oi2r.r-1awozwy.r-g6ijar.r-cliqr8.r-1867qdf.r-1phboty.r-rs99b7.r-18u37iz.r-1wtj0ep.r-1mmae3n.r-n7gxbd')
            .forEach(notice => {
              const parentCell = notice.closest('[data-testid="cellInnerDiv"]');
              if (parentCell) parentCell.remove();
            });
        });
      };
      const observer = new MutationObserver(hide);
      observer.observe(document.body, { childList: true, subtree: true });
      hide();
    }
    if (css) addGlobalStyle(css);
  }

  function init() {
    // Only initialize on Twitter/X domains
    if (!checkTwitterDomain()) {
      console.log('X Clean: Not on Twitter/X domain, skipping initialization');
      return;
    }
    
    console.log('X Clean: Initializing on Twitter/X domain');
    loadSettings().then(() => {
      handleCopyFix();
      initHideSelectors();
      initHideGrok();
      initHideCommunities();
      applyCSSFromSettings();
    });
  }

  // Domain already checked at the top, proceed with initialization

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


