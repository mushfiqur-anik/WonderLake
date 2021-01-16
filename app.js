// Connecting express
var bodyParser     = require("body-parser"),
	Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	passport       = require("passport"),
	User           = require("./models/user"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	flash          = require('connect-flash'),
	//seedDB         = require("./seeds"),
	mongoose       = require("mongoose"),
	express        = require("express"),
	app            = express()

// Requiring the routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index")

// mongodb+srv://MushfiqurAnik:9h#WeO72@@myproject.nsrwn.mongodb.net/<dbname>?retryWrites=true&w=majority
// Connecting to the database
mongoose.connect('mongodb://localhost:27017/yelp_camp_v12Deployed', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message))

app.use(flash())
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))


//----------Passport configuration------------
// These are express and session requirements
app.use(require("express-session")({ 
	secret: 'keyboard cat',
    resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// These are passport-local-mongoose requirements
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This middleware is used in all routes
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

// Using the routes
app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

// Listening to server
app.listen("3000", () => {
	console.log("Listening at port 3000")
})