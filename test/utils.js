var React = require('react');
var divs = [];
module.exports = {
	renderIntoDocument: function(instance) {
		var div = document.createElement('div');
		divs.push(div);
		return React.render(instance, div);
	}
}