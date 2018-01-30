import { ajax, loadScript, processStackMsg, isOBJByType } from './utils';

const DEFALT_CONFIG = {
  cdn: 'https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js',
  method: 'post',
  // url: '/error',
  showDevtools: false,
};

class CatchError {
  init(config) {
    if (this.loaded) {
      return false;
    }

    this.loaded = true;
    this.config = { ...DEFALT_CONFIG, ...config };

    if (this.config.showDevtools || /devtools=show/.test(window.location.search)) {
      return loadScript(this.config.cdn).then(() => {
        const vConsole = new window.VConsole();
        window.addEventListener('unhandledrejection', (ev) => {
          // catch Promise error
          if (ev.reason.message.indexOf('请求错误(UploadLogsError)') >= 0) {
            // Upload Logs Error
            return;
          }
          throw ev.reason;
        });
        // catch error for uploading the error
        if (this.config.url) {
          if (window.onerror) {
            // cache window.onerror function
            this.windowError = window.onerror;
          }

          window.onerror = this.onerror;
        }
        return Promise.resolve(vConsole);
      });
    }

    return Promise.resolve();
  }

  onerror = (msg, url, line, col, error) => {
    if (this.windowError) this.windowError(msg, url, line, col, error);
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
