// // import CatchError from '../lib/catch-error.min';
import CatchError from './';
//
const catchError = new CatchError();
catchError.init({
  url: '/api/error/log',
  showDevtools: false,
});

window.onclick = () => {
  catchError.show();
};

const a = 1;
console.log(a.b.c);
