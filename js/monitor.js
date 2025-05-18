const content = document.getElementById('content');
let currentIndex = 0;
let items = [];
const monitorIndex = getMonitorIndex(); // monitor3.html → 3 を返す想定

function getMonitorIndex() {
  const match = location.pathname.match(/monitor(\d+)\.html/);
  return match ? parseInt(match[1], 10) : 1;
}

async function fetchLatestJSON() {
  try {
    const listRes = await fetch(`../../data/monitor${monitorIndex}_list.json?cb=${Date.now()}`);
    if (!listRes.ok) throw new Error('Failed to fetch list');
    const list = await listRes.json();

    const dataRes = await fetch(`../../data/${list.latest}?cb=${Date.now()}`);
    if (!dataRes.ok) throw new Error('Failed to fetch content');
    return await dataRes.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadContent() {
  const data = await fetchLatestJSON();
  if (!data) return;

  if (JSON.stringify(data) !== JSON.stringify(items)) {
    items = data;
    currentIndex = 0;
  }

  if (items.length === 0) {
    content.textContent = 'No data';
    return;
  }

  showItem(items[currentIndex]);
  currentIndex = (currentIndex + 1) % items.length;
}

function showItem(item) {
  content.innerHTML = '';
  switch(item.type) {
    case 'text':
      content.textContent = item.text;
      break;
    case 'image':
      const img = document.createElement('img');
      img.src = item.src;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      content.appendChild(img);
      break;
    case 'video':
      const video = document.createElement('video');
      video.src = item.src;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
      content.appendChild(video);
      break;
    case 'camera':
      showCamera(item.cameraIndex);
      break;
    case 'lyric':
      fetch(item.src)
        .then(res => res.text())
        .then(text => {
          const pre = document.createElement('pre');
          pre.style.whiteSpace = 'pre-wrap';
          pre.textContent = text;
          content.appendChild(pre);
        });
      break;
    default:
      content.textContent = 'Unknown type';
  }
}

function showCamera(cameraIndex) {
  content.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = `../../html/camera/camera${cameraIndex}.html`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  content.appendChild(iframe);
}

setInterval(loadContent, 5000);
loadContent();
