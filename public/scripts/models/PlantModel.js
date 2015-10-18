let Backbone = require('backbone');
let React = require('react');

module.exports = Backbone.Model.extend({
	defaults: {
		id: null,
		name: '',
		url: '',
		affinities: {}
	},
	urlRoot: '/api/v1/plant',
	generateImage: function() {
		if(this.get('url')) {
			return <img src={this.get('url')} />
		}
		else {
			return <div className="no-image">{this.get('name').substr(0, 2)}</div>
		}
	}
});
