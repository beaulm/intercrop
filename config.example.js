module.exports = {
	knex: {
		development: {
			client: 'pg',
			connection: {
				host: '127.0.0.1',
				user: 'NAME',
				password: 'PASSWORD',
				database: 'intercrop',
				charset: 'utf8'
			},
			migrations: {
				tableName: 'migrations'
			},
			directory: './seeds/dev'
		}
	},

	nounProject: {
		key: 'YOUR-KEY',
		secret: 'YOUR-SECRET'
	},

	session: {
		secret: 'SOME-RANDOM-JIBBERISH'
	}
};
