export default function ajax({ url, data, method = 'post' }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.responseText, xhr.status, xhr);
        } else {
          reject(new Error(`请求错误: ${xhr.status} ${xhr.statusText}`));
        }
      }
    };
    if (method === 'get') {
      xhr.open(method, url, true);
      xhr.send(null);
    }
    if (method === 'post') {
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(JSON.stringify(data));
    }
  });
}
