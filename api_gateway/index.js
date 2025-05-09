const gateway = require("fast-gateway");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port;
const cors = require("cors");
app.use(cors());

function errorHandler(err, req, res, next){
    console.error(err.stack);
  
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      stack: err.stack,
    });
  }

const api_end_point = 'http://localhost';

const server = gateway({
  routes: [
    {
      prefix: "/onboarding",
      target: `${api_end_point}:4002`,
    },
    {
      prefix: "/blockchain", 
      target: `${api_end_point}:4004`,
    },
    {
      prefix: "/market-data", 
      target: `${api_end_point}:4005`,
    },
    {
      prefix:'/order',
      target:`${api_end_point}:10007`,
    }
  ],
  before:[errorHandler]
});

server.get("/testing", (req, res) => {
  res.send("Server is from APi-Gateway");
});

server
  .start(1000)
  .then(console.log(`MAIN SERVER Running on port ${port} for Api-Gateway`));