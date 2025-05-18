const monitorCount = 8;

function createMonitorButtons() {
  const container = document.getElementById('monitor-buttons');
  for (let i = 1; i <= monitorCount; i++) {
    const button = document.createElement('button');
    button.textContent = `Monitor ${i}`;
    button.onclick = () => {
      const type = prompt('表示タイプを選択 (text, image, video, camera, lyric)');
      if (!type) return;

      let content = { type };

      if (type === 'text') {
        content.text = prompt('表示するテキストを入力:');
      } else if (type === 'image') {
        content.src = prompt('画像ファイル名を入力 (例: assets/images/sample.jpg):');
      } else if (type === 'video') {
        content.src = prompt('動画ファイル名を入力 (例: assets/videos/sample.mp4):');
      } else if (type === 'camera') {
        content.cameraIndex = parseInt(prompt('カメラ番号 (1〜8):'), 10);
      } else if (type === 'lyric') {
        content.src = prompt('歌詞ファイルのパスを入力 (例: assets/lyrics/song1.txt):');
      }

      saveJSONToFileWithVersion(content, `monitor${i}`);
    };
    container.appendChild(button);
  }
}

function saveJSONToFileWithVersion(jsonData, baseFilename) {
  // 日付と時間を使って一意なファイル名を作成
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const filename = `${baseFilename}(${timestamp}).json`;

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
