var middleware = {}

middleware.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash('error', 'Campground is not found');
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please you need to be logged in before you do that');
    res.redirect('/login');
}

module.exports = middleware;