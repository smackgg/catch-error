## use

```bash
npm install catch-global-error --save
```

```js
import CatchError from 'catch-global-error';

const catchError = new CatchError();
catchError.init({
  url: '/api/error/log', // upload error
});
const a = 1;
console.log(a.b.c);
```

## show devtools
```js
// method 1: init
catchError.init({
  url: '/api/error/log',
  showDevtools: true, // default show Devtools
});
```

```
// method 2: add ```devtools=show``` to url query:
www.***.com?devtools=show
```

## dev
npm run dev

## publish
npm run publish
