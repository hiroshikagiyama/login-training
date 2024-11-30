/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", function(table){
    table.increments("id").primary();
    table.string("username", 64).notNullable();
    table.string("email", 64).notNullable();
    table.string("hashed_password").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
