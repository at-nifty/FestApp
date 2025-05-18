// 歌詞表示
  fetch(item.src)
    .then(res => res.text())
    .then(text => {
      content.innerHTML = ''; // 初期化
      const lines = text.trim().split('\n');
      lines.forEach(line => {
        if (line.startsWith('SU ')) {
          const div = document.createElement('div');
          div.className = 'lyric-su';
          div.textContent = line.substring(3);
          content.appendChild(div);
        } else if (line.startsWith('SD ')) {
          const div = document.createElement('div');
          div.className = 'lyric-sd';
          div.textContent = line.substring(3);
          content.appendChild(div);
        } else if (line.startsWith('F ')) {
          const div = document.createElement('div');
          div.className = 'lyric-f';
          div.textContent = line.substring(2);
          content.appendChild(div);
        } else if (line.trim() === 'Clear') {
          // 全消去：appendなし
        } else {
          // 位置指定なしは中央に表示
          const div = document.createElement('div');
          div.className = 'lyric-f';
          div.textContent = line;
          content.appendChild(div);
        }
      });
    });
