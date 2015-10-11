let React = require('react');
let PlantCollection = require('../collections/PlantCollection');
let _ = require('backbone/node_modules/underscore');
let PlantPicker = require('./PlantPicker');

const boxLength = 30;

module.exports = React.createClass({
	getInitialState: function() {
		let rows = 20;
		let columns = 20;

		return {
			rows: rows,
			columns: columns,
			dragStart: null,
			dragCurrent: null,
			plantMatrix: this.generatePlantMatrix(rows, columns),
			affinityScore: 0,
			currentPlant: 1,
		};
	},

	componentWillMount: function() {
		this.plants = new PlantCollection();
		this.plants.fetch();
		this.plants.on('sync', () => {
			this.forceUpdate();
		});
	},

	getNeighborAffinity: function(state, plantId, x, y, xOffset, yOffset) {
		let plantModel = this.plants.get(plantId);
		let neighborX = x+xOffset;
		let neighborY = y+yOffset;
		if(!plantModel) {
			return null;
		}
		if(x < 0 || y < 0 || x >= state.columns || y >= state.rows) {
			return null;
		}
		if(neighborX < 0 || neighborY < 0 || neighborX >= state.columns || neighborY >= state.rows) {
			return null;
		}

		let neighborPlantId = state.plantMatrix[neighborY][neighborX];
		let affinities = plantModel.get('affinities');
		return affinities.hasOwnProperty(neighborPlantId) ? affinities[neighborPlantId] : 0;
	},

	getAllNeighborAffinities: function(state, plantId, x, y) {
		let neighbors = [];
		let affinity = null;

		if(affinity = this.getNeighborAffinity(state, plantId, x, y, 0, -1)) {
			neighbors.push({
				xOffset: 0,
				yOffset: -1,
				descriptor: 'top',
				affinity: affinity,
			});
		}
		if(affinity = this.getNeighborAffinity(state, plantId, x, y, 1, 0)) {
			neighbors.push({
				xOffset: 1,
				yOffset: 0,
				descriptor: 'right',
				affinity: affinity,
			});
		}
		if(affinity = this.getNeighborAffinity(state, plantId, x, y, 0, 1)) {
			neighbors.push({
				xOffset: 0,
				yOffset: 1,
				descriptor: 'bottom',
				affinity: affinity,
			});
		}
		if(affinity = this.getNeighborAffinity(state, plantId, x, y, -1, 0)) {
			neighbors.push({
				xOffset: -1,
				yOffset: 0,
				descriptor: 'left',
				affinity: affinity,
			});
		}

		return neighbors;
	},

	getAffinityStyle: function(affinity) {
		switch(affinity) {
			case 1:
				return '2px solid green';
			case -1:
				return '2px solid red';
		}
		return 'auto';
	},

	getBoxStyles: function(state, plantId, x, y) {
		let styles = {};

		if(state.dragStart !== null && state.dragCurrent !== null) {
			let minX = Math.min(state.dragStart.x, state.dragCurrent.x);
			let maxX = Math.max(state.dragStart.x, state.dragCurrent.x);
			let minY = Math.min(state.dragStart.y, state.dragCurrent.y);
			let maxY = Math.max(state.dragStart.y, state.dragCurrent.y);
			let dragBorderStyle = '2px solid #000';

			if(x === minX && y >= minY && y <= maxY) {
				styles.borderLeft = dragBorderStyle;
			}

			if(x === maxX && y >= minY && y <= maxY) {
				styles.borderRight = dragBorderStyle;
			}

			if(y === minY && x >= minX && x <= maxX) {
				styles.borderTop = dragBorderStyle;
			}

			if(y === maxY && x >= minX && x <= maxX) {
				styles.borderBottom = dragBorderStyle;
			}
		}
		return styles;
	},

	render: function() {
		let veggieOptions = this.plants.map(function(veggie) {
			return <option value={veggie.id} key={veggie.id}>{veggie.get('name')}</option>
		});

		let plotGridStyle = {
			height: (this.state.rows*boxLength)+'px',
			width: (this.state.columns*boxLength)+'px',
		};

		this.state.affinityScore = 0;

		let boxElements = this.state.plantMatrix
		.map((row, y) => {
			return row.map((plantId, x) => {
				let affinities = this.getAllNeighborAffinities(this.state, plantId, x, y);
				if(affinities.length) {
					this.state.affinityScore += affinities.reduce(function(previousValue, currentValue) {
						return previousValue + currentValue.affinity;
					}, 0);
				}
				let style = affinities.reduce((style, affinity) => {
					let borderString = 'border'+affinity.descriptor.charAt(0).toUpperCase();
					borderString += affinity.descriptor.substr(1);
					style[borderString] = this.getAffinityStyle(affinity.affinity);
					return style;
				}, {});
				style = _.extend(
					style,
					this.getBoxStyles(this.state, plantId, x, y),
					{ backgroundImage: 'url('+(plantId ? this.plants.get(plantId).get('url') : null)+')' }
				);
				return (
					<div
						draggable="false"
						key={y+'-'+x}
						style={style}
						onMouseDown={this.setDragData(x, y, 'dragStart')}
						onMouseEnter={this.setDragData(x, y, 'dragCurrent')}
						onMouseUp={this.solidifyDrag(x, y)}
					/>
				);
			});
		})
		.reduce(function(previousArray, currentRow) {
			return previousArray.concat(currentRow);
		}, []);

		return (
			<main>
				<select id="vegetable-list" ref="vegetable">
					{veggieOptions}
				</select>
				<PlantPicker plants={this.plants} onClick={this.setCurrentPlant} />
				<section className="editor">
					<div>
						Companion Score: {this.state.affinityScore}
					</div>
					<form onSubmit={this.sizeChanged}>
						Rows: <input type="number" ref="rows" defaultValue="20" />
						Columns: <input type="number" ref="columns" defaultValue="20" />
						<button>Resize</button>
					</form>
					<div id="plot-grid" style={plotGridStyle}>
						{boxElements}
					</div>
				</section>
			</main>
		);
	},

	sizeChanged: function(e) {
		e.preventDefault();

		let rows = parseFloat(this.refs.rows.value);
		let columns = parseFloat(this.refs.columns.value);

		this.setState({
			rows: rows,
			columns: columns,
			plantMatrix: this.generatePlantMatrix(rows, columns, this.state.plantMatrix),
		});
	},

	generatePlantMatrix: function(height, width, currentPlantMatrix) {
		if(!currentPlantMatrix) {
			currentPlantMatrix = [[]];
		}

		let newMatrix = [];
		for(let y = 0; y < height; y++) {
			let row = [];
			for(let x = 0; x < width; x++) {
				if(y < currentPlantMatrix.length && x < currentPlantMatrix[y].length) {
					row.push(currentPlantMatrix[y][x]);
				}
				else {
					row.push(0);
				}
			}
			newMatrix.push(row);
		}
		return newMatrix;
	},

	boxChange: function(x, y) {
		this.state.plantMatrix[y][x] = this.getVegetableId();
		this.setState({
			plantMatrix: this.state.plantMatrix
		});
	},

	getVegetableId: function() {
		return this.state.currentPlant;
		//return parseInt(this.refs.vegetable.value);
	},

	setDragData: function(x, y, property) {
		return () => {
			let stateData = {};
			stateData[property] = {
				x: x,
				y: y
			}
			this.setState(stateData);
		};
	},

	solidifyDrag: function(x, y) {
		return () => {
			if(!this.state.dragStart || !this.state.dragCurrent) {
				return;
			}
			for(let yy=Math.min(this.state.dragStart.y, y); yy<=Math.max(this.state.dragStart.y, y); yy++) {
				for(let xx=Math.min(this.state.dragStart.x, x); xx<=Math.max(this.state.dragStart.x, x); xx++) {
					this.state.plantMatrix[yy][xx] = this.getVegetableId();
				}
			}
			this.setState({
				dragStart: null,
				dragCurrent: null,
				plantMatrix: this.state.plantMatrix
			});
		};
	},

	setCurrentPlant: function(plantId) {
		this.state.currentPlant = plantId;
	},
});
