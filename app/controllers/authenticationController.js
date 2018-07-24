var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

exports.register = function(req, res, next) {
    if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
  
      //get User model from mongoose object
  
  
      var userData = {
        email: req.body.email,
        username: req.body.username,
        clean_password: req.body.password,
        //created_at: Date.now()
      }
  
      
  
      //use schema.create to insert data into the db
      UserModel.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
          return res.redirect('/profile');
        }
      });
    }
};

exports.login = function(req, res, next) {
    UserModel.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        if(!error){
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          return next(error);
        }
      } else {
        generateSession(req, user);
        return res.redirect('/profile');
      }
    })
  };

exports.logout = function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  };

exports.verify_email = function(req, res, next) {
    //.../verify_email?id=4&token=sdfa3
    var userId = req.param('id');
    var token = req.param('token');
  
  
  
    UserModel.verifyEmail(userId, token, function (error, user) {
      if (error || !user) {
        return next(error);
      } else {
        generateSession(req, user);
        return res.redirect('/profile');
      }
    })
  };

function generateSession(req, user){
    req.session.userId = user._id;
    req.session.email = req.body.email;
    req.session.username = user.username;
  }