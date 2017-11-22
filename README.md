## use

```bash
npm install catch-global-error --save
```

```js
import CatchError from 'catch-global-error';

const catchError = new CatchError();
catchError.init({
  url: '/api/error/log',
});
const a = 1;
console.log(a.b.c);
```

## dev
npm run dev

## publish
npm run publish
