let React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			searchTerm: '',
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
			return plant.attributes.name.indexOf(this.state.searchTerm) > -1;
			//return partialSearch.test(plant.attributes.name);
		}).map((plant) => {
			return (
				<button key={'plant-button-'+plant.attributes.id} onClick={this.buttonClicked(plant.attributes.id)}>
					<img src={plant.attributes.url} />
					<span>{plant.attributes.name}</span>
				</button>
			);
		});

		return (
				<section className="plant-picker">
					<form className="search">
						<label>
							<h6>Find Plant</h6>
							<div className="form-row">
								<input ref="searchBox" type="text" placeholder="carrots" onKeyUp={this.refinePlantList} />
								<button className="search"></button>
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
		return () => {
			this.props.onClick(plantId);
		};
	},

	refinePlantList: function() {
		this.setState({
			searchTerm: this.refs.searchBox.value
		});
	},
});
