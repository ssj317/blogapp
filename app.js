require('dotenv').config()
const express=require('express');
const app=express();
const PORT=process.env.PORT||8000;
const path=require('path');
const cookieParser=require('cookie-parser');
const routes=require('./routes/user');
const blog=require('./models/blog');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.join(__dirname, 'public')));







app.set('view engine',"ejs");
app.set("views",path.resolve("./views"));

mongoose.connect(process.env.MONGO_URL).then(e=>{
    console.log("mongodb connected");
});

app.use((req, res, next) => {
  const token = req.cookies.token; 
  if (token) {
    try {
      const decoded = jwt.verify(token, "shhh"); 
      console.log(decoded); 
      res.locals.user = decoded; 
    } catch (err) {
      console.error("Invalid Token:", err);
      res.locals.user = null; 
    }
  } else {
    res.locals.user = null; 
  }
  next(); 
});




app.get('/', isloggedin, async (req, res) => {
  try {
      
      if (!req.user) {
          
          return res.render('home', {
              user: null, 
              blogs: null 
          });
      }

     
      const allblogs = await blog.find({}) || [];

      res.render('home', {
          user: req.user,
          blogs: allblogs,
      });

  } catch (err) {
      console.error('Error fetching blogs:', err.message);

      
      res.render('home', {
          user: null,
          blogs: null
      });
  }
});







app.use('/user',routes);


app.listen(PORT,()=>{
    console.log("server started");
})

function isloggedin(req, res, next) {
    const token = req.cookies.token; 
  
   
    if (!token) {
      req.user = null; 
      return res.render('home', { user: req.user }); 
    }
  
    try {
    
      const data = jwt.verify(token, 'shhh'); 
      req.user = data; 
      next(); 
    } catch (err) {
      console.error('Token verification failed:', err.message);
      req.user = null;
      return res.render('home', { user: req.user }); 
    }
  }