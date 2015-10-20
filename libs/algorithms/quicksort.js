module.exports = function(width, height, plants, cb) {
	var numCols = 10;
	var numRows = Math.floor(numCols*height/width);
	var result = [];

	//Calculate the affinity ratingfor each plant
	plants.map(function(currentPlant){
		var affinityRating = 0;
		//Go through all the plants
		plants.map(function(otherPlant) {
			var othersAffinity = otherPlant.get('affinities')[currentPlant.get('id')];
			//If it's not this plant and the other plant has any affinity information for this plant
			if(currentPlant.get('id') !== otherPlant.get('id') && othersAffinity !== undefined) {
				//SUM(The affinity of each other plants in the garden for this plant * the total number of the other plant)
				affinityRating += othersAffinity*otherPlant.get('quantity');
			}
		});
		//Divide by the number of this plant in the garden
		affinityRating = affinityRating/currentPlant.get('quantity');
		currentPlant.set('affinityRating', affinityRating);
	});

	//Order the list by AR from lowest to highest, secondary sort by number of plant from highest to lowest

	//Place the first plant in the garden
		//The number of this plant (#) / (# % one row length)

	//Go through the list and find the first thing that the last plants likes
		//If there's a lot of that plant and not much space left in the row
			//Look for another plant that it likes that there's not so much of
	//Place the next plant

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
