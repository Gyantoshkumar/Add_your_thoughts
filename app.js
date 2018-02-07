const express=require('express');
const path=require('path'); 
const exphbs  = require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport=require('passport');
const  flash = require('connect-flash');
const methodOverride = require('method-override');
const app=express();

//load routes
const ideas=require('./routes/ideas');
const users=require('./routes/users');

// Passport Config
require('./config/passport')(passport);
//Db config
const db=require('./config/database');
 
//  map global promise get rid of warning
mongoose.Promise=global.Promise; 

//connect to mongoose
mongoose.connect(db.mongoURI,{useMongoClient:true;})
.then(()=>console.log('mongodb connected ....'))
.catch(err=>console.log(err));


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

//Static folder
app.use(express.static(path.join(__dirname,'public')));

//express sessionjs
app.use(session({
  secret: 'keyboard',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//Global varibles
app.use(function( req, res, next){
	res.locals.success_msg=req.flash('sucess_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	res.locals.user=req.user ||null;
	next();
})

//how middleware works 
/*app.use(function(req,res,next)
	{
		console.log(Date.now());
		req.name='gyan';
		next();
	});
*/
//get request
app.get('/',(req,res)=>
{ 
	const title="";
    res.render('index',{
    	title:title
    });
});

app.get('/about',(req,res)=>
{	res.render('about');
});

//get request of home
app.get('/home',(req,res)=>
{
	res.render('home');
});
//use routes
app.use('/ideas',ideas);
app.use('/users',users);
 
const port=process.env.PORT||5000;
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
}); 