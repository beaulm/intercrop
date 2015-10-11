'use strict';
/* globals bookshelf */
module.exports = bookshelf.model('Plant', {
	tableName: 'plants',
	hasTimestamps: ['createdAt', 'updatedAt', 'deletedAt'],
});
