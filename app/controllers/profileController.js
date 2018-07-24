exports.show_own_profile = function(req, res, next) {
    res.render('profile', {title: req.session.username, owner: true, profilename: req.session.username});
};
exports.show_public_profile = function(req, res, next) {

    let profilename = req.params.profileID; //do something with this...
    res.render('profile', {title: profilename, profilename: profilename});
};