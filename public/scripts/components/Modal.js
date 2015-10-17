let React = require('react');

module.exports = React.createClass({
	componentWillMount: function() {
		document.body.addEventListener('keyup', this.keyUp);
	},
	render: function() {
		if(this.props.isOpen) {
			return (
				<div onKeyUp={this.keyUp} ref="parent">
					<div className="modal-spacer">
						<div className="modal">
							{this.props.children}
						</div>
					</div>
					<div className="overlay"></div>
				</div>
			);
		}
		else {
			return null;
		}
	},
	keyUp: function(e) {
		if(this.props.isOpen && this.props.onClose && e.keyCode === 27) {
			this.props.onClose();
		}
	}
});
