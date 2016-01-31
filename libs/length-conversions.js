var boxesPerMeter = 10;

module.exports = {
	metersToGrid: function(widthInMeters, heightInMeters) {
		return {
			wide: (widthInMeters*boxesPerMeter),
			high: (heightInMeters*boxesPerMeter),
		};
	},
};
