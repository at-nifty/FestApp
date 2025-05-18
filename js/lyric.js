// js/lyric.js
export class LyricManager {
  constructor(container) {
    this.container = container;
    this.lines = [];
    this.currentLine = -1;
  }

  async loadFromFile(src) {
    const res = await fetch(src);
    const text = await res.text();
    this.lines = text.trim().split('\n');
    this.currentLine = -1;
  }

  renderLine(line) {
    this.container.innerHTML = ''; // 初期化

    if (line.trim() === 'Clear') return;

    const div = document.createElement('div');
    if (line.startsWith('SU ')) {
      div.className = 'lyric-su';
      div.textContent = line.substring(3);
    } else if (line.startsWith('SD ')) {
      div.className = 'lyric-sd';
      div.textContent = line.substring(3);
    } else if (line.startsWith('F ')) {
      div.className = 'lyric-f';
      div.textContent = line.substring(2);
    } else {
      div.className = 'lyric-f';
      div.textContent = line;
    }
    this.container.appendChild(div);
  }

  next() {
    if (this.currentLine + 1 < this.lines.length) {
      this.currentLine++;
      this.renderLine(this.lines[this.currentLine]);
    }
  }

  prev() {
    if (this.currentLine > 0) {
      this.currentLine--;
      this.renderLine(this.lines[this.currentLine]);
    }
  }
}
