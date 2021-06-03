const cheerio = require('cheerio');
const rp = require('request-promise');

const findHtml = selector => html => cheerio(html).find(selector);
const parseRows = allItems => {
  const filteredHeaderFooters = allItems.slice(2, allItems.length - 1);
  return filteredHeaderFooters.map((i, item) => findHtml('td')(item)).get();
};

companySymbolScraper = async url =>
  rp(url, {qs: { _limit: 1000}})
    .then(cheerio.load)
    .then($ => $('#company-list tr'))
    .then(parseRows)
    .then(items => items);

module.exports = companySymbolScraper;
