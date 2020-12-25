
const router = require('express').Router();
const Company = require('../../models').Company;
const Sector = require('../../models').Sector;
const StockPrice = require('../../models').StockPrice;
var Sequelize = require('sequelize');
const sequelize = require('../../models').sequelize;

function filterCompany(req) {

	let whereClause = {};
	for (const [key, value] of Object.entries(req.query)) {
		if (key === 'limit' || key === 'offset') {
			continue;
		}
		whereClause = { ...whereClause, [key]: value }
	}
	const isWhereClauseEmpty = Object.keys(whereClause).length === 0;
	const filter = {
		include: [{
			model: Sector,
			as: 'sector'
		}],
		order: [
			['name', 'ASC']
		],
		limit: req?.limit?.length > 0 ? req.limit : 500,
		offset: req?.offset?.length > 0 ? req.offset : 0,
		...(!isWhereClauseEmpty && { where: whereClause })
	}
	return filter;
}

function filterStockprice(req, patchWhereClause = {}, ignoreParams = {}) {

	let whereClause = patchWhereClause;
	for (const [key, value] of Object.entries(req.query)) {
		if (key === 'limit' || key === 'offset') {
			continue;
		}
		if (patchWhereClause.hasOwnProperty(key) || ignoreParams.hasOwnProperty(key)) {
			continue;
		}
		whereClause = { ...whereClause, [key]: value }
	}
	const isWhereClauseEmpty = Object.keys(whereClause).length === 0;
	const filter = {
		include: [{
			model: Company,
			as: 'company'
		}],
		order: [
			['date', 'DESC']
		],
		limit: req?.limit?.length > 0 ? req.limit : 50,
		offset: req?.offset?.length > 0 ? req.offset : 0,
		...(!isWhereClauseEmpty && { where: whereClause }),

	}
	return filter;
}

router.get('/companys/filter', async (req, res) => {

	Company.findAll(filterCompany(req)).then(companies => {
		res.json(companies);
	}, err => {
		res.send(err);
	});
});

router.get('/stocks/filter', async (req, res) => {


	StockPrice.findAll(filterStockprice(req)).then(stocks => {
		res.json(stocks);
	}, err => {
		res.send(err);
	});
});

router.get('/stocks/average', async (req, res) => {

	const companyId = req.query.companyId;
	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	sequelize.query(
		`SELECT sp.companyId AS companyId,
				sp.date AS date, 
				AVG(sp.closePrice) AS avgCostPrice,
				MONTH(DATE) AS month,
				YEAR(DATE) AS year
		FROM stockprices sp
			INNER JOIN companies c ON sp.companyId = c.id
		WHERE sp.companyId = :companyId AND sp.date BETWEEN :startDate AND :endDate
		GROUP BY MONTH(DATE), YEAR(DATE)
		ORDER BY year, month ASC`,
		{
			replacements: { companyId: companyId, startDate: startDate, endDate: endDate },
			type: Sequelize.QueryTypes.SELECT
		}
	).then(stocks => {
		res.json(stocks);
	}, err => {
		res.send(err);
	});
});

// router.get('/stocks/trading', async (req, res) => {

// 	const ignoreParams = {startDate: '', endDate: '', companyId: ''};
// 	const patchWhereClause = {
// 		date: {
// 			$between: [req.query.startDate, req.query.endDate]
// 		}
// 	};
// 	const overrideInclude = [{
// 		model: Company,
// 		as: 'company',
// 		through: { where: {id: req.query.companyId}},
// 		attributes: ['id']
// 	}];
// 	const filter = {include: overrideInclude,  ...filterStockprice(req, patchWhereClause, ignoreParams)};
// 	StockPrice.findAll(filter).then(stocks => {
// 		res.json(stocks);
// 	}, err => {
// 		res.send(err);
// 	});
// });

router.get('/stocks/trading', async (req, res) => {

	const companyId = req.query.companyId;
	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	sequelize.query(
		`SELECT * FROM StockPrices sp
		LEFT OUTER JOIN Companies c 
			ON sp.companyId = c.id
		WHERE sp.companyId = :companyId AND sp.date BETWEEN :startDate AND :endDate
		ORDER BY sp.date DESC`,
		{
			replacements: { companyId: companyId, startDate: startDate, endDate: endDate },
			type: Sequelize.QueryTypes.SELECT
		}
	).then(stocks => {
		res.json(stocks);
	}, err => {
		res.send(err);
	});
});


router.get('/company/:companyId', (req, res) => {

	Company.findByPk(req.params.companyId).then(company => {
		if (company != null) {
			res.json(company);
		}
		else {
			res.sendStatus(404);
		}
	}, err => {
		res.send(err)
	});
});

module.exports = router;
