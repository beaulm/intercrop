exports.up = function(knex, Promise) {
	return knex.schema.table('plants', function(t) {
		t.unique('name');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table('plants', function(t) {
		t.dropUnique('name');
	});
};
