
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors =require('cors');
dotenv.config({path:'./config.env'});

// require("dotenv").config({ path: "./config/.env" });
const app = express()
const PORT=process.env.PORT || 7000;
require('./db/conn');

app.use(express.json());
app.use(cors())
// we link the router file 
app.use(require('./router/auth'));
app.get('/',  (req, res)=> {
  res.send('Hello World')
});

// app.get('/about',  (req, res)=> {
//     res.send('Hello About')
//   });

  // app.get('/contact',  (req, res)=> {
  //   res.send('Hello contact')
  // });
  app.get('/login',  (req, res)=> {
    res.send('Hello Login')
  });

  app.get('/signup',  (req, res)=> {
    res.send('Hello signup')
  });



  if ( process.env.NODE_ENV == "production"){

    app.use(express.static("client/build"));

    const path = require("path");

    app.get("*", (req, res) => {

        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

    })


}

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})