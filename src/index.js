import ajax from './ajax';

const defaultConfig = {
  method: 'post',
  url: '/error',
};

function processStackMsg(error) {
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
}

function isOBJByType(o, type) {
  return Object.prototype.toString.call(o) === `[object ${type || 'Object'}]`;
}

class CatchError {
  init(config) {
    this.config = Object.assign(defaultConfig, config);
    window.onerror = this.onerror;
  }
  onerror = (msg, url, line, col, error) => {
    let newMsg = msg;

    if (error && error.stack) {
      newMsg = processStackMsg(error);
    }

    if (isOBJByType(newMsg, 'Event')) {
      newMsg += newMsg.type ?
        (`--${newMsg.type}--${newMsg.target ?
          (`${newMsg.target.tagName}::${newMsg.target.src}`) : ''}`) : '';
    }

    newMsg = (`${newMsg}` || '').substr(0, 500);
    const logs = {
      msg: newMsg,
      timestamp: Date.now(),
      userAgent: window.navigator.userAgent,
      targetUrl: url,
      line,
      col,
    };

    // upload error
    ajax({
      method: this.config.method,
      url: this.config.url,
      data: logs,
    });
  }
}

export default CatchError;
