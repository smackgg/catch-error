export const ajax = ({ url, data, method = 'post' }) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        resolve(xhr.responseText, xhr.status, xhr);
      } else {
        reject(new Error(`请求错误(UploadLogsError): ${xhr.status} ${xhr.statusText}`));
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

export const loadScript = src => new Promise((resolve) => {
  const el = document.createElement('script');
  el.type = 'text/javascript';
  el.src = src;
  el.setAttribute('crossorigin', 'anonymous');
  el.crossorigin = 'anonymous';

  const finished = () => {
    if (!el.readyState || el.readyState === 'complete') {
      resolve();
    }
  };

  el.onload = finished;
  el.onreadystatechange = finished;

  const t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(el, t);
});

export const processStackMsg = (error) => {
  let stack = error.stack
    .replace(/\n/gi, '')
    .split(/\bat\b/)
    .slice(0, 9)
    .join('@')
    .replace(/\?[^:]+/gi, '');
  const msg = error.toString();
  if (stack.indexOf(msg) < 0) {
    stack = `${msg}@${stack}`;
  }
  return stack;
};

export const isOBJByType = (o, type) => Object.prototype.toString.call(o) === `[object ${type || 'Object'}]`;
