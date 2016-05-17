var a = {
	name: 'a',
	x: 1,
	y: 1,
	affinities: {
		b: -1
	}
};

var b = {
	name: 'b', //Really we would use id numbers here
	x: 5,
	y: 5,
	affinities: {
		a: 1 //and here
	}
};

function calculateTrajectory(a, b) {
	//If this plant doesn't have an affinity record for the other plant, don't do anything
	if(!a.affinities.hasOwnProperty(b.name)) {
		return {x: a.x, y: a.y};
	}

	var xDistance = b.x - a.x;
	var yDistance = b.y - a.y;

	var totalDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

	var magnitude = a.affinities[b.name];

	//If they're too close, keep their attraction at 0, but let them repel still
	var pull = 0;
	if(magnitude < 0 || totalDistance > 1) {
		pull = magnitude/totalDistance;
	}

	var changeX = xDistance*pull;
	var changeY = yDistance*pull;

	return {
		x: changeX,
		y: changeY
	}
}

console.log(calculateTrajectory(b, a));
