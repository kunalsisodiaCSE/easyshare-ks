const File = require("./models/file");
const fs = require("fs");
const connectDatabase = require("./config/database");
connectDatabase();

async function fetchingData() {
  //initally fetch all the 24 hours old file.
  const files = File.find({
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`Error while deleting file ${err}`);
      }
    }
    console.log(`Job done!`);
  }
}

fetchingData().then(process.exit());
