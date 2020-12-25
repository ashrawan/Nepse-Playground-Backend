
const router = require('express').Router();
const Company = require('../../models').Company;
const { ScrapeCompanyData, ScrapStockData, LoadGraphData } = require('../../services/MainScrapper');
const format = require('date-fns/format');

router.get('/all-company', async (req, res) => {

	ScrapeCompanyData().then(status => {
		res.json(status);
    }, err => {
        res.send(err);
	});
});

router.get('/all-stocks', async (req, res) => {

	const date = new Date();
	console.log('Started Minutes ', date.getMinutes() + 'seconds ' + date.getSeconds());
	const companies = await Company.findAll();
	const options = {
		startDate: req.query?.startDate ? req.query.startDate : '2010-01-01',
		endDate: req.query?.endDate ? req.query.endDate : format(new Date(), 'YYYY-MM-DD'),
		'stock-symbol': 0,
		_limit: 8000,
	  };
	for(let company of companies) {
		await ScrapStockData(company, options);
	}
	console.log('Completed Scrapping all Stocks');
	res.json(true);
});

router.get('/graphdata/:code/:period', async (req, res) => {

	const code = req.params.code;
	const period = req.params.period;
	const url = "/graphdata/"+code+"/"+period+"";
	LoadGraphData(url).then(data => {
		const responseData = {
			data: data,
			name: 'Overall NEPSE'
		};
		res.json(responseData);
		res.json(data);
    }, err => {
        res.send(err);
	});
});

router.get('/company/graphdata/:companyCode/:period', async (req, res) => {

	const companyCode = req.params.companyCode;
	const period = req.params.period;
	const url = "/company/graphdata/"+companyCode+"/"+period+"";
	const company = await Company.findOne({ where: { companyCode: companyCode } });
	LoadGraphData(url).then(data => {
		const responseData = {
			data: data,
			name: company !== null ? company.name : 'Unknown'
		};
		res.json(responseData);
    }, err => {
        res.send(err);
	});
});
  

module.exports = router;
