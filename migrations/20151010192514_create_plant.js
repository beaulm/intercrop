exports.up = function(knex, Promise) {
  return knex.schema.createTable('plants', function(t) {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
    t.string('url').nullable();
    t.json('affinities').nullable();
    t.dateTime('createdAt').notNull();
    t.dateTime('updatedAt').nullable();
    t.dateTime('deletedAt').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('plants');
};
