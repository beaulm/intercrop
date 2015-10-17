let React = require('react');
let PlantPicker = require('./PlantPicker');
let PickedPlant = require('./PickedPlant');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			error: ''
		};
	},
	componentWillMount: function() {
		this.props.pickedPlants.on('add', () => {
			this.forceUpdate();
		}, this);
		this.props.pickedPlants.on('remove', () => {
			this.forceUpdate();
		}, this);
		this.props.plants.on('add', () => {
			this.forceUpdate();
		}, this);
		this.props.plants.on('remove', () => {
			this.forceUpdate();
		}, this);
	},
	componentWillUnmount: function() {
		this.props.plants.off(null, null, this);
		this.props.pickedPlants.off(null, null, this);
	},
	render: function() {
		let error = null;
		let plantPickerStyle = {
			position: 'static',
			height: '24em',
			float: 'left'
		};

		let pickedPlantEls = this.props.pickedPlants.map((plant) => {
			return <PickedPlant plant={plant} key={plant.id} onRemove={this.removePlant} />
		});

		if(this.state.error) {
			error = <div className="error">{this.state.error}</div>
		}

		return (
			<div className="pick-page">
				<header>
					<div className="title">Step 2 of 3: What plants would you like in your garden?</div>
					<button className="close" onClick={this.props.onClose}></button>
				</header>
				<section className="no-padding">
					<PlantPicker plants={this.props.plants} onChange={this.pickPlant} style={plantPickerStyle} />
					<div className="picked-plants">
						{pickedPlantEls}
					</div>
				</section>
				<footer>
					{error}
					<button onClick={this.finishPick} className="btn lg primary">Next: Choose Amount</button>
					<button onClick={this.props.onSwitchPage('garden-size')} className="btn lg">Go Back</button>
				</footer>
			</div>
		);
	},
	pickPlant: function(plant) {
		this.props.pickedPlants.add(this.props.plants.remove(plant));
	},
	removePlant: function(plant) {
		this.props.plants.add(this.props.pickedPlants.remove(plant));
	},
	finishPick: function() {
		if(this.props.pickedPlants.length < 3) {
			this.setState({ error: 'Please pick at least three plants before continuing.' });
		}
		else {
			this.props.onSwitchPage('plant-quantities')();
		}
	}
});
