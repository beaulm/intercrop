let React = require('react');
let PickQuantityRow = require('./PickQuantityRow');
let LengthConversions = require('../../../libs/length-conversions');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			error: '',
			quantityLeft: LengthConversions.sizeToBoxes(this.props.size),
		}
	},
	componentWillMount: function() {
		this.props.plants.on('change:quantity', () => {
			let spaceUsed = this.props.plants.reduce(function(sum, plant) {
				return sum+(plant.get('quantity') || 0);
			}, 0);
			let spaceLeft = LengthConversions.sizeToBoxes(this.props.size)-spaceUsed;
			this.setState({quantityLeft: spaceLeft});
		});
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
		let remainingSpaceColor = '#000';
		if(this.state.quantityLeft <= 0) {
			remainingSpaceColor = '#ff0000';
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
				<section>
					Space left: <span style={{color: remainingSpaceColor}}>{this.state.quantityLeft}</span>
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
