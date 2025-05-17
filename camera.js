// camera.js - カメラ映像取得・ローカル全画面表示対応（ダブルタップで全画面）

document.addEventListener('DOMContentLoaded', async () => {
    // camera1.html → id: 1
    const id = window.location.pathname.match(/camera(\d+)/)?.[1] || "0";
  
    // video要素を作成
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true; // ローカルのみなので音声不要
    video.width = 640;
    video.height = 360;
    video.style.width = "100vw";
    video.style.height = "100vh";
    video.style.objectFit = "cover";
    video.style.backgroundColor = "black";
    video.style.display = "block";
    video.style.margin = "0 auto";
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "black";
    document.body.appendChild(video);
  
    // カメラ映像取得
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: false
      });
      video.srcObject = stream;
    } catch (err) {
      console.error('カメラ取得エラー:', err);
      document.body.innerHTML = '<p style="color:red;">カメラにアクセスできません。</p>';
      return;
    }
  });
  