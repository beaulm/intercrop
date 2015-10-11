'use strict';
var _ = require('lodash');
var validator = require('validator');
var express = require('express');
var router = express.Router();
var Plant = require('../models/Plant');
var NounProject = require('the-noun-project');
var config = require('../config');
var nounProject = new NounProject(config.nounProject);
var request = require('request');

router.post('/suggest', function(req, res, next) {
	// req.body.
	// res.send(req.body);
	// console.log(req.body);
});

router.get('/test', function(req, res, next) {
	request.post(
		{
			url:'http://localhost:3000/api/v1/suggest',
			json: {
				plants: [
					{id: 1, quantity: 10},
					{id: 2, quantity: 20},
					{id: 3, quantity: 4},
					{id: 4, quantity: 13}
				],
				rows: 20,
				columns: 20
			}
		},
		function(err, httpResponse, body){
			res.send(body);
		}
	);
});

router.post('/plant', function(req, res, next) {
	if(!req.body.name) {
		return res.status(400).json({
			message: 'Please specify a name',
			status: 400,
		});
	}

	req.body.affinities = req.body.affinities || {};
	if(!_.isObject(req.body.affinities)) {
		return res.status(400).json({
			message: 'Affinites must be an object',
			status: 400,
		});
	}
	for(var i in req.body.affinities) {
		if(!validator.isInt(i, {min: 1})) {
			return res.status(400).json({
				message: 'All of the affinity keys must be positive integers. '+i+' is not :(',
				status: 400,
			});
		}
		if(!_.isFinite(req.body.affinities[i])) {
			return res.status(400).json({
				message: 'All of the affinity values must be finite numbers. '+req.body.affinities[i]+' is not :(',
				status: 400,
			});
		}
	}

	nounProject.getIconsByTerm(req.body.name, {limit: 1}, function (err, data) {
		var url = null;
		if(!err && data.icons.length > 0) {
			url = data.icons[0].preview_url_42
		}
		else {
			console.log(err, data);
		}

		var plant = new Plant({
			name: req.body.name,
			affinities: req.body.affinities,
			url: url,
		});
		plant.save()
			.then(function(plant) {
				res.status(201).json(plant.toJSON());
			})
			.catch(function(error) {
				return res.status(422).json({
					message: 'Arf, unfortunately your plant couldn\'t be saved to the database. Here\'s all we know: '+error,
					status: 422,
				});
			});
	});
});

// router.get('/plant', function(req, res, next) {
// 	res.json([
// 		{
// 			id: 1,
// 			name: 'Onion',
// 			affinities: {
// 				2: -1,
// 				3: -1,
// 				4: -1,
// 				5: -1,
// 				6: -1,
// 			}
// 		},
// 		{
// 			id: 2,
// 			name: 'Carrot',
// 			affinities: {
// 				3: 1,
// 			}
// 		},
// 		{
// 			id: 3,
// 			name: 'Tomato',
// 			affinities: {
// 				2: 1,
// 				6: 1,
// 			}
// 		},
// 		{
// 			id: 4,
// 			name: 'Lettuce',
// 			affinities: {}
// 		},
// 		{
// 			id: 5,
// 			name: 'Bean',
// 			affinities: {
// 				2: 1,
// 			}
// 		},
// 		{
// 			id: 6,
// 			name: 'Basil',
// 			affinities: {
// 				1: -1,
// 			}
// 		},
// 		{
// 			id: 7,
// 			name: 'Spinach',
// 			affinities: {}
// 		},
// 	]);
// });

module.exports = router;
