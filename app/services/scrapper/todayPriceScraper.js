const fs = require('fs');

const cheerio = require('cheerio');
const rp = require('request-promise');

const findHtml = selector => html => cheerio(html).find(selector);
const parseRows = allItems => {
  const filteredHeaderFooters = allItems.slice(2, allItems.length - 4)
  return filteredHeaderFooters.map((i, item) => findHtml('td')(item)).get();
};

const getOptions = ({uri, payload}) => ({
  method: 'POST',
  uri: uri,
  form: payload,
  headers: {
  }
})

todayPriceScraper = async props => rp(getOptions(props))
  .then(cheerio.load)
  .then(($ => $('#home-contents tr'))
  .then(parseRows)
  .then(items => items));

module.exports = todayPriceScraper;
