var express = require("express"),
	Campground = require("../models/campground"),
	middleware = require("../middleware"),
	router = express.Router()


//-------------INDEX ROUTE------------------
// Find all the campgrounds from the database and render it
router.get("/", (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log("Something went wrong")
			console.log(err)
		}
		else {
			res.render("campground/index", {campgrounds:campgrounds})
		}
	}) 
})

//------------CREATE ROUTE------------
// Campgrounds post method
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name
	var price = req.body.price
	var image = req.body.image
	var description = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image :image, description: description, author: author}
	
	// Create a new newCampground
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log("Something went wrong!!")
			console.log(err)
		}
		else {
			console.log("New campground addded to the database")
			console.log(newlyCreated)
			
			// redirect back to campgrounds
	        res.redirect("/campgrounds")
		}
	})
	
})

//-----------NEW ROUTE--------------
// Creating a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campground/new")
})

//----------SHOW ROUTE--------------
// Creating a show page
router.get("/:id", function(req,res) {
	
	// Get the id of that particular campgrounds and pass it to show template
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log("Something went wrong")
			console.log(err)
		}
		else{
			console.log(foundCampground)
			res.render("campground/show", {campground:foundCampground})
		}
	})
})

//---------------EDIT ROUTE------------------
// Edit page
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campground/edit", {campground:foundCampground})
	})
})

//-----------UPDATE ROUTE------------------
// Update 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds/" + updatedCampground._id)
		}
	})
})

//---------------DESTROY ROUTE-----------------
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
});

module.exports = router;
