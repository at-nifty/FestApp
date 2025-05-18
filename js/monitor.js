// js/monitor.js
import { LyricManager } from './lyric.js';

const content = document.getElementById('content');
let currentIndex = 0;
let items = [];
let lyricManager = null;  // 歌詞用インスタンス

const monitorIndex = getMonitorIndex();

// monitorX.html → X を返す
function getMonitorIndex() {
  const match = location.pathname.match(/monitor(\d+)\.html/);
  return match ? parseInt(match[1], 10) : 1;
}

// 最新のデータファイルのパスを取得 → 内容の配列を取得
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

// 全体の切り替え処理（5秒おきに呼ばれる）
async function loadContent() {
  const data = await fetchLatestJSON();
  if (!data) return;

  // 内容に変更があったときのみ反映
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

// 各種表示タイプに応じて画面を構築
function showItem(item) {
  content.innerHTML = '';
  lyricManager = null;  // 歌詞の状態をリセット

  switch (item.type) {
	case 'text': {
	  const div = document.createElement('div');
	  div.className = 'text-display';
	  div.textContent = item.text;
	  content.appendChild(div);
	  break;
	}
	case 'image': {
	  const img = document.createElement('img');
	  img.src = item.src;
	  img.className = 'full-image';
	  content.appendChild(img);
	  break;
	}
	case 'video': {
	  const video = document.createElement('video');
	  video.src = item.src;
	  video.autoplay = true;
	  video.loop = true;
	  video.muted = true;
	  video.className = 'full-video';
	  content.appendChild(video);
	  break;
	}
	case 'camera': {
	  showCamera(item.cameraIndex);
	  break;
	}
	case 'lyric': {
	  lyricManager = new LyricManager(content);
	  lyricManager.loadFromFile(item.src).then(() => {
		lyricManager.next();  // 初期行表示
	  });
	  break;
	}
	default:
	  content.textContent = 'Unknown type';
  }
}

// カメラ表示処理（iframeで読み込み）
function showCamera(cameraIndex) {
  const iframe = document.createElement('iframe');
  iframe.src = `../../html/camera/camera${cameraIndex}.html`;
  iframe.className = 'full-camera';
  content.appendChild(iframe);
}

// コントローラーからの歌詞送り指示
window.addEventListener('message', (e) => {
  if (!lyricManager) return;
  if (e.data === 'lyric-next') {
	lyricManager.next();
  } else if (e.data === 'lyric-prev') {
	lyricManager.prev();
  }
});

// 初期化＆自動更新スタート
setInterval(loadContent, 5000);
loadContent();
