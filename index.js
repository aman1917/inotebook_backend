const mongoose = require("mongoose");
const express = require("express");

const app = express();
const port = 3001;

app.use(express.json());

//For connection Purpose
mongoose
  .connect("mongodb://127.0.0.1:27017/inotebook")
  .then(() => {
    console.log("mongoose connected");
    app.listen(3001, () => {
      console.log(`INotebook is runnning on http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Failed");
  });

//Get data from server
app.get("/", (req, res) => {
  res.send("Sever connected Sucessfully");
});

//Available Routes

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

