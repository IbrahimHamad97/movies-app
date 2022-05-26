const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

const app = express();

mongoose
  .connect(
    "mongodb://Ibrahim:morning123@cluster0-shard-00-00.1pi10.mongodb.net:27017,cluster0-shard-00-01.1pi10.mongodb.net:27017,cluster0-shard-00-02.1pi10.mongodb.net:27017/?ssl=true&replicaSet=atlas-exvg7g-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Origin, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/movies", movieRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
