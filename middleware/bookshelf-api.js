'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
module.exports = function(config) {
	if(!config.path) {
		throw 'Bookshelf API configuration object requires a path property specifying where your models directory is located.';
	}

	var files = fs.readdirSync(config.path);
	var m = files
	.map(function(file) {
		return {
			model: require(path.join(config.path, file)),
			name: file.split('.')[0]
		};
	})
	.reduce(function(before, info) {
		before[info.name] = info.model;
		return before;
	}, {});

	var models = {};

	for(var i in m) {
		models[i.toLowerCase()] = m[i];
	}

	return function(req, res, next) {
		var url = _.trim(req.url, '/');
		var urlPieces = url.split('/');
		var method = req.method.toLowerCase();

		if(!urlPieces.length) {
			return next();
		}

		urlPieces[0] = urlPieces[0].toLowerCase();

		if(!models.hasOwnProperty(urlPieces[0])) {
			return next();
		}

		var Model = models[urlPieces[0]];
		var model = new Model();
		if(urlPieces.length > 1) {
			var params = {};
			params[model.idAttribute] = urlPieces[1];
			model = Model.forge(params);
		}
		var promise = null;

		if(method === 'get') {

			// Get individual record
			if(urlPieces.length > 1) {
				promise = model.fetch();
			}
			// Get all records
			else {
				promise = model.fetchAll();
			}

			promise.then(function(results) {
				if(!results) {
					res.status(404).json({
						message: 'Record not found',
						status: 404
					});
				}
				else {
					res.json(results.toJSON());
				}
			});
		}
		else if(method === 'post') {
			model.set(req.body);
			model.save().then(
				function(savedModel) {
					res.json(savedModel.toJSON());
				},
				function(err) {
					res.status(400).json({
						message: err.toString(),
						status: 400
					});
				}
			);
		}
		else if(method === 'put') {
			if(urlPieces.length < 2) {
				res.status(404).json({
					message: 'Record not found',
					status: 404
				});
			}
			else {
				var updatedData = req.body;
				model.save(updatedData).then(
					function(savedModel) {
						res.json(savedModel.toJSON());
					},
					function(err) {
						res.status(500).json({
							message: err.toString(),
							status: 500
						});
					}
				);
			}
		}
		else if(method === 'delete') {
			if(urlPieces.length < 2) {
				res.status(404).json({
					message: 'Record not found',
					status: 404
				});
			}
			else {
				if(model.hasTimestamps.length >= 3 && !req.body.hard) {
					var updatedData = {};
					updatedData[model.hasTimestamps[2]] = new Date();
					model.save(updatedData).then(
						function(savedModel) {
							res.json(savedModel.toJSON());
						},
						function(err) {
							res.status(500).json({
								message: err.toString(),
								status: 500
							});
						}
					);
				}
				else {
					model.destroy().then(
						function(destroyedModel) {
							res.json(destroyedModel.toJSON());
						},
						function(err) {
							res.status(500).json({
								message: err.toString(),
								status: 500
							});
						}
					);
				}
			}
		}
	};
};