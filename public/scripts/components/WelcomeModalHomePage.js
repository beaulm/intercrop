let React = require('react');
var consts = require('../consts');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<header>
					<div className="title">Welcome to {consts.appName}, a garden layour generator</div>
					<button className="close" onClick={this.props.onClose}></button>
				</header>
				<section>
					<p>Intercropping is a technique that you can use in your garden to produce a greater yield on a given piece of land or plant bed. Careful planning is required, taking into account the soil, climate, crops, and varieties. Our garden layout generator can help you plan your garden in a way that will help you to get the most out of your land.</p>
				</section>
				<footer>
					<button onClick={this.props.onSwitchPage('garden-size')} className="btn lg primary" key="generate">Generate a layout for me</button>
					<button onClick={this.props.onClose} className="btn lg" key="build">Let me build my own layout</button>
				</footer>
			</div>
		);
	}
});
