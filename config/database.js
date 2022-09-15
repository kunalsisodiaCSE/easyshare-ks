require("dotenv").config();
const mongoose = require("mongoose");

function connectDatabase() {
  // here all database connection will be availabe
  //url is not used coz it'll show the connection details. that's why environment
  //variables are used, which import the url data and hide it from the viewer
  // package required for it is 'dotenv'
  mongoose.connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });

  const connection = mongoose.connection;

  // act as an event listener, one time connection
  connection.once("open", () => {
      console.log("Database connected... Enjoy your day!");
    }).catch((err) => {
      console.log("Connection failed... Better luck next time!");
    });
}
//exporting all the functions
module.exports = connectDatabase;
