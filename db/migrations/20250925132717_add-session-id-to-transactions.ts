import type { Knex } from "knex";

async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.uuid("session_id").after("id").index();
  });
}

async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("session_id");
  });
}

export { up, down };
