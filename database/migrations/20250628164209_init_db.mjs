/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // --- Core Entities ---

  // User Table
  await knex.schema.createTable("user", (table) => {
    table.bigIncrements("id").primary();
    table.string("email").notNullable().unique();
    table.string("name");
    table.string("picture");
    table.text("bio");
    table.bigInteger("current_city_id").unsigned(); // Foreign key added after city table is created
    table.timestamps(true, true);
  });

  // Sport Table
  await knex.schema.createTable("sport", (table) => {
    table.bigIncrements("id").primary();
    table.string("name").notNullable().unique();
    table.string("icon_url");
    table.timestamps(true, true);
  });

  // City Table
  await knex.schema.createTable("city", (table) => {
    table.bigIncrements("id").primary();
    table.string("name").notNullable();
    table.string("state_province");
    table.string("country_iso_code").notNullable();
    table.decimal("latitude", 9, 6).notNullable();
    table.decimal("longitude", 9, 6).notNullable();
  });

  // Sport Format Table
  await knex.schema.createTable("sport_format", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("sport_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sport")
      .onDelete("RESTRICT");
    table.string("name").notNullable();
    table.integer("default_player_count");
  });

  // Venue Table
  await knex.schema.createTable("venue", (table) => {
    table.bigIncrements("id").primary();
    table.string("name").notNullable();
    table.string("address");
    table
      .bigInteger("city_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("city")
      .onDelete("RESTRICT");
    table.decimal("latitude", 9, 6).notNullable();
    table.decimal("longitude", 9, 6).notNullable();
    table
      .bigInteger("created_by_user_id")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("SET NULL");
    table.timestamps(true, true);
  });

  // Game Series Table
  await knex.schema.createTable("game_series", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("owner_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table
      .bigInteger("sport_id")
      .unsigned()
      .references("id")
      .inTable("sport")
      .onDelete("RESTRICT");
    table
      .bigInteger("sport_format_id")
      .unsigned()
      .references("id")
      .inTable("sport_format")
      .onDelete("RESTRICT");
    table
      .bigInteger("venue_id")
      .unsigned()
      .references("id")
      .inTable("venue")
      .onDelete("RESTRICT");
    table.text("default_details");
    table.timestamps(true, true);
  });

  // Game Table
  await knex.schema.createTable("game", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("host_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .bigInteger("sport_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sport")
      .onDelete("RESTRICT");
    table
      .bigInteger("sport_format_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sport_format")
      .onDelete("RESTRICT");
    table
      .bigInteger("venue_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("venue")
      .onDelete("RESTRICT");
    table
      .bigInteger("game_series_id")
      .unsigned()
      .references("id")
      .inTable("game_series")
      .onDelete("SET NULL");
    table.datetime("game_datetime").notNullable();
    table.string("title");
    table.text("details");
    table.string("status").notNullable().defaultTo("PLANNED"); // e.g., PLANNED, COMPLETED, CANCELLED
    table.integer("max_players");
    table.boolean("is_public").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  // Add foreign key constraint to user table now that city table exists
  await knex.schema.alterTable("user", (table) => {
    table
      .foreign("current_city_id")
      .references("id")
      .inTable("city")
      .onDelete("SET NULL");
  });

  // --- Join, Rating & Relationship Tables ---

  // User Sport Preference Table
  await knex.schema.createTable("user_sport_preference", (table) => {
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .bigInteger("sport_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sport")
      .onDelete("CASCADE");
    table.integer("self_rating"); // e.g., scale of 1-5
    table.primary(["user_id", "sport_id"]);
  });

  // Player Sport Rating Table
  await knex.schema.createTable("player_sport_rating", (table) => {
    table
      .bigInteger("rater_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .bigInteger("ratee_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .bigInteger("sport_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sport")
      .onDelete("CASCADE");
    table.enum("tag", ["advanced", "pro"]).notNullable();
    table.timestamps(true, true);
    table.primary(["rater_user_id", "ratee_user_id", "sport_id"]);
  });

  // Game Participant Table
  await knex.schema.createTable("game_participant", (table) => {
    table
      .bigInteger("game_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("game")
      .onDelete("CASCADE");
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.string("status").notNullable().defaultTo("PENDING"); // e.g., PENDING, APPROVED, REJECTED, ATTENDED
    table.timestamp("requested_at").defaultTo(knex.fn.now());
    table.primary(["game_id", "user_id"]);
  });

  // Venue Link Table
  await knex.schema.createTable("venue_link", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("venue_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("venue")
      .onDelete("CASCADE");
    table.string("url").notNullable();
    table.string("type").notNullable(); // e.g., 'google_maps', 'official_website'
    table.timestamps(true, true);
  });

  // Venue Image Table
  await knex.schema.createTable("venue_image", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("venue_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("venue")
      .onDelete("CASCADE");
    table.string("url").notNullable();
    table.boolean("is_primary").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  // --- Chat Tables ---

  await knex.schema.createTable("game_chat", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("game_id")
      .unsigned()
      .notNullable()
      .unique()
      .references("id")
      .inTable("game")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("chat_message", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("game_chat_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("game_chat")
      .onDelete("CASCADE");
    table
      .bigInteger("sender_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("chat_attachment", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("chat_message_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chat_message")
      .onDelete("CASCADE");
    table.string("url").notNullable();
    table.string("type").notNullable().defaultTo("IMAGE");
    table.timestamps(true, true);
  });

  // --- Moderation & Audit Tables ---

  await knex.schema.createTable("blocked_user", (table) => {
    table
      .bigInteger("blocker_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .bigInteger("blocked_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.primary(["blocker_user_id", "blocked_user_id"]);
  });

  await knex.schema.createTable("report", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("reporter_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.bigInteger("reportable_id").notNullable();
    table.enum("reportable_type", ["USER", "GAME", "VENUE"]).notNullable();
    table
      .enum("reason", [
        "SPAM",
        "INAPPROPRIATE_BEHAVIOR",
        "SAFETY_CONCERN",
        "CHEATING",
        "OTHER",
      ])
      .notNullable();
    table.text("details");
    table
      .enum("status", ["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"])
      .notNullable()
      .defaultTo("PENDING");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("resolution", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("report_id")
      .unsigned()
      .notNullable()
      .unique()
      .references("id")
      .inTable("report")
      .onDelete("CASCADE");
    table
      .bigInteger("resolved_by_admin_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.enum("action_taken", [
      "NONE",
      "WARNING_ISSUED",
      "USER_SUSPENDED",
      "GAME_REMOVED",
      "CONTENT_REMOVED",
    ]);
    table.text("notes");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("audit_log", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("user_id")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("SET NULL");
    table.string("action").notNullable();
    table.string("entity_type");
    table.bigInteger("entity_id");
    table.jsonb("details");
    table.timestamp("timestamp").notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Drop tables in reverse order of creation to avoid foreign key errors
  await knex.schema.dropTableIfExists("audit_log");
  await knex.schema.dropTableIfExists("resolution");
  await knex.schema.dropTableIfExists("report");
  await knex.schema.dropTableIfExists("blocked_user");
  await knex.schema.dropTableIfExists("chat_attachment");
  await knex.schema.dropTableIfExists("chat_message");
  await knex.schema.dropTableIfExists("game_chat");
  await knex.schema.dropTableIfExists("venue_image");
  await knex.schema.dropTableIfExists("venue_link");
  await knex.schema.dropTableIfExists("game_participant");
  await knex.schema.dropTableIfExists("player_sport_rating");
  await knex.schema.dropTableIfExists("user_sport_preference");
  await knex.schema.dropTableIfExists("game");
  await knex.schema.dropTableIfExists("game_series");
  await knex.schema.dropTableIfExists("venue");
  await knex.schema.dropTableIfExists("sport_format");
  await knex.schema.dropTableIfExists("city");
  await knex.schema.dropTableIfExists("sport");
  await knex.schema.dropTableIfExists("user");
}
