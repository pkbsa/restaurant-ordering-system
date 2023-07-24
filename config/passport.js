var passport = require('passport');
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function(user, done){
    done(null, user.id)
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err,user);
    })
})

passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 4 });
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('mobilePhone', 'Invalid mobile phone number').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error){
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error',messages));
    }
    User.findOne({ 'email': email.toLowerCase()  }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Email already in use.' });
        }

        var newUser = new User();
        newUser.email = email.toLowerCase();
        newUser.password = newUser.encryptPassword(password);
        newUser.admin = 0;
        newUser.firstname = req.body.firstName;
        newUser.lastname = req.body.lastName;
        newUser.address = "";
        newUser.latitude = "";
        newUser.longitude = "";
        newUser.mobilePhone = req.body.mobilePhone;

        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done){
    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error){
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error',messages));
    }
    User.findOne({'email': email.toLowerCase()}, function(err,user){
        if (err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'No user found.'})
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password.'})
        }
       return done(null, user);
    })
}));

passport.use('local.reset-password', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'newpassword',
    passReqToCallback: true
}, function(req, email, password, done){
    console.log("reset password")
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('oldpassword', 'Invalid old password').notEmpty();
    req.checkBody('newpassword', 'Invalid password').notEmpty().isLength({ min: 4 });
    req.checkBody('confirmpassword', 'Passwords do not match').equals(password);

    var errors = req.validationErrors();
    console.log(errors)
    if(errors){
        
        var messages = [];
        errors.forEach(function (error){
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'User not found.' });
        }

        // Check if the old password matches
        if (!user.validPassword(req.body.oldpassword)) {
            return done(null, false, { message: 'Invalid old password.' });
        }

        // Update user's password
        user.password = user.encryptPassword(password);

        user.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    });
}));
