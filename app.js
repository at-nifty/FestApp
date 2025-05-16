const channel = new BroadcastChannel('stage_control');

function sendMessage(type, payload) {
  channel.postMessage({ type, payload });
}

function onMessage(callbacks) {
  channel.onmessage = (event) => {
    const { type, payload } = event.data;
    if (callbacks[type]) callbacks[type](payload);
  };
}
