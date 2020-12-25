const cheerio = require('cheerio');
const rp = require('request-promise');

const findHtml = selector => html => cheerio(html).find(selector);
const parseRows = allItems => {
  const filteredHeaderFooters = allItems.slice(2, allItems.length - 1);
  return filteredHeaderFooters.map((i, item) => findHtml('td')(item)).get();
};

stockwisePriceScraper = (url, id, options) =>
  rp(url, {qs: Object.assign(options, {'stock-symbol': id})})
    .then(cheerio.load)
    .then($ => $('#home-contents table tr'))
    .then(parseRows)
    .then(items => items);

module.exports = stockwisePriceScraper;