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
  req.session.referringUrl = req.originalUrl;

  Order.find(
    { user: req.user, paymentStatus: { $ne: "Awaiting Payment" } },
    function (err, orders) {
      if (err) {
        return res.write("Error!");
      }
      var cart;
      orders.forEach(function (order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });

      var messages = req.flash();
      console.log(messages);
      res.render("user/profile", {
        orders: orders,
        user: req.user,
        csrfToken: req.csrfToken(),
        messages: messages,
      });
    }
  );
});

router.get("/adddeliverylocation", isLoggedIn, function (req, res, next) {
  console.log(req.session.referringUrl);
  res.render("user/delivery", {
    csrfToken: req.csrfToken(),
    user: req.user,
    redirectUrl: req.session.referringUrl,
  });
});

router.post("/edit-address", isLoggedIn, function (req, res, next) {
  var redirectUrl = req.session.referringUrl;
  console.log(redirectUrl);
  var userId = req.user._id;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var address = req.body.address;

  User.updateOne(
    { _id: userId },
    {
      $set: {
        latitude: latitude,
        longitude: longitude,
        address: address,
      },
    },
    function (err, result) {
      if (err) {
        console.log(err);
        req.flash("error", "Failed to update address.");
      } else {
        req.flash("success", "Address updated successfully.");
      }
      res.redirect(redirectUrl);
    }
  );
});

router.post("/edit-profile", isLoggedIn, function (req, res, next) {
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var mobilePhone = req.body.mobilePhone;
  var referringUrl = req.session.referringUrl;

  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      console.log(err);
      return res.redirect("/user/profile");
    }

    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      req.flash("error", "Email already in use.");
      return res.redirect("/user/profile#contact");
    }

    // Update the user information
    User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          firstname: firstName,
          lastname: lastName,
          mobilePhone: mobilePhone,
        },
      },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.redirect("/user/profile");
        }
        req.flash("success", "Successfully Updated Contact Detail.");
        if (referringUrl === "/checkout") {
          return res.redirect(referringUrl);
        } else {
          return res.redirect("/user/profile#contact");
        }
      }
    );
  });
});

router.post("/delete-account", isLoggedIn, function (req, res, next) {
  var userid = req.body.userid;
  console.log(userid);

  User.findByIdAndDelete(userid, function (err, user) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send("An error occurred while deleting the account.");
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }
    console.log("Deleted");
    return res.redirect("/"); // Redirect to a desired page after successful account deletion
  });
});

router.post("/reset-password", function (req, res, next) {
  var email = req.body.email;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;

  req.checkBody("email", "Invalid email").notEmpty().isEmail();
  req.checkBody("oldPassword", "Invalid old password").notEmpty();
  req
    .checkBody("newPassword", "Invalid password")
    .notEmpty()
    .isLength({ min: 4 });
  req
    .checkBody("confirmPassword", "Passwords do not match")
    .equals(newPassword);

  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/profile#password");
  }

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/user/profile#password");
    }

    // Check if the old password matches
    if (!user.validPassword(oldPassword)) {
      req.flash("error", "Invalid old password.");
      return res.redirect("/user/profile#password");
    }

    // Update user's password
    user.password = user.encryptPassword(newPassword);

    User.updateOne(
      { email: email },
      { password: user.password },
      function (err) {
        if (err) {
          return next(err);
        }
        req.flash("success", "Password reset successful.");
        res.redirect("/user/profile#password"); // Redirect to the login page after password reset
      }
    );
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
    if (req.session.referringUrl) {
      var oldUrl = req.session.referringUrl;
      req.session.referringUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/menu");
    }
  }
);

router.get("/signin", function (req, res, next) {
  var messages = req.flash("error");
  console.log(req.session.referringUrl);
  var cartData = req.session.cart;

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
      res.redirect("/menu");
    }
  }
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.referringUrl = req.url;
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
