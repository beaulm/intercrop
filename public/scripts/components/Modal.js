let React = require('react');

module.exports = React.createClass({
	render: function() {
		if(this.props.isOpen) {
			return (
				<div>
					<div className="modal-spacer">
						<div className="modal">
							<header>
								<div className="title">{this.props.title}</div>
							</header>
							<section>
								{this.props.children}
							</section>
							<footer>
								{this.props.footer}
							</footer>
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
