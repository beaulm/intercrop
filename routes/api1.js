'use strict';
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var slug = require('node-slug');

var CourseModel = require('../models/Course');

function genCourseSlug(base, num) {
	num = num || 0;
	console.log('genCourseSlug', base, num);
	var s = base;
	if(num) {
		s += '-'+num;
	}
	return CourseModel
	.forge()
	.where('slug', s)
	.count()
	.then(function(found) {
		console.log('found some stuff', found)
		if(found > 0) {
			return genCourseSlug(base, num+1);
		}
		return new Promise(function(resolve, reject) {
			resolve(s)
		});
	})
}

router.post('/course', function(req, res, next) {
	console.log('post course');
	if(!req.body.topic) {
		return res.status(400).json({
			message: 'A course topic is required',
			status: 400
		});
	}
	if(!req.body.location) {
		return res.status(400).json({
			message: 'A course location is required',
			status: 400
		});
	}

	genCourseSlug(req.body.location+'-'+req.body.topic)
	.then(function(uniqueSlug) {
		return CourseModel
		.forge({
			topic: req.body.topic,
			location: req.body.location,
			slug: uniqueSlug
		})
		.save();
	})
	.then(function(course) {
		res.json(course.toJSON());
	})
	.catch(function(err) {
		res.status(500).json({
			message: err.toString(),
			status: 500
		});
	});
});

router.get('/course/:courseId/user', function(req, res) {
	console.log(req.params.courseId);
	CourseModel
	.forge({id: req.params.courseId})
	.fetch({withRelated: 'users'})
	.then(function(course) {
		console.log(course);
	})
	.catch(function(err) {
		console.log(err);
	});
});

router.get('/', function(req, res, next) {
  res.json({'home': true});
});

router.get('/test', function(req, res, next) {
  res.json({'test': true});
});

module.exports = router;
