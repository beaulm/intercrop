let React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			error: ''
		};
	},
	componentDidMount: function() {
		this.setFocus();
	},
	render: function() {
		let widthInput = null;
		let heightInput = null;
		let error = null;

		if(this.state.error) {
			error = (
				<div className="form-row">
					<div className="error">{this.state.error}</div>
				</div>
			);
		}

		if(this.props.size.units === 'imperial') {
			widthInput = (
				<div>
					<label>
						<div className="form-label">Feet:</div>
						<input type="number" step="0.01" ref="widthFeet" onKeyUp={this.change} defaultValue={this.props.size.width.feet} />
					</label>
					<label>
						<div className="form-label">Inches:</div>
						<input type="number" step="0.01" ref="widthInches" onKeyUp={this.change} defaultValue={this.props.size.width.inches} />
					</label>
				</div>
			);

			heightInput = (
				<div>
					<label>
						<div className="form-label">Feet:</div>
						<input type="number" step="0.01" ref="heightFeet" onKeyUp={this.change} defaultValue={this.props.size.height.feet} />
					</label>
					<label>
						<div className="form-label">Inches:</div>
						<input type="number" step="0.01" ref="heightInches" onKeyUp={this.change} defaultValue={this.props.size.height.inches} />
					</label>
				</div>
			);
		}
		else {
			widthInput = (
				<div>
					<label>
						<div className="form-label">Meters:</div>
						<input type="number" step="0.01" ref="widthMeters" onKeyUp={this.change} defaultValue={this.props.size.width.meters} />
					</label>
				</div>
			);

			heightInput = (
				<div>
					<label>
						<div className="form-label">Meters:</div>
						<input type="number" step="0.01" ref="heightMeters" onKeyUp={this.change} defaultValue={this.props.size.height.meters} />
					</label>
				</div>
			);
		}

		return (
			<div>
				<header>
					<div className="title">Step 1 of 3 - Garden Size</div>
					<button className="close" onClick={this.props.onClose}></button>
				</header>
				<section>
					<p>Great choice! We're going to walk you through the process of laying out the perfect garden, step by step. First, <strong>How much space do you have for your garden?</strong></p>
					<label className="form-row">
						<div className="form-label">Units</div>
						<select onChange={this.change} ref="units" value={this.props.size.units}>
							<option value="imperial">Feet and inches</option>
							<option value="metric">Meters</option>
						</select>
					</label>
					<div className="form-row">
						<div className="form-label vertical">Width</div>
						{widthInput}
					</div>
					<div className="form-row">
						<div className="form-label vertical">Height</div>
						{heightInput}
					</div>
					{error}
				</section>
				<footer>
					<button onClick={this.next} className="btn lg primary" key="generate">Next: Pick Plants</button>
					<button onClick={this.props.onSwitchPage('welcome')} className="btn lg" key="build">Go back</button>
				</footer>
			</div>
		);
	},
	change: function() {
		let data = {
			units: this.refs.units.value,
		};
		if(this.props.size.units === 'imperial') {
			data.width = {
				feet: this.refs.widthFeet.value,
				inches: this.refs.widthInches.value,
			}
			data.height = {
				feet: this.refs.heightFeet.value,
				inches: this.refs.heightInches.value,
			}
		}
		else {
			data.width = {
				meters: this.refs.widthMeters.value,
			}
			data.height = {
				meters: this.refs.heightMeters.value,
			}
		}
		this.props.onChange(data);
	},
	next: function() {
		let width = null;
		let height = null;
		if(this.props.size.units === 'imperial') {
			if(!this.refs.widthFeet.value) {
				this.setState({ error: 'Please specify the number of feet under width.'});
			}
			else if(!this.refs.heightFeet.value) {
				this.setState({ error: 'Please specify the number of feet under height.'});
			}
			else if(isNaN(parseInt(this.refs.widthFeet.value))) {
				this.setState({ error: 'The number of feet under width must be a whole number.'});
			}
			else if(isNaN(parseInt(this.refs.heightFeet.value))) {
				this.setState({ error: 'The number of feet under height must be a whole number.'});
			}
			else {
				width = (2.54*12*parseInt(this.refs.widthFeet.value) + 2.54*parseInt(this.refs.widthInches.value))/100;
				height = (2.54*12*parseInt(this.refs.heightFeet.value) + 2.54*parseInt(this.refs.heightInches.value))/100;
			}
		}
		else if(this.props.size.units === 'metric') {
			if(!this.refs.widthMeters.value) {
				this.setState({ error: 'Please specify the number of meters under width.'});
			}
			else if(!this.refs.heightMeters.value) {
				this.setState({ error: 'Please specify the number of meters under height.'});
			}
			else if(isNaN(parseFloat(this.refs.widthMeters.value))) {
				this.setState({ error: 'The number of feet under width must be a whole or decimal number.'});
			}
			else if(isNaN(parseFloat(this.refs.heightMeters.value))) {
				this.setState({ error: 'The number of feet under height must be a whole or decimal number.'});
			}
			else {
				width = parseFloat(this.refs.widthMeters.value);
				height = parseFloat(this.refs.heightMeters.value);
			}
		}

		if(width !== null && height !== null) {
			this.props.size.width.meters = width;
			this.props.size.height.meters = height;
			this.props.onSwitchPage('pick-plants')();
		}
	},
	setFocus: function() {
		if(this.refs.widthMeters) {
			this.refs.widthMeters.focus();
		}
		if(this.refs.widthFeet) {
			this.refs.widthFeet.focus();
		}
	}
});
