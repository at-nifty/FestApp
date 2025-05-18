const content = document.getElementById('content');
let currentIndex = 0;
let items = [];

async function fetchJSON() {
  try {
    const res = await fetch(`../../data/monitor${monitorIndex}.json?cachebuster=${Date.now()}`);
    if (!res.ok) throw new Error('Failed to fetch JSON');
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadContent() {
  const data = await fetchJSON();
  if (!data) return;

  // 初回もしくは内容が変わったらitemsを更新
  if (JSON.stringify(data) !== JSON.stringify(items)) {
    items = data;
    currentIndex = 0;
  }

  if (items.length === 0) {
    content.textContent = 'No data';
    return;
  }

  showItem(items[currentIndex]);

  // 次のアイテムへ（ループ）
  currentIndex = (currentIndex + 1) % items.length;
}

function showItem(item) {
  content.innerHTML = ''; // クリア
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

async function showCamera(cameraIndex) {
  // cameraX.htmlが各カメラ映像を出している想定
  // ここではiframeでcameraX.htmlを呼び出す例
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
