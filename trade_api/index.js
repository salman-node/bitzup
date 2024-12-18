const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const router = require("./routes/router");
const app = express();
const cors = require('cors')
// const multer= require("multer");
// app.use(multer().any())
app.use(cors())

const port = process.env.port

app.use(bodyParser.json())
app.use(express.json())
app.use('/user',router)


app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});