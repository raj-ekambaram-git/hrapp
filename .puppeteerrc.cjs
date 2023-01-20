const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  // cacheDirectory: join(__dirname, '.cache', 'puppeteer')  
};

// const browser = await puppeteer.launch({
//   ignoreDefaultArgs: ['--disable-extensions','--no-sandbox', '--disable-setuid-sandbox','--aggressive-cache-discard'],
// });

// const browser = await puppeteer.launch({
//   args: ["--no-sandbox", "--disabled-setupid-sandbox"],
// });