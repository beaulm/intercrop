# React / Express Template App

### Tools

* express
* react
* gulp
* sass
* browserify
* babel
* knex
* bookshelf

### To use...

1. Download / fork / clone
1. Run `npm install -g gulp knex`
1. Run `npm install` to install dependencies
1. Run `brew/apt-get install redis postgres` to get redis which is used for storing session data, and postgres
1. In postgres, create a database called `intercrop`, a user for the app, and give the user permissions to the database
  1. `createdb intercrop`
  1. `su - postgres`
  1. `psql template1`
  1. `CREATE USER appusername WITH PASSWORD 'apppassword';`
  1. `GRANT ALL PRIVILEGES ON DATABASE "intercrop" to appusername;`
  1. `\q`
  1. `exit`
1. Copy `config.example.js` to `config.js` and update the values appropriately
1. `knex migrate:latest`
1. `knex seed:run`
1. Run `gulp` to start the server
1. Point your browser at http://localhost:3000/ and enjoy
