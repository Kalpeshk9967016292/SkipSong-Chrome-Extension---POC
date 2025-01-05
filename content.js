const REFRESH_INTERVAL = 3600000; 
const googleSheetURL = 'https://docs.google.com/spreadsheets/d/1wWKZElRlOp7wphuTUvKc6ywAjYfmx0-1VOIWPtrk82k/export?format=csv';
let songTimestamps = [];

function parseCSV(data) {
  return data.split('\n')
    .filter(row => row.trim())
    .map(row => {
      const [movieId, start, end] = row.split(',').map(item => item.trim());
      if (!movieId || isNaN(start) || isNaN(end)) {
        console.warn('Invalid row:', row);
        return null;
      }
      return {
        movieId: parseInt(movieId),
        start: parseInt(start), 
        end: parseInt(end)     
      };
    })
    .filter(entry => entry !== null);
}

async function fetchTimestamps() {
  try {
    console.log('Fetching timestamps from:', googleSheetURL);
    const response = await fetch(googleSheetURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    console.log('Raw CSV data:', data);
    
    songTimestamps = parseCSV(data);
    await chrome.storage.local.set({ 
      songTimestamps,
      lastUpdate: Date.now()
    });
    console.log('Successfully stored timestamps:', songTimestamps);
    return songTimestamps;
  } catch (error) {
    console.error('Failed to fetch timestamps:', error);
    const cached = await chrome.storage.local.get(['songTimestamps']);
    if (cached.songTimestamps) {
      console.log('Using cached timestamps:', cached.songTimestamps);
      songTimestamps = cached.songTimestamps;
      return songTimestamps;
    }
    return [];
  }
}


async function checkAndUpdateTimestamps() {
  const { lastUpdate } = await chrome.storage.local.get('lastUpdate');
  if (!lastUpdate || Date.now() - lastUpdate > REFRESH_INTERVAL) {
    await fetchTimestamps();
  }
}

function requestScriptInjection() {
  chrome.runtime.sendMessage({ action: "injectScript" })
    .catch(error => console.error('Script injection request failed:', error));
}

async function initialize() {
  await checkAndUpdateTimestamps();
  requestScriptInjection();

  setInterval(checkAndUpdateTimestamps, REFRESH_INTERVAL);
}

initialize();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "refreshTimestamps") {
    fetchTimestamps().then(() => sendResponse({ success: true }));
    return true; 
  }
});