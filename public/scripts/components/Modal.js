let React = require('react');

module.exports = React.createClass({
	render: function() {
		if(this.props.isOpen) {
			return (
				<div>
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
	}
});
