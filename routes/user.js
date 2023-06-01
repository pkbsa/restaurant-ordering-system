var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");

var User = require("../models/user");
var Order = require("../models/order");
var Cart = require("../models/cart");

var csrfProtection = csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedIn, function (req, res, next) {
  //console.log(req.user)
  Order.find({ user: req.user }, function (err, orders) {
    if (err) {
      return res.write("Error!");
    }
    var cart;
    //console.log(orders)
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render("user/profile", {
      orders: orders,
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  });
});

router.post("/edit-profile", isLoggedIn, function (req, res, next) {
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var mobilePhone = req.body.mobilePhone;

  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      console.log(err);
      return res.redirect("/user/profile");
    }

    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      req.flash("error", "Email already in use.");
      return res.redirect("/user/profile");
    }

    User.findOne({ mobilePhone: mobilePhone }, function (err, existingUser) {
      if (err) {
        console.log(err);
        return res.redirect("/user/profile");
      }

      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        req.flash("error", "Mobile number already in use.");
        return res.redirect("/user/profile");
      }

      // Update the user information
      User.updateOne(
        { _id: req.user._id },
        {
          $set: {
            firstname: firstName,
            lastname: lastName,
            phone: mobilePhone,
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
            return res.redirect("/user/profile");
          }

          res.redirect("/user/profile");
        }
      );
    });
  });
});

router.post("/delete-account", isLoggedIn, function (req, res, next) {
  var userid = req.body.userid;
  console.log(userid)

  User.findByIdAndDelete(userid, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send("An error occurred while deleting the account.");
    }
    
    if (!user) {
      return res.status(404).send("User not found.");
    }
    console.log("Deleted")
    return res.redirect("/"); // Redirect to a desired page after successful account deletion
  });
});

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

router.get("/signup", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    console.log(req.session.oldUrl);
    if (req.session.referringUrl) {
      var oldUrl = req.session.referringUrl;
      req.session.referringUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

router.get("/signin", function (req, res, next) {
  var messages = req.flash("error");
  req.session.oldUrl = req.originalUrl;
  console.log(req.session.oldUrl);
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.referringUrl) {
      var oldUrl = req.session.referringUrl;
      req.session.referringUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
