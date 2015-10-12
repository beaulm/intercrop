let React = require('react');
let PlantCollection = require('../collections/PlantCollection');
let _ = require('backbone/node_modules/underscore');
let PlantPicker = require('./PlantPicker');
let ResizeButton = require('./ResizeButton');
let Backbone = require('backbone');

const boxLength = 30;

module.exports = React.createClass({
	getInitialState: function() {
		let width = 20;
		let height = 20;

		return {
			width: width,
			height: height,
			units: 'imperial',
			dragStart: null,
			dragCurrent: null,
			plantMatrix: this.generatePlantMatrix(width, height),
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
		this.dispatcher = _.extend({}, Backbone.Events);
		this.dispatcher.on('currentPlantChanged', this.setCurrentPlant);
	},

	getNeighborAffinity: function(state, plantId, x, y, xOffset, yOffset) {
		let plantModel = this.plants.get(plantId);
		let neighborX = x+xOffset;
		let neighborY = y+yOffset;
		if(!plantModel) {
			return null;
		}
		if(x < 0 || y < 0 || x >= state.width || y >= state.height) {
			return null;
		}
		if(neighborX < 0 || neighborY < 0 || neighborX >= state.width || neighborY >= state.height) {
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
		let plotGridStyle = {
			height: (this.state.height*boxLength)+'px',
			width: (this.state.width*boxLength)+'px',
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
					this.getBoxStyles(this.state, plantId, x, y)
				);
				let innerElement = null;
				if(plantId) {
					if(this.plants.get(plantId).get('url')) {
						innerElement = <img src={this.plants.get(plantId).get('url')} />
					}
					else {
						innerElement = <div className="no-image">{this.plants.get(plantId).get('name').substr(0, 2)}</div>;
					}
				}
				return (
					<div
						draggable="false"
						key={y+'-'+x}
						style={style}
						onMouseDown={this.setDragData(x, y, 'dragStart')}
						onMouseEnter={this.setDragData(x, y, 'dragCurrent')}
						onMouseUp={this.solidifyDrag(x, y)}
						onClick={this.updatePlant(x, y)}
					>
						{innerElement}
					</div>
				);
			});
		})
		.reduce(function(previousArray, currentRow) {
			return previousArray.concat(currentRow);
		}, []);

		return (
			<main onMouseUp={this.solidifyDrag()}>
				<PlantPicker plants={this.plants} dispatcher={this.dispatcher} />
				<section className="editor">
					<div className="toolbar">
						<div className="left">
							<button className={'remove' + (this.state.currentPlant ? '' : ' active')}onClick={this.setRemove}><i /> Remove Plants</button>
						</div>
						<span>Companion Score: {this.state.affinityScore}</span>
						<div className="right">
							<ResizeButton width={this.state.width} height={this.state.height} units={this.state.units} onChange={this.sizeChanged} />
						</div>
					</div>
					<div id="plot-grid" style={plotGridStyle}>
						{boxElements}
					</div>
				</section>
			</main>
		);
	},

	sizeChanged: function(width, height, units) {
		this.setState({
			width: width,
			height: height,
			units: units,
			plantMatrix: this.generatePlantMatrix(width, height, this.state.plantMatrix),
		});
	},

	generatePlantMatrix: function(width, height, currentPlantMatrix) {
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
		this.state.plantMatrix[y][x] = this.state.currentPlant;
		this.setState({
			plantMatrix: this.state.plantMatrix
		});
	},

	setDragData: function(x, y, property) {
		return (e) => {
			if(property !== 'dragStart' && !this.state.dragStart) return;
			e.preventDefault();
			let stateData = {};
			stateData[property] = {
				x: x,
				y: y
			}
			this.setState(stateData);
		};
	},

	solidifyDrag: function(x, y) {
		return (e) => {
			if(!this.state.dragStart || !this.state.dragCurrent) {
				return;
			}
			e.preventDefault();
			if(_.isUndefined(x) || _.isUndefined(y)) {
				x = this.state.dragCurrent.x;
				y = this.state.dragCurrent.y;
			}
			for(let yy=Math.min(this.state.dragStart.y, y); yy<=Math.max(this.state.dragStart.y, y); yy++) {
				for(let xx=Math.min(this.state.dragStart.x, x); xx<=Math.max(this.state.dragStart.x, x); xx++) {
					this.state.plantMatrix[yy][xx] = this.state.currentPlant;
				}
			}
			this.setState({
				dragStart: null,
				dragCurrent: null,
				plantMatrix: this.state.plantMatrix
			});
		};
	},

	updatePlant: function(x, y) {
		return () => {
			this.state.plantMatrix[y][x] = this.state.currentPlant;
			this.setState({
				dragStart: null,
				dragCurrent: null,
				plantMatrix: this.state.plantMatrix
			});
		}
	},

	setCurrentPlant: function(plantId) {
		this.setState({
			currentPlant: plantId
		});
	},

	setRemove: function(e) {
		this.dispatcher.trigger('currentPlantChanged', 0);
	}
});
