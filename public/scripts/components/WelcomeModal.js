let React = require('react');
let Modal = require('./Modal');
let WelcomeModalHomePage = require('./WelcomeModalHomePage');
let WelcomeModalSizePage = require('./WelcomeModalSizePage');
let WelcomeModalPickPage = require('./WelcomeModalPickPage');
let WelcomeModalQuantitiesPage = require('./WelcomeModalQuantitiesPage');
let PlantCollection = require('../collections/PlantCollection');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			page: 'welcome',
			pickedPlants: new PlantCollection(),
			size: {
				units: 'imperial',
				width: {
					feet: '',
					inches: '',
				},
				height: {
					feet: '',
					inches: '',
				}
			}
		};
	},
	render: function() {
		let page = null;
		switch(this.state.page) {
			case 'welcome':
				page = <WelcomeModalHomePage
							onClose={this.props.onClose}
							onSwitchPage={this.switchPage} />
			break;
			case 'garden-size':
				page = <WelcomeModalSizePage
							onClose={this.props.onClose}
							onSwitchPage={this.switchPage}
							onChange={this.setSize}
							size={this.state.size} />
			break;
			case 'pick-plants':
				page = <WelcomeModalPickPage
							onClose={this.props.onClose}
							onSwitchPage={this.switchPage}
							onPickPlants={this.pickPlants}
							plants={this.props.plants}
							pickedPlants={this.state.pickedPlants} />
			break;
			case 'plant-quantities':
				page = <WelcomeModalQuantitiesPage
							onClose={this.props.onClose}
							onFinish={this.finish}
							onSwitchPage={this.switchPage}
							plants={this.state.pickedPlants} />
			break;
		}

		return (
			<Modal isOpen={this.props.isOpen} onClose={this.props.onClose}>
				{page}
			</Modal>
		);
	},
	switchPage: function(page) {
		return (e) => {
			this.setState({ page: page });
		}
	},
	pickPlants: function(plants) {
		this.setState({
			page: 'plant-quantities',
			pickedPlants: plants,
		});
	},
	setSize: function(size) {
		this.setState({
			size: size
		})
	},
	finish: function() {
		this.props.onFinish(this.state.size, this.state.pickedPlants);
	}
});
