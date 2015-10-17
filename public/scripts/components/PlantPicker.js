let React = require('react');
let PlantButton = require('./PlantButton');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			searchTerm: ''
		};
	},

	componentWillMount: function() {
		this.props.plants.on('sync', () => {
			this.forceUpdate();
		});
	},

	render: function() {
		let plantButtons = this.props.plants.filter((plant) => {
			return plant.get('name').indexOf(this.state.searchTerm) > -1;
		}).map((plant) => {
			return (
				<PlantButton key={'plant-button-'+plant.id} plant={plant} active={(this.props.currentPlant === plant.id)} onClick={this.buttonClicked} />
			);
		});

		return (
			<section className="plant-picker" style={this.props.style}>
				<form className="search">
					<label>
						<h6>Find Plant</h6>
						<div className="form-row">
							<input ref="searchBox" type="text" placeholder="carrots" onKeyUp={this.refinePlantList} />
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
		if(this.props.onChange) {
			this.props.onChange(this.props.plants.get(plantId));
		}
	},

	refinePlantList: function() {
		this.setState({
			searchTerm: this.refs.searchBox.value
		});
	},
});
