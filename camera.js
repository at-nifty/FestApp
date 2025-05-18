const video = document.createElement('video');
video.autoplay = true;
video.playsInline = true;
video.style.width = '100%';
video.style.height = '100%';
document.body.style.margin = '0';
document.body.appendChild(video);

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error('カメラ起動エラー:', err);
  });
