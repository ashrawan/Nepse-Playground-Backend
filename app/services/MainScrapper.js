const rp = require('request-promise');
const cheerio = require('cheerio');
const Company = require('../models').company;
const Sector = require('../models').sector;
const StockPrice = require('../models').stockprice;

const companySymbolScraper = require('./scrapper/companyScraper');
const stockwisePriceScraper = require('./scrapper/stockwisePriceScraper');
const todayPriceScraper = require('./scrapper/todayPriceScraper');
const format = require('date-fns/format');

const NEPSE_URL = "http://www.nepalstock.com";
const TODAY_PRICE = "http://www.nepalstock.com/todaysprice";
const COMPANY_URL = "http://www.nepalstock.com/company";
const STOCKWISE_PRICES_URL = "http://www.nepalstock.com/main/stockwiseprices/index/1";
const data = {
  "startDate": "",
  "stock-symbol": "",
  "_limit": 1000
};

const parseText = item => cheerio(item).text().trim();
const parseNumber = item => parseFloat(parseText(item));
const parseHref = item => cheerio(item).find('a').attr('href').split('/').reverse()[0];
const addFinalTime = date => `${date} 15:00:00`;  // Market closes at 15:00:00
const convertToTimestamp = date => new Date(addFinalTime(date)).getTime();

const ScrapeCompanyData = async () => {
  const companyList = await companySymbolScraper(COMPANY_URL);
  const companies = [];
  for (let rows of companyList) {
    const sectorName = parseText(rows[4]);
    const dbSector = await Sector.findOne({ where: { name: sectorName } });
    let sectorId = 0;
    if (dbSector == null) {
      const newSector = await Sector.create({ name: sectorName });
      sectorId = newSector.id;
    } else {
      sectorId = dbSector.id;
    }
    companies.push({
      name: parseText(rows[2]),
      symbol: parseText(rows[3]),
      sectorId: sectorId,
      companyCode: parseHref(rows[5]),
    });
  };
  await Company.bulkCreate(companies, { ignoreDuplicates: true });
  return "Completed Scrapping All Companies";
};

const ScrapStockData = async (company, options) => {
  const stockWisePrices = await stockwisePriceScraper(STOCKWISE_PRICES_URL, company.companyCode, options);

  const stockPrices = [];
  for (let rows of stockWisePrices) {
    const scrapedCompStock = {
      date: parseText(rows[1]),
      timestamp: convertToTimestamp(parseText(rows[1])),
      totalTransactions: parseNumber(rows[2]),
      totalTradeShares: parseNumber(rows[3]),
      totalTradeAmount: parseNumber(rows[4]),
      maxPrice: parseNumber(rows[5]),
      minPrice: parseNumber(rows[6]),
      closePrice: parseNumber(rows[7]),
      companyId: company.id
    };
    stockPrices.push(scrapedCompStock);
  }
  await StockPrice.bulkCreate(stockPrices, {ignoreDuplicates: true});
  return "Completed Scrapping All Stocks";
};

const LoadGraphData = async (url) => {
  return rp(NEPSE_URL+url,  {qs: {}})
  .then(cheerio.load)
  .then($ => $('body').text())
  .then(responseString => JSON.parse(responseString));
};

const ScrapTodayData = async (company) => {
  const data = {
    "startDate": "",
    "stock-symbol": "",
    "_limit": 1000
  };
  const todayPrice = await todayPriceScraper({
    'uri': TODAY_PRICE,
    'payload': data
  });
  const todayStockPrices = [];
  for (let rows of items) {
    todayStockPrices.push({
      date: new Date(),
      timestamp: convertToTimestamp(parseText(new Date())),
      totalTransactions: parseNumber(rows[2]),
      totalTradeShares: parseNumber(rows[6]),
      totalTradeAmount: parseNumber(rows[7]),
      maxPrice: parseNumber(rows[3]),
      minPrice: parseNumber(rows[4]),
      closePrice: parseNumber(rows[5]),
      companyId: company.id
    });
  }
  await StockPrice.bulkCreate(todayStockPrices);
  return "Completed Scrapping Todays Stocks";
};


module.exports = {
  ScrapeCompanyData,
  ScrapStockData,
  LoadGraphData,
  ScrapTodayData
};
