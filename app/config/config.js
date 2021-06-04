module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE_NAME,
		host: process.env.DB_HOSTNAME || 'localhost',
		dialect: 'mysql',
		logging: false,
		freezeTableName: true,
		port: process.env.DB_DOCKER_PORT,
	}

};
