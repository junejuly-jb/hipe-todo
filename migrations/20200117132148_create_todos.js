exports.up = function(knex) {
    return Promise.all([
		knex.schema.createTable('todos', table => {
			table.increments('id').primary()
            table.integer('user_id').unsigned().notNullable().references('users.id');
            table.string('title');
		})
	]); 
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('todos')
      ]);
};
