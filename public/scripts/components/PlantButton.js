let React = require('react');

module.exports = React.createClass({
	render: function() {
		var image = <img src={this.props.plant.get('url')} />;
		if(!this.props.plant.get('url')) {
			image = <div className="no-image">{this.props.plant.get('name').substr(0, 2)}</div>;
		}
		return (
			<button key={'plant-button-'+this.props.plant.id} className={this.props.active ? 'active' : ''} onClick={this.buttonClicked(this.props.plant.id)}>
				{image}
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
