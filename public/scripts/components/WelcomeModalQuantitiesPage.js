let React = require('react');
let PickQuantityRow = require('./PickQuantityRow');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			error: ''
		}
	},
	componentDidMount: function() {
		this.refs.rows.querySelector('input').focus();
	},
	render: function() {
		let error = null;
		let rows = this.props.plants.map((plant) => {
			return <PickQuantityRow plant={plant} key={plant.id} />
		});
		if(this.state.error) {
			error = <div className="error">{this.state.error}</div>
		}
		return (
			<div>
				<header>
					<div className="title">Step 3 of 3: How much of each plant do you want?</div>
					<button className="close" onClick={this.props.onClose}></button>
				</header>
				<section ref="rows">
					{rows}
					{error}
				</section>
				<footer>
					<button onClick={this.finish} className="btn lg primary" key="next">Save &amp; Finish</button>
					<button onClick={this.props.onSwitchPage('pick-plants')} className="btn lg" key="cancel">Go Back</button>
				</footer>
			</div>
		);
	},
	finish: function() {
		var counted = this.props.plants.countBy(function(plant) {
			return plant.get('quantity') ? 'set' : 'unset';
		});
		if(!counted.set || counted.set < 3) {
			this.setState({ error: 'Please fill in a positive quantity for at least three plants.' });
		}
		else {
			this.props.onFinish();
		}
	}
});
