// monitor.js - Monitor画面での表示制御

document.addEventListener('DOMContentLoaded', () => {
    App.init();
  
    // 自分のIDを URL（monitor3.html） から抽出
    const id = window.location.pathname.match(/monitor(\d+)/)?.[1] || "0";
    const myTarget = `monitor${id}`;
  
    // ===== BroadcastChannel メッセージ処理 =====
    App.events.text = ({ target, text }) => {
      if (target !== myTarget) return;
      document.body.innerHTML = `<div style="font-size:3em;text-align:center;color:white;">${App.utils.escapeHTML(text)}</div>`;
    };
  
    App.events.image = ({ target, url }) => {
      if (target !== myTarget) return;
      document.body.innerHTML = `<img src="${url}" style="max-width:100vw; max-height:100vh; object-fit:contain; display:block; margin:auto;">`;
    };
  
    App.events.video = ({ target, url }) => {
      if (target !== myTarget) return;
      document.body.innerHTML = `
        <video controls autoplay style="width:100vw; height:100vh; object-fit:contain; background:black;">
          <source src="${url}" type="video/mp4">
        </video>
      `;
    };
  
    App.events.lyric_line = ({ target, line }) => {
      if (target !== myTarget) return;
  
      // 現在の状態保持（Clear以外で上書きされるのは該当部分だけ）
      const prevSU = document.querySelector(".lyric-su")?.outerHTML || "";
      const prevSD = document.querySelector(".lyric-sd")?.outerHTML || "";
      const prevF  = document.querySelector(".lyric-f")?.outerHTML || "";
  
      let su = prevSU, sd = prevSD, f = prevF;
  
      if (line.startsWith("SU ")) {
        su = `<div class='lyric-su'>${App.utils.escapeHTML(line.substring(3))}</div>`;
      } else if (line.startsWith("SD ")) {
        sd = `<div class='lyric-sd'>${App.utils.escapeHTML(line.substring(3))}</div>`;
      } else if (line.startsWith("F ")) {
        f  = `<div class='lyric-f'>${App.utils.escapeHTML(line.substring(2))}</div>`;
      } else if (line === "Clear") {
        su = sd = f = "";
      }
  
      document.body.innerHTML = `
        <style>
          body { margin: 0; background: black; color: white; overflow: hidden; }
          .lyric-su { position: absolute; top: 10px; left: 10px; font-size: 2em; }
          .lyric-sd { position: absolute; bottom: 10px; right: 10px; font-size: 2em; }
          .lyric-f  { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3em; text-align: center; }
        </style>
        ${su}${sd}${f}
      `;
    };
  
    App.events.clear = ({ target }) => {
      if (target !== myTarget) return;
      document.body.innerHTML = "";
    };
  
    App.events.iframe = ({ target, src }) => {
      if (target !== myTarget) return;
      document.body.innerHTML = `
        <iframe src="${src}" style="border:none;width:100vw;height:100vh;"></iframe>
      `;
    };
  });
  