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
    User.findOne({ $or: [{ 'email': email }, { 'mobilePhone': req.body.mobilePhone }] }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            if (user.email === email) {
                return done(null, false, { message: 'Email already in use.' });
            } else {
                return done(null, false, { message: 'Mobile phone number already in use.' });
            }
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.admin = 0;
        newUser.firstname = req.body.firstName;
        newUser.lastname = req.body.lastName;
        newUser.address = "";
        newUser.subdistrict = "";
        newUser.district = "";
        newUser.province = "";
        newUser.zipcode = "";
        newUser.phone = req.body.mobilePhone;

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
    User.findOne({'email': email}, function(err,user){
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