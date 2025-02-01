const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const blog=require('../models/blog');
const usermodel=require('../models/user');
const path = require("path");
const comment=require('../models/comments');
const uploadc=require('../config/multerc');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
const upload=require('../config/multerconfig');
router.use(express.static(path.join(__dirname,"public")));
router.use(express.static("public"));




router.get("/signin", (req, res) => {
  res.render("signin");
});



router.get("/signup", (req, res) => {
  res.render("signup");
});



router.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/signup");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error during password comparison:", err);
        return res
          .status(500)
          .render("signin", { error: "Internal Server Error" });
      }

      if (result) {
        let token = jwt.sign(
          {
            email: email,
            userid: user._id,
            profileImageURL: user.profileImageURL,
            role: user.role,
          },
          "shhh"
        );

        res.cookie("token", token);
        res.redirect("/");
      } else {
        res
          .status(401)
          .render("signin", { error: "Invalid email or password" });
      }
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).render("signin", { error: "Internal Server Error" });
  }
});

router.post('/addblog', isloggedin, upload.single('CoverImage'),  async(req, res) => {
  let {title,content}=req.body;

  

  const newblog = await blog.create({
    title,
    body:content,
    coverimage:`uploads/${req.file.filename}`,
    createdBy:req.user.userid
  })

  res.redirect(`/blog/${newblog._id}`);




});

router.post('/comment/:blogId',isloggedin,async(req,res)=>{
  
  await comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user.userid,
  })

  res.redirect(`/user/blog/${req.params.blogId}`);
});


router.post("/signup", async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).send("User already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = await User.create({
      fullName,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        email: email,
        userid: user._id,
        profileImageURL: user.profileImageURL,
        role: user.role,
        fullName: user.fullName,
      },
      "shhh"
    );

    console.log(token);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



router.get("/new-blog", isloggedin, (req, res) => {
  res.render("blog", { user: req.user });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});



router.get('/profilepic',(req,res)=>{
  res.render('pic');
})

router.post('/profilepic',isloggedin,uploadc.single('image'),async (req,res)=>{
  if(!req.file){
    return res.status(400).send('No file uploaded.');
  }

  let user=await usermodel.findOne({email:req.user.email});
  user.profileImageURL=`images/${req.file.filename}`;
  await user.save();

  res.redirect('/');


})

router.get('/edit/:comm_id', isloggedin, async (req, res) => {
  try {
    const foundComment = await comment.findById(req.params.comm_id); // Renamed variable
    res.render('edit', { user: req.user, comment: foundComment }); // No conflict
  } catch (err) {
    console.error(err);
    res.redirect('/error'); // Handle errors
  }
});


router.post('/edit/:comm_id', async (req, res) => {
  try {
    const { editpart } = req.body;

  
    const updatedComment = await comment.findOneAndUpdate(
      { _id: req.params.comm_id }, 
      { $set: { content: editpart } }, 
      { new: true } 
    );

    
    res.redirect(`/user/blog/${updatedComment.blogId}`);
  } catch (err) {
    console.error(err);
    res.redirect('/error'); 
  }
});



router.get('/blog/:id',isloggedin,async(req,res)=>{
  const nblog= await blog.findById(req.params.id).populate("createdBy");

  const comments = await comment.find({blogId:req.params.id}).populate("createdBy");

  console.log(comments);



  res.render('addblog',{
    user:req.user,
    newblog:nblog,
    comments
  });


  console.log(blog);

})

function isloggedin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return res.render("home", { user: req.user });
  }

  try {
    const data = jwt.verify(token, "shhh");
    req.user = data;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    req.user = null;
    return res.render("home", { user: req.user });
  }
}

module.exports = router;
