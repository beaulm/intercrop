let React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="pick-quantity-row">
				{this.props.plant.generateImage()}
				<div className="plant-name">{this.props.plant.get('name')}</div>
				<input type="number" ref="quantity" onChange={this.change} defaultValue={this.props.plant.get('quantity') || ''} />
				<div className="unit">plants</div>
			</div>
		);
	},
	change: function() {
		this.props.plant.set({
			'quantity': parseInt(this.refs.quantity.value)
		});
	}
});
