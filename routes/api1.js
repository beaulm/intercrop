'use strict';
var _ = require('lodash');
var validator = require('validator');
var express = require('express');
var router = express.Router();
var Plant = require('../models/Plant');
var NounProject = require('the-noun-project');
var config = require('../config');
var nounProject = new NounProject(config.nounProject);
var path = require('path');
var algorithmFactory = require('../libs/algorithm-factory')({path: path.join(__dirname, '../libs/algorithms')});

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

router.post('/generate-layout', function(req, res) {
	req.body.algorithm = req.body.algorithm || 'test';
	req.body.algorithm = req.body.algorithm.toLowerCase();
	if(!validator.isAlphanumeric(req.body.algorithm)) {
		return res.status(400).json({
			message: 'Invalid algorithm name',
			status: 400,
		});
	}
	if(!req.body.width) {
		return res.status(400).json({
			message: 'A width is required',
			status: 400,
		});
	}
	req.body.width = parseFloat(req.body.width);
	if(isNaN(req.body.width)) {
		return res.status(400).json({
			message: 'The width must be a number',
			status: 400,
		});
	}
	if(!req.body.height) {
		return res.status(400).json({
			message: 'A height is required',
			status: 400,
		});
	}
	req.body.height = parseFloat(req.body.height);
	if(isNaN(req.body.height)) {
		return res.status(400).json({
			message: 'The height must be a number',
			status: 400,
		});
	}
	if(!_.isArray(req.body.quantities)) {
		return res.status(400).json({
			message: 'The quantities parameter must be an array',
			status: 400,
		});
	}

	var totalQuantities = 0;
	var plantIds = [];
	var quantitiesById = {};
	for(var i=0; i<req.body.quantities.length; i++) {
		var quantity = req.body.quantities[i];
		if(quantity.quantity) {
			totalQuantities++;
		}
		if(!quantity.plantId) {
			return res.status(400).json({
				message: 'All listed quantities must have an plantId property',
				status: 400,
			});
		}
		if(!quantity.quantity) {
			return res.status(400).json({
				message: 'All listed quantities must have an quantity property',
				status: 400,
			});
		}
		plantIds.push(quantity.plantId);
		quantitiesById[quantity.plantId] = quantity.quantity;
	}

	if(plantIds.length < 3) {
		return res.status(400).json({
			message: 'At least three plants with quantities must be supplied',
			status: 400,
		});
	}

	Plant
	.query(function(qb) {
		qb.where('id', '=', plantIds[0]);
		for(var i=1; i<plantIds.length; i++) {
			qb.orWhere('id', '=', plantIds[i]);
		}
	})
	.fetchAll()
	.then(function(plants) {
		plants.forEach(function(plant) {
			plant.set('quantity', quantitiesById[plant.id]);
		});
		algorithmFactory.build(
			req.body.algorithm,
			req.body.width,
			req.body.height,
			plants,
			function(err, data) {
				if(err) {
					res.status(400).json({
						message: 'At least three plants with quantities must be supplied',
						status: 400,
					});
				}
				else {
					res.json(data);
				}
			}
		);
	});

});

module.exports = router;
