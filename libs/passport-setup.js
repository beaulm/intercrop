'use strict';
var passport = require('passport');
var UserModel = require('../models/User');
var GitHubStrategy = require('passport-github');
var github = require('./github');

module.exports = function(app) {
	passport.serializeUser(function(user, done) {
		console.log('serializeUser', user);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializeUser');
		UserModel.forge({id: id}).fetch().then(
			function(user) {
				done(null, user);
			},
			function(err) {
				done(err);
			}
		);
	});

	passport.use(
		new GitHubStrategy({
			clientID: '61d2d938fcf8f5f53435',
			clientSecret: '3be57a2f1b9f46ce624e4f99b576a27bb1fefd56',
			callbackURL: 'http://localhost:3000/user/login/callback'
		},
		github.authenticate.bind(github)
	));

	app.use(passport.initialize());
	app.use(passport.session());
};