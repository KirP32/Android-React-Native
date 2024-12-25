import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("BoilersDB.db");

export const createTables = async () => {
  await db.withTransactionAsync(async () => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS boilers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status INTEGER,
        humidity REAL,
        pressure REAL,
        temperature REAL,
        rotation_speed REAL,
        synced INTEGER DEFAULT 0
      );
    `);
      console.log("Table 'boilers' created or already exists.");
    } catch (error) {
      console.error("Error creating table 'boilers':", error);
    }
  });
};

export default db;
