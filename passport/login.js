var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
        console.log('what up');
            // check in mongo if a user with username exists or not
            User.findOne({ $or: [{ 'username' :  username }, { 'email': username }] }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.error(err);
                        return done(err);
                    }
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                
                    isValidPassword(user, password, function (didMatch) {
                        // User exists but wrong password, log the error 
                        if (!didMatch) {
                            console.log('Invalid Password');
                            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        console.log('user auth seccessful', user);
                        return done(null, user);
                    });
                }
            );

        })
    );


    var isValidPassword = function(user, password, done){
        bCrypt.compare(password, user.password, function (err, didMatch) {
            done(didMatch);
        });
    };
}