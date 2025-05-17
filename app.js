// app.js - 共通モジュール

const App = {
  constants: {
    CHANNEL_NAME: 'display_channel',
    VIDEO_WIDTH: 640,
    VIDEO_HEIGHT: 360,
  },
  channel: null,
  utils: {},
  events: {},
  state: {},

  init() {
    this.channel = new BroadcastChannel(this.constants.CHANNEL_NAME);
    this.channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (App.events[type]) {
        App.events[type](payload);
      } else {
        App.utils.log('未対応のメッセージタイプ: ' + type);
      }
    };
  },

  sendMessage(type, payload) {
    if (!this.channel) return;
    this.channel.postMessage({ type, payload });
  }
};

// Utils
App.utils = {
  log: (msg) => console.log('[App]', msg),

  escapeHTML: (str) =>
    str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag])),

  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  enableFullscreenOnDoubleClick: (element) => {
    element.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
          console.error('全画面化に失敗:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }
};
