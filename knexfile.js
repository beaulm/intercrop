'use strict';

module.exports = {

	development: {
		client: 'pg',
		connection: {
			host: '127.0.0.1',
			user: 'postgres',
			password: 'postgres',
			database: 'ironprofile',
			charset: 'utf8'
		},
		migrations: {
			tableName: 'migrations'
		}
	}

};
