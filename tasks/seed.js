import {dbConnection, closeConnection} from '../config/mongoConnection.js';

(async () => {

  console.log("Seeding Database");
  console.log("├─ Setting up Database Connection")
  try {
    const db = await dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }

  console.log("├─ Creating Users...");
  console.log("├─ Verifying Users...");
  console.log("├─ Adding Boards...");
  console.log("├─ Adding Shared Boards...");
  console.log("└─ Adding Tasks...");
  await closeConnection();
  console.log("Seeding Complete!")
}
)();

