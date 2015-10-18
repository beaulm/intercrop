var fs = require('fs');
var path = require('path');

module.exports = function(config) {

	var files = fs.readdirSync(config.path);
	var algorithms = files.map(function(file) {
		return {
			model: require(path.join(config.path, file)),
			name: file.split('.')[0].toLowerCase()
		};
	})
	.reduce(function(before, info) {
		before[info.name] = info.model;
		return before;
	}, {});

	return {
		build: function(algorithm, width, height, plants, cb) {
			if(!algorithms.hasOwnProperty(algorithm)) {
				return cb({
					message: 'The algorithm you specified could not be found',
					status: 400
				});
			}
			algorithms[algorithm](width, height, plants, cb);
		}
	};

};