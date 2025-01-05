(async () => {
  try {
    const timestamps = await chrome.storage.local.get('songTimestamps');
    const songTimestamps = timestamps.songTimestamps || [];

    console.log('Injected script loaded with timestamps:', songTimestamps);

    const injectPageScript = () => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('pageScript.js');
      script.type = 'module';
      document.documentElement.appendChild(script);

      script.onload = () => {
        window.dispatchEvent(new CustomEvent('setSongTimestamps', { 
          detail: songTimestamps 
        }));
        console.log('Dispatched setSongTimestamps event');
      };
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectPageScript);
    } else {
      injectPageScript();
    }
  } catch (error) {
    console.error('Error in injected script:', error);
  }
})();