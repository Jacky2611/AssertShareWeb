var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: function(){
      return Date.now();
    }
  },
  verified_email: {
      type: Boolean,
      default: false
  },
  email_verification_token: {
    type: String,
    default: function() {
      return crypto.randomBytes(16).toString("hex");
    }
  }
});

// This is the important bit
// Using a virtual lets me pass `{ clean_password: 'xyz' }` 
// without actually having it save.
// Instead it is caught by this setter 
// which performs the hashing and 
// saves the hash to the document's hash property.
UserSchema.virtual('clean_password').set(function(value) {
  const salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(value, salt)
})



//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    UserModel.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 400;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            if(user.verified_email){
              return callback(null, user);
            } else {
              var err = new Error('Email not verified.');
              err.status = 401;
              return callback(err);
            }
          
          } else {
            return callback();
          }
        })
      });
}

UserSchema.statics.verifyEmail = function (id, token, callback) {
  console.log("started function.")


  UserModel.findById(id, function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 400;
      return callback(err);
    }
    console.log("found correct user.")
    
    //check if the tokens match
    if(user.email_verification_token==token){
      console.log("tokens match.")

      user.verified_email=true;
      user.save(function (err) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, user);
        }
      });
    } else {
      var err = new Error('Incorrect token.');
      err.status = 400;
      return callback(err);
    }

  });

}

//hashing a password before saving it to the database. save is only called the first time this object is created. 
UserSchema.pre('save', function (next) {
    var user = this;

    //only create new user if the email hasn't already been used
    UserModel.find({email : user.email}, function (err, docs) {
        if (docs.length){                
            console.log('user exists: '+user.name);
            next(new Error("An user with that email already exists!"));
        }
    });
    

    next();

});



var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;