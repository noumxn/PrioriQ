import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {userData} from '../data/index.js';

(async () => {
  let tom = undefined;
  let john = undefined;

  console.log("Seeding Database");
  console.log("├─ Setting up Database Connection")
  try {
    const db = await dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Creating Users...");
  try {
    tom = await userData.createUser("Tom", "Smith", "01/12/2000", "tom@gmail.com", "tom_smith", "hello123*");
    console.log(tom);
  } catch (e) {
    console.log(e);
  }
  try {
    john = await userData.createUser("John", "Arbuckle", "10/28/1995", "john@stevens.edu", "john23", "hello123#");
    console.log(john);
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Verifying Users...");
  console.log("├─ Adding Boards...");
  console.log("├─ Adding Shared Boards...");
  console.log("└─ Adding Tasks...");
  await closeConnection();
  console.log("Seeding Complete!")
}
)();

