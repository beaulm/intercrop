let React = require('react');
let Modal = require('./Modal');
let WelcomeModalHomePage = require('./WelcomeModalHomePage');
let WelcomeModalPickPage = require('./WelcomeModalPickPage');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			page: 'welcome'
		};
	},
	render: function() {
		var page = null;
		switch(this.state.page) {
			case 'welcome':
				page = <WelcomeModalHomePage onClose={this.props.onClose} onSwitchPage={this.switchPage} />
			break;
			case 'pick-plants':
				page = <WelcomeModalPickPage onClose={this.props.onClose} onSwitchPage={this.switchPage} plants={this.props.plants} dispatcher={this.props.dispatcher} />
			break;
		}

		return (
			<Modal isOpen={this.props.isOpen}>
				{page}
			</Modal>
		);
	},
	switchPage: function(page) {
		return (e) => {
			this.setState({ page: page });
		}
	}
});
