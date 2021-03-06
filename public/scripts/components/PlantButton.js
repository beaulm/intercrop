let React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<button key={'plant-button-'+this.props.plant.id} className={this.props.active ? 'active' : ''} onClick={this.buttonClicked(this.props.plant.id)}>
				{this.props.plant.generateImage()}
				<span>{this.props.plant.get('name')}</span>
			</button>
		);
	},

	buttonClicked: function(plantId) {
		return () => {
			this.props.onClick(plantId);
		};
	},
});
