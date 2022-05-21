var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport');
    flash    = require('connect-flash'),
    LocalStrategy = require('passport-local');
    methodOverride = require('method-override');
    User    = require('./models/user');
    seedDB = require('./seeds'),
    Campground = require('./models/campground'),
    Comment  = require('./models/comment'),
    path = require('path'),
    app = express();

    // requring routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

mongoose.connect('mongodb+srv://emmyzee45:<iorolun45>@cluster0.seizo.mongodb.net/?retryWrites=true&w=majority')
let db = mongoose.connection

db.once('open', function(){
    console.log('mongodb is connected')
});
db.on('error', function(err){
    console.log(err)
});


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(methodOverride('_method')); 
app.use(flash()); 
//seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'student training',
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('yelpcamp has started!!');
});
