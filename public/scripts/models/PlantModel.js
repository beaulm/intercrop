let Backbone = require('backbone');

module.exports = Backbone.Model.extend({
	defaults: {
		id: null,
		name: '',
		affinities: {}
	},
	urlRoot: '/api/v1/plant',
});
