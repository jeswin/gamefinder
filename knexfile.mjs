// knexfile.mjs

// Note: Since this is a monorepo, this knexfile is at the root
// but needs to work with the gamefinder package's migrations

console.log([
  {
    host: process.env.GAMEFINDER_DB_HOST,
    database: process.env.GAMEFINDER_DB_NAME,
    user: process.env.GAMEFINDER_DB_USER,
    password: process.env.GAMEFINDER_DB_PASS,
  },
]);

/**
 * @type {import('knex').Knex.Config}
 */
const config = {
  client: "postgresql",
  connection: {
    host: process.env.GAMEFINDER_DB_HOST,
    database: process.env.GAMEFINDER_DB_NAME,
    user: process.env.GAMEFINDER_DB_USER,
    password: process.env.GAMEFINDER_DB_PASS,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./database/migrations",
    loadExtensions: [".mjs"], // Add this line to load .mjs migration files
  },
  seeds: {
    directory: "./database/seeds",
    loadExtensions: [".mjs"], // Add this line to load .mjs seed files
  },
};

export default config;