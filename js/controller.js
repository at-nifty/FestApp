const monitorCount = 8;

function createMonitorButtons() {
  const container = document.getElementById('monitor-buttons');
  for (let i = 1; i <= monitorCount; i++) {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '10px';

    // モニター操作ボタン
    const button = document.createElement('button');
    button.textContent = `Monitor ${i}`;
    button.onclick = () => handleMonitorClick(i);

    // 歌詞送りボタン
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '▶ 次へ';
    nextBtn.style.marginLeft = '10px';
    nextBtn.onclick = () => sendLyricCommand(i, 'lyric-next');

    // 歌詞戻しボタン
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀ 戻る';
    prevBtn.style.marginLeft = '5px';
    prevBtn.onclick = () => sendLyricCommand(i, 'lyric-prev');

    wrapper.appendChild(button);
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    container.appendChild(wrapper);
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

// monitorに歌詞送り/戻しの指示を送信
function sendLyricCommand(monitorNumber, command) {
  const iframe = document.getElementById(`monitor-frame-${monitorNumber}`);
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(command, '*');
  } else {
    alert(`Monitor ${monitorNumber} のプレビュー iframe が見つかりません`);
  }
}

// ここからモニター1の操作パネル用イベント登録

function setupMonitor1ControlEvents() {
  // 適用ボタン
  document.getElementById('applyBtn0').addEventListener('click', () => {
    const text = document.getElementById('textContent0').value.trim();
    const videoFileInput = document.getElementById('videoFile0');
    const cameraNumber = document.getElementById('cameraNumber0').value;
    const lyricsFileInput = document.getElementById('lyricsFile0');

    let content = {};

    // 優先順位など自由に調整可能ですが、ここは例として

    if (text) {
      content = { type: 'text', text };
      saveFilesForMonitor(1, content);
      return;
    }

    if (videoFileInput.files.length > 0) {
      // ファイル名だけ取得（アップロードはできないため注意）
      const fileName = videoFileInput.files[0].name;
      content = { type: 'video', src: `assets/videos/${fileName}` };
      saveFilesForMonitor(1, content);
      return;
    }

    if (cameraNumber) {
      const camIndex = parseInt(cameraNumber, 10);
      if (camIndex >= 1 && camIndex <= 8) {
        content = { type: 'camera', cameraIndex: camIndex };
        saveFilesForMonitor(1, content);
        return;
      } else {
        alert('無効なカメラ番号です');
        return;
      }
    }

    if (lyricsFileInput.files.length > 0) {
      const fileName = lyricsFileInput.files[0].name;
      content = { type: 'lyric', src: `assets/lyrics/${fileName}` };
      saveFilesForMonitor(1, content);
      return;
    }

    alert('表示内容を入力または選択してください');
  });

  // 歌詞送り
  document.getElementById('nextLyric0').addEventListener('click', () => {
    sendLyricCommand(1, 'lyric-next');
  });

  // 歌詞戻し
  document.getElementById('prevLyric0').addEventListener('click', () => {
    sendLyricCommand(1, 'lyric-prev');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createMonitorButtons();
  setupMonitor1ControlEvents();
});
