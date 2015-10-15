let React = require('react');
let PlantPicker = require('./PlantPicker');

module.exports = React.createClass({
	render: function() {
		console.log('render pick', this.props.plants);
		var plantPickerStyle = {
			position: 'static',
			height: '24em'
		};
		return (
			<div>
				<header>
					<div className="title">What plants would you like in your garden?</div>
					<button className="close" onClick={this.props.onClose}></button>
				</header>
				<section>
					<PlantPicker plants={this.props.plants} dispatcher={this.props.dispatcher} style={plantPickerStyle} />
				</section>
				<footer>
					<button onClick={this.props.onSwitchPage('plant-quantities')} className="btn lg primary" key="next">Next</button>
					<button onClick={this.props.onClose} className="btn lg" key="cancel">Cancel</button>
				</footer>
			</div>
		);
	}
});
