import db from "./database";

export interface SensorData {
  humidity: number;
  pressure: number;
  temperature: number;
  rotation_speed: number;
}

export interface DataItem {
  [x: string]: any;
  id: string;
  name: string;
  status: boolean;
  sensor_data: SensorData;
  synced: boolean;
}

export const insertBoiler = async (boiler: DataItem) => {
  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      "INSERT INTO boilers (id, name, status, humidity, pressure, temperature, rotation_speed, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        boiler.id,
        boiler.name,
        boiler.status ? 1 : 0,
        boiler.sensor_data.humidity,
        boiler.sensor_data.pressure,
        boiler.sensor_data.temperature,
        boiler.sensor_data.rotation_speed,
        1,
      ]
    );
    console.log(result.lastInsertRowId, result.changes);
  });
};

export const getBoilers = async () => {
  const result = await db.getAllAsync("SELECT * FROM boilers");
  return result;
};

export const updateBoilerStatus = async (id: string, status: boolean) => {
  const result = await db.runAsync(
    "UPDATE boilers SET status = ? WHERE id = ?",
    [status ? 1 : 0, id]
  );
  console.log("Updated rows:", result.changes);
};

export const deleteBoilerById = async (id: string) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM boilers WHERE id = ?",
      [id]
    );
    if (!result) {
      console.log(`Boiler with id ${id} not found.`);
      return;
    }

    const deleteResult = await db.runAsync("DELETE FROM boilers WHERE id = ?", [
      id,
    ]);
    console.log("Deleted rows:", deleteResult.changes);
  } catch (error) {
    console.error("Error deleting boiler:", error);
  }
};

export const updateSyncStatus = async (id: string, status: boolean) => {
  try {
    const result = await db.runAsync(
      "UPDATE boilers SET synced = ? WHERE id = ?",
      [status ? 1 : 0, id]
    );
    console.log("Sync status updated:", result.changes);
  } catch (error) {
    console.error("Error updating sync status:", error);
  }
};

const isEqual = (a: DataItem, b: DataItem) => {
  return (
    a.name === b.name &&
    a.status === b.status &&
    a.sensor_data.humidity === b.sensor_data.humidity &&
    a.sensor_data.pressure === b.sensor_data.pressure &&
    a.sensor_data.temperature === b.sensor_data.temperature &&
    a.sensor_data.rotation_speed === b.sensor_data.rotation_speed
  );
};

export const insertOrUpdateBoiler = async (boiler: DataItem) => {
  const existingBoiler = await db.getAllSync(
    "SELECT * FROM boilers WHERE id = ?",
    [boiler.id]
  );

  const existingBoilerTyped = (existingBoiler as unknown[])[0] as
    | DataItem
    | undefined;

  if (existingBoilerTyped) {
    if (isEqual(existingBoilerTyped, boiler)) {
      console.log(
        `Boiler with id ${boiler.id} is identical, no update needed.`
      );
      return;
    }

    await db.runAsync(
      "UPDATE boilers SET name = ?, status = ?, humidity = ?, pressure = ?, temperature = ?, rotation_speed = ? WHERE id = ?",
      [
        boiler.name,
        boiler.status ? 1 : 0,
        boiler.sensor_data.humidity,
        boiler.sensor_data.pressure,
        boiler.sensor_data.temperature,
        boiler.sensor_data.rotation_speed,
        boiler.id,
      ]
    );
    console.log(`Boiler with id ${boiler.id} updated`);
  } else {
    await db.runAsync(
      "INSERT INTO boilers (id, name, status, humidity, pressure, temperature, rotation_speed) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        boiler.id,
        boiler.name,
        boiler.status ? 1 : 0,
        boiler.sensor_data.humidity,
        boiler.sensor_data.pressure,
        boiler.sensor_data.temperature,
        boiler.sensor_data.rotation_speed,
      ]
    );
    console.log(`Boiler with id ${boiler.id} inserted`);
  }
};

export const getUnsyncedBoilers = async () => {
  const result = await db.getAllAsync("SELECT * FROM boilers WHERE synced = 0");
  return result as DataItem[];
};

export const updateBoilerSyncStatus = async (id: string) => {
  await db.runAsync("UPDATE boilers SET synced = 1 WHERE id = ?", [id]);
};

export const updateBoiler = async (boiler: DataItem) => {
  await db.runAsync(
    "UPDATE boilers SET name = ?, status = ?, humidity = ?, pressure = ?, temperature = ?, rotation_speed = ?, synced = 0 WHERE id = ?",
    [
      boiler.name,
      boiler.status ? 1 : 0,
      boiler.sensor_data.humidity,
      boiler.sensor_data.pressure,
      boiler.sensor_data.temperature,
      boiler.sensor_data.rotation_speed,
      boiler.id,
    ]
  );
};

export const getBoilerById = async (id: string) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM boilers WHERE id = ?",
      [id]
    );

    if (result) {
      return result as DataItem;
    }

    return null;
  } catch (error) {
    console.error("Error fetching boiler by ID:", error);
    return null;
  }
};

export const deleteBoilersByIds = async (ids: string[]) => {
  try {
    const placeholders = ids.map(() => "?").join(", ");
    const result = await db.runAsync(
      `DELETE FROM boilers WHERE id IN (${placeholders})`,
      ids
    );
    console.log(`Deleted ${result.changes} boilers with specified IDs`);
  } catch (error) {
    console.error("Error deleting boilers by IDs:", error);
  }
};
