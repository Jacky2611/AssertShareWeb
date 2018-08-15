var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

exports.show_own_profile = function(req, res, next) {
    
    res.render('profile', {title: req.session.username, owner: true, profilename: req.session.username, userId: req.session.userId});
};
exports.show_public_profile = function(req, res, next) {

    UserModel.findById(req.params.userId, function (err, user) {
        if (err) {
          //return next(err) We don't want our users to see this...

          var errPublic = new Error('Found no user with this id.');
          errPublic.status = 404;
          errPublic.stack = err.stack;
          return next(errPublic)

        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 400;
          return next(err);
        }
        let profilename = user.username;
        
        
        res.render('profile', {title: profilename, profilename: profilename});
    
      });

};