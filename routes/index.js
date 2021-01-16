var express = require("express"),
	passport = require("passport"),
	router = express.Router(),
	User = require("../models/user")
	
// Get landing page 
router.get('/', (req, res) => {
	res.render("landing")
})

//=================================================================================
//                               AUTHENTICATION ROUTES
//=================================================================================

// Sign up
router.get("/register", function(req, res){
	res.render("register")
})

// Handles the register
router.post("/register", function(req, res){
	var userName = req.body.username;
	var password = req.body.password;
	User.register({username: userName}, password, function(err, user){
		if(err){
			req.flash("error", err.message)
			return res.render("/register")
		}
		
		passport.authenticate('local')(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username)
			res.redirect("/campgrounds")
		})
	})
})

// Login form
router.get("/login", function(req, res){
	req.flash("error", "You must be logged in first!")
	res.render("login")
	
})

// Handles the login 
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),
	function(req, res) {
	//.......
})

// Handles logout
router.get("/logout", function(req, res){
	req.logout()
	req.flash("error", "You are logged out!!")
	res.redirect("/campgrounds")
})

module.exports = router;