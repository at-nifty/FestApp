// controller.js - 操作画面用JS

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendText').addEventListener('click', () => {
      const target = document.getElementById('target').value;
      const text = document.getElementById('text').value;
      App.sendMessage('text', { target, text });
    });
  
    document.getElementById('sendVideo').addEventListener('click', () => {
      const target = document.getElementById('target').value;
      const url = document.getElementById('videoURL').value;
      App.sendMessage('video', { target, url });
    });
  
    document.getElementById('sendImage').addEventListener('click', () => {
      const target = document.getElementById('target').value;
      const url = document.getElementById('imageURL').value;
      App.sendMessage('image', { target, url });
    });
  
    document.getElementById('clear').addEventListener('click', () => {
      const target = document.getElementById('target').value;
      App.sendMessage('clear', { target });
    });
  });
  