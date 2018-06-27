# harmon-cheerio

`harmon-cheerio` makes it simple to perform transforms using `harmon` by using `cheerio`. It also makes it possible to transform elements asynchronously using Promises.

This package is currently under development. Please use at your own discretion.

## Example

```js
const harmonCheerio = require('harmon-cheerio');

// ...

app.use(harmon([], [
  {
    query: 'body',
    func: harmonCheerio((element, req) => {
      if (doesUserAgentRequirePolyfill(req)) {
        element.append('<script src="/path/to/polyfill.js"></script>');
      }
    })
  }
]));
```

```js
const harmonCheerio = require('harmon-cheerio');

// ...

app.use(harmon([], [
  {
    query: 'script#session-placeholder',
    func: harmonCheerio(async (element, req) => {
      // pretend we need to make a request to get the user's session data
      const sessionData = await getSessionData(req.session.id);
      element.text(`const SESSION = ${JSON.stringify(sessionData)};`);
    })
  }
]));
```

See [cheerio](https://github.com/cheeriojs/cheerio#api) for the full list of methods you have access to.

## License

MIT ❤️