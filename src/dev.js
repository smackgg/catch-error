import CatchError from './index';

const catchError = new CatchError();
catchError.init({
  url: '/api/error/log',
});
const a = 1;
console.log(a.b.c);
