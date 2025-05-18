export function fetchJSON(url) {
  return fetch(url + `?t=${Date.now()}`)
    .then((res) => res.json())
    .catch((err) => {
      console.error('JSON読み込み失敗:', url, err);
      return null;
    });
}

export function saveJSONToFile(jsonObject, filename) {
  const blob = new Blob([JSON.stringify(jsonObject, null, 2)], {
    type: 'application/json',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
