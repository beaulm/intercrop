module.exports = function(width, height, plants, cb) {
	var numCols = 10;
	var numRows = Math.floor(numCols*height/width);
	var result = [];

	var totalPlants = plants.reduce(function(total, plant) {
		return total + plant.get('quantity');
	}, 0);
	var currentPlant = 0;
	var numCurrentPlant = 0;
	var totalCurrentPlant = 0;

	for(var y = 0; y < numRows; y++) {
		var row = [];
		for(var x = 0; x < numCols; x++) {
			if(!plants.at(currentPlant)) {
				row.push(0);
			}
			else {
				totalCurrentPlant = Math.floor(plants.at(currentPlant).get('quantity')/totalPlants*numRows*numCols);
				if(numCurrentPlant >= totalCurrentPlant) {
					currentPlant++;
					numCurrentPlant = 0;
				}
				row.push(plants.at(currentPlant).id);
				numCurrentPlant++;
			}
		}
		result.push(row);
	}

	cb(null, {
		width: numCols,
		height: numRows,
		matrix: result
	});
};