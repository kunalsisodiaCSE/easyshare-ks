//Author: Kunal Sisodia
//requirements
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const cors = require("cors");

//creating port to launch api
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(express.json());

//cloud based mongo DB
const connectDatabase = require("./config/database");
connectDatabase();

//front page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//cors setup
const corsOption = {
  origin: process.env.CLIENT_EMAILS.split(","),
  //origin: ["http://localhost:3000","http://localhost:5000"]
};
app.use(cors(corsOption));

//Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

// Serve static files from the React app listen on port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log("Click on the below link to connect.");
  console.log(`http://localhost:${PORT}`);
});
