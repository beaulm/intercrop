let React = require('react');
let PlantButton = require('./PlantButton');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			searchTerm: '',
			currentPlant: 1,
		};
	},

	componentWillMount: function() {
		this.props.plants.on('sync', () => {
			this.forceUpdate();
		});
	},

	render: function() {
		// let partialSearch = new RegExp(this.state.searchTerm, 'i');
		let plantButtons = this.props.plants.filter((plant) => {
			return plant.get('name').indexOf(this.state.searchTerm) > -1;
			//return partialSearch.test(plant.get('name'));
		}).map((plant) => {
			return (
				<PlantButton key={'plant-button-'+plant.id} plant={plant} active={(this.state.currentPlant === plant.id)} onClick={this.buttonClicked} />
			);
		});

		return (
			<section className="plant-picker">
				<form className="search">
					<label>
						<h6>Find Plant</h6>
						<div className="form-row">
							<input ref="searchBox" type="text" placeholder="carrots" onKeyUp={this.refinePlantList} />
							<button></button>
						</div>
					</label>
				</form>
				<div className="filter-results">
					{plantButtons}
				</div>
			</section>
		);
	},

	buttonClicked: function(plantId) {
		this.setState({
			currentPlant: plantId
		});
		this.props.onClick(plantId);
	},

	refinePlantList: function() {
		this.setState({
			searchTerm: this.refs.searchBox.value
		});
	},
});
