var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	
	// Check if the user is authenticated or not!
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("/campgrounds")
			} else{
				
				// Check if the campground owner's id is the same as user's id
				console.log("-----------------------------------------------------------------------------------")
				console.log("Checking foundCampground")
				console.log(foundCampground)
				
				console.log("-----------------------------------------------------------------------------------")
				console.log("Checking req.body.campground")
				console.log(req.body.campground)
				
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that")
					res.redirect("back")
				}
			}
		})
	}
	else{
		req.flash("error", "You must be logged in to do that")
		res.redirect("back")
	}
	
} 

middlewareObj.checkCommentOwnership = function(req, res, next){
	
	// Check if the user is authenticated or not!
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Campground not found")
				res.redirect("/campgrounds")
			} else{
				
				// Check if the comment owner's id is the same as user's id
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that")
					res.redirect("back")
				}
			}
		})
	}
	else{
		req.flash("error", "You must be logged in to do that")
		res.redirect("back")
	}
	
} 

// Middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error", "You must be logged in to do that")
	res.redirect("/login")
}

module.exports = middlewareObj;