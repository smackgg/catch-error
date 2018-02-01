import { ajax, loadScript, processStackMsg, isOBJByType } from './utils';

const DEFALT_CONFIG = {
  cdn: 'https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js',
  method: 'post',
  // url: '/error',
  showDevtools: false,
  urlSwitch: {
    devtools: 'show',
  },
};

class CatchError {
  constructor() {
    // cache store
    this.store = [];
    this.methodList = ['log', 'warn', 'info', 'debug', 'error'];
    this.method = {};
    this.vConsole = null;
  }
  init = (config) => {
    this.config = { ...DEFALT_CONFIG, ...config };

    this.cacheLog();
    const { showDevtools, urlSwitch } = this.config;
    const show = Object.keys(urlSwitch).reduce((pre, item) => {
      const regExp = new RegExp(`${item}=${urlSwitch[item]}`);
      return regExp.test(window.location.search) || pre;
    }, false);

    if (showDevtools || show) {
      return this.show();
    }
    return Promise.resolve();
  }

  show = () => {
    if (this.vConsole) {
      return Promise.resolve(this.vConsole);
    }

    return loadScript(this.config.cdn).then(() => this.initVConsole());
  }

  cacheLog = () => {
    // 将 vconsole 加载之前的所有 log、error... 缓存
    this.methodList.forEach((item) => {
      this.method[item] = console[item];
      console[item] = (...args) => {
        this.store.push({
          logType: item,
          logs: args,
        });
        this.method[item].apply(console, args);
      };
    });

    window.onerror = (...args) => {
      this.store.push({
        logType: 'error',
        logs: args,
      });
      this.onerror(...args);
    };

    window.addEventListener('unhandledrejection', this.logRejectMessage);
  }

  initVConsole = () => {
    // vconsole 加载完毕后初始化

    this.vConsole = new window.VConsole();

    // 使用 vconsole 打印缓存中的 log
    this.store.forEach((item) => {
      this.vConsole.pluginList.default.printLog({
        logType: item.logType,
        logs: item.logs,
      });
    });

    // catch error for uploading the error
    if (this.config.url) {
      if (window.onerror) {
        // cache window.onerror function
        this.windowOnError = window.onerror;
      }

      window.onerror = this.onerror;
    }

    return Promise.resolve(this.vConsole);
  }

  logRejectMessage = (ev) => {
    if (ev.reason.message.indexOf('请求错误(UploadLogsError)') >= 0) {
      // Upload Logs Error
      console.error(ev.reason.message);
      return;
    }
    const {
      message: msg,
      sourceUrl: url,
      line,
      column: col,
    } = ev.reason;
    this.onerror(msg, url, line, col, ev.reason);
  }

  onerror = (msg, url, line, col, error) => {
    if (!this.config.url) {
      return;
    }
    if (this.windowOnError) this.windowOnError(msg, url, line, col, error);
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
