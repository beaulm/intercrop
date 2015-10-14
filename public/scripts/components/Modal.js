let React = require('react');

module.exports = React.createClass({
	render: function() {
		if(this.props.isOpen) {
			var header = this.props.header || null;
			var footer = this.props.footer || null;

			if(!header && this.props.title) {
				var closeButton = null;
				if(this.props.onClose) {
					closeButton = <button className="close" onClick={this.props.onClose}></button>;
				}
				header = (
					<header>
						<div className="title">{this.props.title}</div>
						{closeButton}
					</header>
				);
			}
			return (
				<div>
					<div className="modal-spacer">
						<div className="modal">
							{header}
							<section>
								{this.props.children}
							</section>
							{footer}
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
