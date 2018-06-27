const cheerio = require('cheerio');

function readStreamAsString(stream) {
  return new Promise((resolve, reject) => {
    const blocks = [];
    stream.on('data', (segment) => {
      blocks.push(segment);
    });
    stream.on('end', () => {
      const buff = Buffer.concat(blocks);
      resolve(buff.toString('utf8'));
    });
    stream.on('error', () => {
      reject(new Error('failed to read stream as string'));
    });
  });
}

function harmonCheerio(handler) {
  return function(node, req, res) {
    const rs = node.createReadStream({outer: true});
    const ws = node.createWriteStream({outer: true});

    readStreamAsString(rs)
      .then((html) => {
        const nodeName = html.substring(1, Math.min(
          html.indexOf('\n'), html.indexOf(' '), html.indexOf('>')));
        const $ = cheerio.load(html);
        const element = $(nodeName).eq(0);
        return Promise.all([
          $,
          element,
          handler(element, req, res),
        ]);
      })
      .then(([$, element]) => {
        const replacement = $.html(element);
        ws.end(replacement);
      });
  };
}

module.exports = harmonCheerio;
