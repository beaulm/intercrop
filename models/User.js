'use strict';
/* globals bookshelf */
require('./Authentication');
require('./Course');
module.exports = bookshelf.model('User', {
	tableName: 'users',
	hasTimestamps: ['createdAt', 'updatedAt', 'deletedAt'],
	authentication: function() {
		this.hasMany('Authentication', 'userId');
	},
	courses: function() {
		this.belongsToMany('Course', 'courses_users', 'userId', 'courseId');
	}
});