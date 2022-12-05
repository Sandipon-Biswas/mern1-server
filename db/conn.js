const mongoose = require('mongoose');
const uri=process.env.DATABASE ;



mongoose
  .connect(
    "mongodb+srv://sandipon:sandipon@cluster0.g4llpzi.mongodb.net/mern1?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("database started");
  })
  .catch((err) => {
    console.log("database error" + err);
  });