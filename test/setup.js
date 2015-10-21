if (typeof document === 'undefined') {
	var baseDOM = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>';

	var jsdom = require('jsdom').jsdom;
	global.document = jsdom(baseDOM);
	global.window = document.parentWindow;
	global.navigator = {
		userAgent: 'node.js'
	};
}
global.expect = require('chai').expect;
global.React = require('react');
global.utils = require('./utils');
global.sinon = require('sinon');