var boxesPerMeter = 10;

module.exports = {
	metersToGrid: function(widthInMeters, heightInMeters) {
		return {
			wide: (widthInMeters*boxesPerMeter),
			high: (heightInMeters*boxesPerMeter),
		};
	},
	sizeToBoxes: function(size) {
		let grid = this.metersToGrid(size.width.meters, size.height.meters);
		return grid.wide*grid.high;
	},
};
