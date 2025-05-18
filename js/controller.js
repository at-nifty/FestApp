const monitorCount = 8;

function createMonitorButtons() {
  const container = document.getElementById('monitor-buttons');
  for (let i = 1; i <= monitorCount; i++) {
    const button = document.createElement('button');
    button.textContent = `Monitor ${i}`;
    button.onclick = () => handleMonitorClick(i);
    container.appendChild(button);
  }
}

function handleMonitorClick(monitorNumber) {
  const validTypes = ['text', 'image', 'video', 'camera', 'lyric'];
  const type = prompt('表示タイプを選択 (text, image, video, camera, lyric)');
  if (!type || !validTypes.includes(type)) {
    alert('無効な表示タイプです');
    return;
  }

  let content = { type };

  if (type === 'text') {
    content.text = prompt('表示するテキストを入力:');
  } else if (type === 'image') {
    content.src = prompt('画像ファイル名を入力 (例: assets/images/sample.jpg):');
  } else if (type === 'video') {
    content.src = prompt('動画ファイル名を入力 (例: assets/videos/sample.mp4):');
  } else if (type === 'camera') {
    const index = parseInt(prompt('カメラ番号 (1〜8):'), 10);
    if (isNaN(index) || index < 1 || index > 8) {
      alert('無効なカメラ番号です');
      return;
    }
    content.cameraIndex = index;
  } else if (type === 'lyric') {
    content.src = prompt('歌詞ファイルのパスを入力 (例: assets/lyrics/song1.txt):');
  }

  saveFilesForMonitor(monitorNumber, content);
}

function saveFilesForMonitor(monitorNumber, content) {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const baseName = `monitor${monitorNumber}`;
  const versionedFilename = `${baseName}(${timestamp}).json`;
  const latestFilename = `${baseName}.latest.json`;

  // JSON本体を保存
  downloadJSONFile(content, versionedFilename);

  // 最新ファイル名を記録するファイルを保存
  const latestData = { latest: versionedFilename };
  downloadJSONFile(latestData, latestFilename);
}

function downloadJSONFile(jsonData, filename) {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  createMonitorButtons();
});
