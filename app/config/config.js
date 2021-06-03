module.exports = {
	development: {
		username: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || 'root',
		database: process.env.DB_NAME || 'nepse-db',
		host: process.env.DB_HOSTNAME || 'localhost',
		dialect: 'mysql',
		logging: false,
		port: process.env.DB_LOCAL_PORT,
		// datasource: process.env.DB_DATASOURCE || 'mysql://localhost:3306/nepse-db',
	},
	test: {
		dialect: 'sqlite',
		logging: false,
		storage: ':memory:'
	},

};
