let React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="picked-plant">
				{this.props.plant.generateImage()}
				<div className="plant-name">{this.props.plant.get('name')}</div>
				<div className="close" onClick={this.remove}></div>
			</div>
		);
	},
	remove: function() {
		this.props.onRemove(this.props.plant);
	}
});
