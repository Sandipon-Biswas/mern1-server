const express = require('express');
const router =express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
require('../db/conn');
const User = require('../model/userSchema');
const authenticate =require("../middleware/authenticate")
router.get('/',  (req, res)=> {
    res.send('Hello World from server router')
  });

// router.post("/create", async (req, res) => {
//   const {name,email,phone,work,password,cpassword} = req.body;
//   if (!name || !email || !phone || !work || !password || !cpassword ) {
//     return res.status(422).json({error:"please fill all the document" });
//   }
//   User.findOne({email:email})
//   .then((userEsist)=>{
//     if(userEsist){
//       return res.status(422).json({error:"Enauk akreadt Exust"});
//     }
//     const user = new User({ name, email, phone, work, password, cpassword }); 
//     user.save().then(()=>{ res.status(201).json({ message: "user registered successfuly" }); })
//     .catch((err) => res.status(500).json({ error: "Failed to registered" }));


//   }).catch(err=>{console.log(err);})


// });







router.post("/register", async (req, res) => {
  const {name,email,phone,work,password,cpassword} = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword ) {
    return res.status(422).json({error:"please fill all the document" });
  }

  try {
    
  const userEsist =await User.findOne({email:email})
  if(userEsist){
    return res.status(422).json({error:"Email akreadt Exust"});
  }else if(password != cpassword){
    return res.status(422).json({error:"password are not same"});
  }else{
    const user = new User({ name, email, phone, work, password, cpassword }); 
    await user.save();
    res.status(201).json({ message: "user registered successfuly" });
  }

  } catch (error) {
    console.log(error);
  }
});


router.post("/signin",async(req,res)=>{


try {
  const {email,password} = req.body;
  const userEsist1 =await User.exists({email:email})
  if (!userEsist1) {
    return res.status(400).json({error:"invalid email"});
  }
  if (!email || !password) {
    return res.status(400).json({error:"fill the data"});
  }
  const userLogin =await User.findOne({email:email})
 const isMatch =await bcrypt.compare(password, userLogin.password);

 const token =await userLogin.generateAuthToken();

 console.log(token);
 res.cookie("jwtt",token,{
   expires:new Date(Date.now()+25892000000),
   httpOnly:false
 });
 if (!isMatch ) {
  return res.status(400).json({error:"error user"});
 } else {
  res.json({ message: "user login successfuly" });
 }
 
} catch (error) {
  console.log(error);
}

})
router.use(cookieParser());
// about us page
router.get('/about', authenticate, (req, res) => {
        res.send(req.rootUser)
})
router.get('/homeandcontact', authenticate, (req, res) => {
  res.send(req.rootUser)
})

router.post('/contact',authenticate, async  (req, res)=> {
  try {
    const {name,email,phone,message}=req.body;
    if (!name || !email || !phone || !message ) {
      console.log("error from contact form");
      return res.json({error:"piz fill the message form"})
    }
    const userContact =await User.findOne({_id:req.userID});
    if (userContact) {
      const userMessage= await userContact.addMessage(name,email,phone,message) ;
      await userContact.save();
      res.status(201).json({message:"user contact form message sent successfully"})
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  console.log("hello log in page");
  res.clearCookie('jwtt',{path:"/"})
  res.status(200).send('user logout')
})
module.exports=router;