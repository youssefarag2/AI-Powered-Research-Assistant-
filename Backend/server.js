import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = 3000;

app.listen(port, () => {
  console.log("Server Listining on port 3000!!!");
});
