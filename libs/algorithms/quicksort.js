module.exports = function(widthInMeters, heightInMeters, plants, cb) {
	var factors = require('./factors');
	var cellsPerMeter = 10;
	var numCols = Math.floor(widthInMeters*cellsPerMeter);
	var numRows = Math.floor(heightInMeters*cellsPerMeter);

	//Create an empty matrix to populate later
	var result = [];
	for(var row=0; row<numRows; row++) {
		result.push([]);
		for(var col=0; col<numCols; col++) {
			result[row].push(0);
		}
	}


	//Calculate the affinity rating for each plant
	plants.map(function(currentPlant){

		//Start the current plant with a neutral affinity rating of zero
		var affinityRating = 0;

		//Go through all the plants
		plants.map(function(otherPlant) {

			//Get the other plants affinity rating of the plant we're currently checking
			var othersAffinity = otherPlant.get('affinities')[currentPlant.get('id')];

			//If the other plant and this plant are not the same AND the other plant has any affinity information for this plant
			if(currentPlant.get('id') !== otherPlant.get('id') && othersAffinity !== undefined) {

				//SUM(The affinity of each other plants in the garden for this plant * the total number of the other plant)
				affinityRating += othersAffinity*otherPlant.get('quantity');
			}
		});

		//Divide by the number of this plant in the garden
		affinityRating = affinityRating/currentPlant.get('quantity');

		//Set the affinity rating for this plant
		currentPlant.set('affinityRating', affinityRating);
	});




	//Order the list by AR from lowest to highest TODO: secondary sort by number of plant from highest to lowest
	plants = plants.sortBy('affinityRating');




	//Check if the block specified is entirely empty
	function plantCanFit(startingRow, startingColumn, columnsWide, rowsHigh) {
		var lastRow = startingRow+rowsHigh;
		var lastColumn = startingColumn+columnsWide;

		//If the specified box goes out of the garden bounds
		if(lastRow > numRows || lastColumn > numCols) {
			return false;
		}

		//Check if every space in the specified block is empty
		for(var rowNumber=startingRow; rowNumber<lastRow; rowNumber++) {
			for(var cellNumber=startingColumn; cellNumber<lastColumn; cellNumber++) {
				if(result[rowNumber][cellNumber] !== 0) {
					return false;
				}
			}
		}

		//If all the cells were empty, report that the plant can fit there!
		return true;
	}



	//Add a plant to the return matrix
	function placePlantInGarden(plant, startingRow, startingColumn, columnsWide, rowsHigh) {

		//Go through all the cells in the specified block
		for(var rowNumber=startingRow; rowNumber<startingRow+rowsHigh; rowNumber++) {
			for(var cellNumber=startingColumn; cellNumber<startingColumn+columnsWide; cellNumber++) {

				//Set that cell value equal to the id of the plant to place there
				result[rowNumber][cellNumber] = plant.get('id');
			}
		}
	}



	//Place a block of one type of plant in the garden
	function placePlant(plant) {

		//Go through each row in the garden
		for(var currentRow=0; currentRow<numRows; currentRow++) {

			//Initialize a variable which says that we're not currently looking for the end of a block of empty space
			var startOfEmptySpace = -1;

			//Go through each cell in the current row
			for(var currentCell=0; currentCell<numCols; currentCell++) {

				//If the current space is empty AND we're not currently looking for the end of a block of empty space
				if(result[currentRow][currentCell] === 0 && startOfEmptySpace === -1) {

					//Set the variable from earlier equal to the number of this cell in the current row, so we can calculate the consecutive empty space later
					startOfEmptySpace = currentCell;

				}

				//If the current space isn't empty OR it's the last cell in the row AND we were looking for the end of a block of empty space
				if((result[currentRow][currentCell] !== 0 || currentCell === numCols-1) && startOfEmptySpace !== -1) {

					//Figure out how much consecutive empty space there was
					var spaceLeftInThisRow = currentCell-startOfEmptySpace+1;

					//If the amount of empty space can fit all of the current plant on just that row
					if(spaceLeftInThisRow >= plant.get('quantity')) {

						//Put it there
						placePlantInGarden(plant, currentRow, startOfEmptySpace, plant.get('quantity'), 1);
						return;
					}

					//Otherwise, check if the amount of the plant to be placed can be evenly divided by the number of cells left in the current row
					if(plant.get('quantity') % spaceLeftInThisRow === 0) {

						//If enough rows beneath the current row are available to place all of the plant
						if(plantCanFit(currentRow, startOfEmptySpace, spaceLeftInThisRow, (plant.get('quantity')/spaceLeftInThisRow))) {

							//Put it there
							placePlantInGarden(plant, currentRow, startOfEmptySpace, spaceLeftInThisRow, (plant.get('quantity')/spaceLeftInThisRow));
							return;
						}
					}

					//Otherwise, find the largest factor of the amount of the current plant to be placed which is smaller than the number of cells left in the current row
					//Start from the second to last factor (the last factor being the quantity of the plant, which we already know doesn't fit in the current row), and work back to the second to last factor, which is always 1
					for(var factorNumber=factors[plant.get('quantity')].length-1; factorNumber>1; factorNumber--) {

						//If the current factor is smaller than the amount of space left in the current row
						if(factors[plant.get('quantity')][factorNumber] < spaceLeftInThisRow) {

							//If enough rows beneath the current row are available to place all of the plant
							if(plantCanFit(currentRow, startOfEmptySpace, factors[plant.get('quantity')][factorNumber], (plant.get('quantity')/factors[plant.get('quantity')][factorNumber]))) {

								//Put it there
								placePlantInGarden(plant, currentRow, startOfEmptySpace, factors[plant.get('quantity')][factorNumber], (plant.get('quantity')/factors[plant.get('quantity')][factorNumber]));
								return;
							}
						}
					}
				}

				//TODO: Otherwise, rotate the matrix to the right by 90 degrees and try again
			}
		}

		//TODO: If we just rotated the matrix to the right and still couldn't place it nicely
			//TODO: Rotate the matix to the left (returning it to its original orientation)
			
			//Go through each cell in the matrix and start placing the plant wherever is available
			for(var rowNumber=0; rowNumber<numRows; rowNumber++) {
				for(var cellNumber=0; cellNumber<numCols; cellNumber++) {

					//If the current cell is empty
					if(result[rowNumber][cellNumber] === 0) {

						//Add the current plant to it
						result[rowNumber][cellNumber] = plant.get('id');

						//Reduce the quantity of that plant to add by 1
						plant.set('quantity', plant.get('quantity')-1);

						//If that was the last of this plant
						if(plant.get('quantity') === 0) {
							//Exit
							return;
						}
					}
				}
			}
			//TODO: If we've run out of cells
				//TODO: Throw an error!
				return;
	}




	//Initialize an affinities list
	var affinities = false;

	//Initialize a variable to make sure at least one plant is added every round
	var plantFound = -1;

	//While there are still plants in the array
	while(plants.length > 0) {

		//Go through the list of plants
		for(var index=0; index<plants.length; index++){

			//If the previously placed plant likes this plant
			if(affinities !== false && affinities[plants[index].get('id')]) {
				//Record the index number of this plant to add below
				plantFound = index;

				//Stop looking for a plant to add
				break;
			}
		}

		//If none of the plants were suitable to add
		if(plantFound === -1) {
			//Set the first plant in the list as the one to be added
			plantFound = 0;
		}

		//Get the plant to add
		var plant = plants[plantFound];

		//Place the current plant in the garden
		placePlant(plant);

		//Update the list of affinities to be used for the next plant
		affinities = plant.get('affinities');

		//Remove the current plant from the list of plants
		plants.splice(plantFound, 1);

		//Reset the plantFound variable
		plantFound = -1;
	}


	cb(null, {
		width: numCols,
		height: numRows,
		matrix: result
	});
};
