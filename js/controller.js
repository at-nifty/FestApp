import { fetchJSON, saveJSONToFile } from './app.js';

const monitorCount = 8;

function createMonitorButtons() {
  const container = document.getElementById('monitor-buttons');
  for (let i = 1; i <= monitorCount; i++) {
    const button = document.createElement('button');
    button.textContent = `Monitor ${i}`;
    button.onclick = () => {
      const type = prompt('表示タイプを選択 (text, image, video, camera, lyric)');
      let content = { type };

      if (type === 'text') {
        content.text = prompt('表示するテキストを入力:');
      } else if (type === 'image') {
        content.src = prompt('画像ファイル名を入力 (例: assets/images/sample.jpg):');
      } else if (type === 'video') {
        content.src = prompt('動画ファイル名を入力 (例: assets/videos/sample.mp4):');
      } else if (type === 'camera') {
        content.cameraIndex = parseInt(prompt('カメラ番号 (1〜8):'));
      } else if (type === 'lyric') {
        content.src = prompt('歌詞ファイルのパスを入力 (例: assets/lyrics/song1.txt):');
    }

      saveJSONToFile(content, `monitor${i}.json`);
    };
    container.appendChild(button);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createMonitorButtons();
});
