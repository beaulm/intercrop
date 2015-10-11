let React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			editing: false
		};
	},

	render: function() {
		var content = null;
		if(this.state.editing) {
			content = (
				<form onSubmit={this.saveResize} className="resize-form">
					Resize
					<input type="number" ref="width" defaultValue={this.props.width} />
					<span>x</span>
					<input type="number" ref="height" defaultValue={this.props.height} />
					<select ref="units" defaultValue={this.props.units}>
						<option value="imperial">Feet</option>
						<option value="metric">Meters</option>
					</select>
					<button className="save-cancel" type="button" onClick={this.setEditing(false)}>Cancel</button>
					<button className="save-resize">Update</button>
				</form>
			);
		}
		else {
			content = (
				<button className="resize" onClick={this.setEditing(true)}><i /> Resize {this.props.width} x {this.props.height} Plot</button>
			);
		}
		return content;
	},
	setEditing: function(val) {
		return () => {
			this.setState({ editing: val });
		}
	},
	saveResize: function(e) {
		e.preventDefault();
		this.props.onChange(
			parseInt(this.refs.width.value),
			parseInt(this.refs.height.value),
			this.refs.units.value
		);
		this.setState({ editing: false });
	}
});
