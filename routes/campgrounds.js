var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middlewareObj = require('../middleware');

//INDEX - show all campgrounds
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampground){
        if(err){
            console.log(err)
        }
        res.render('campgrounds/index', {campgrounds:allCampground})
    });
});

//CREATE - add new campground to DB
router.post('/', middlewareObj.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, price: price, image: image, description: desc, author:author};
    console.log(req.user)
   Campground.create(newCampground, function(err, newly){
       if(err){
           req.flash('error', err.message);
            console.log(err)
        } else {
            req.flash('success', 'Successfully created');
            res.redirect('/campgrounds');
        }
   });
});

//NEW - show form to create new campground
router.get('/new', middlewareObj.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }
        res.render('campgrounds/show', {campground:foundCampground});
    });
});

// EDIT - edit campground
router.get('/:id/edit', middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground})  
    });
});

// UPDATE - update campground route
router.put('/:id', middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:id', middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground deleted');
            res.redirect('/campgrounds')
        }
    });
});

module.exports = router;