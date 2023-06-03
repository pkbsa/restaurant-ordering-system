var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");

var fs = require("fs");

var Product = require("../models/product");
var Order = require("../models/order");

const axios = require("axios");
const FormData = require("form-data");

const { line_api } = require('../config/config');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("shop/index", {
    title: "Pye Boat Noodle",
    user: req.user,
  });
});

router.get("/menu", function (req, res, next) {
  req.session.referringUrl = req.originalUrl;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var successMsg = req.flash("success")[0];
  Product.find(function (err, docs) {
    var snacks = [];
    var rice = [];

    // Categorize the products into separate arrays
    docs.forEach(function (product) {
      if (product.category === "PYE SNACKS") {
        snacks.push(product);
      } else if (product.category === "PYE OVER RICE") {
        rice.push(product);
      }
    });

    res.render("shop/products", {
      title: "Shopping Cart",
      snacks: snacks,
      rice: rice,
      successMsg: successMsg || null,
      noMessages: !successMsg,
      user: req.user,
      totalPrice: cart.totalPrice
    });
  });
});

router.get("/menu/noodles", function (req, res, next) {
  req.session.referringUrl = req.originalUrl;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var successMsg = req.flash("success")[0];
  Product.find(function (err, docs) {
    var boat = [];
    var dry = [];

    // Categorize the products into separate arrays
    docs.forEach(function (product) {
      if (product.category === "PYE BOAT NOODLES") {
        boat.push(product);
      } else if (product.category === "PYE DRY NOODLES") {
        dry.push(product);
      }
    });

    res.render("shop/products-noodles", {
      title: "Shopping Cart",
      boat: boat,
      dry: dry,
      successMsg: successMsg || null,
      noMessages: !successMsg,
      totalPrice: cart.totalPrice,
      user: req.user,
    });
  });
});
router.get("/menu/vegetarian", function (req, res, next) {
  req.session.referringUrl = req.originalUrl;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var successMsg = req.flash("success")[0];
  Product.find(function (err, docs) {
    var snack = [];
    var noodle = [];

    // Categorize the products into separate arrays
    docs.forEach(function (product) {
      if (product.category === "J SNACKS") {
        snack.push(product);
      } else if (product.category === "JAE NOODLES") {
        noodle.push(product);
      }
    });

    res.render("shop/products-vegetarian", {
      title: "Shopping Cart",
      snack: snack,
      noodle: noodle,
      successMsg: successMsg || null,
      noMessages: !successMsg,
      totalPrice: cart.totalPrice,
      user: req.user,
    });
  });
});

router.get("/menu/drinks", function (req, res, next) {
  req.session.referringUrl = req.originalUrl;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var successMsg = req.flash("success")[0];
  Product.find(function (err, docs) {
    var drink = [];
    var desert = [];

    // Categorize the products into separate arrays
    docs.forEach(function (product) {
      if (product.category === "DRINK") {
        drink.push(product);
      } else if (product.category === "DESERT") {
        desert.push(product);
      }
    });

    res.render("shop/products-drinks", {
      title: "Shopping Cart",
      drink: drink,
      desert: desert,
      successMsg: successMsg || null,
      noMessages: !successMsg,
      totalPrice: cart.totalPrice,
      user: req.user,
    });
  });
});


router.get("/products/:id", function (req, res, next) {
  var productId = req.params.id;
  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/products");
    }
    res.render("shop/product-view", {product: product});
  });
});

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/menu");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    console.log(req.session.referringUrl)
    res.redirect(req.session.referringUrl || "/menu");
  });
});

router.get("/add-to-cart-product/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/products");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
  });
});

router.get("/addone-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/products");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    //console.log(req.session.cart);
    res.redirect("/shopping-cart");
  });
});

router.get("/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", function (req, res, next) {
  req.session.referringUrl = req.originalUrl;
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    cart: cart,
    user: req.user,
  });
});

router.get("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/checkout", {
    products: cart.generateArray(),
    total: cart.totalPrice,
    users: req.user,
 
  });
});

router.post("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);

  const cartArray = cart.generateArray();
  const itemsString = cartArray
    .map((item) => `${item.item.title} x ${item.qty} - ${item.price} บาท`)
    .join("\n");

  let sampleFile;
  let uploadFile;

  //console.log(req.files.sampleFile)
  sampleFile = req.files.sampleFile;
  uploadFile = "./public/Slip/" + sampleFile.name;

  sampleFile.mv(uploadFile);

  const today = new Date();
  const offset = -(today.getTimezoneOffset() / 60) + 7;
  const thaiDate = new Date(today.getTime() + offset * 60 * 60 * 1000);
  const date = thaiDate.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const time = thaiDate.toLocaleTimeString("th-TH", {
    hour: "numeric",
    minute: "numeric",
  });

  var curDate = `${date} - ${time}`;

  const address =
    req.body.address +
    " " +
    req.body.subdistrict +
    " " +
    req.body.district +
    " " +
    req.body.province +
    " " +
    req.body.zipcode;
  const fullname = req.body.firstname + " " + req.body.lastname;
  const paymentDate = req.body.date + " - " + req.body.time;

  var order = new Order({
    user: req.user,
    cart: cart,
    address: address,
    name: fullname,
    phone: req.body.phone,
    paymentId: sampleFile.name,
    paymentDate: paymentDate,
    paymentMethod: req.body.paymentMethod,
    status: "Pending",
    date: curDate,
  });

  if(line_api != "PASTE_YOUR_LINENOTIFY_TOKEN"){
    setTimeout(function () {
      var payload = `\nวันที่สั่ง : ${order.date}\n\n${itemsString}\n\nวันที่ชำระเงิน : ${order.paymentDate}\nวิธีการชำระเงิน : ${order.paymentMethod}\nจำนวน : ${order.cart.totalPrice}.00 บาท\n\nที่อยู่จัดส่ง\n${order.name}\n${order.address}`;

      const formData = new FormData();
      formData.append("imageFile", fs.createReadStream(uploadFile));
      formData.append("message", `${payload}`);
      formData.append(
        "access_token",
        line_api
      );
      axios
        .post("https://notify-api.line.me/api/notify", formData, {
          headers: {
            Authorization: `Bearer ${line_api}`,
          },
        })
        .then((response) => {
          //console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 8000);
  }

  order.save(function (err, result) {
    if (err) {
      console.log(err);
    }
    req.session.cart = null;
    res.redirect("/user/profile");
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.originalUrl;
  console.log(req.session.oldUrl);
  res.redirect("/user/signin");
}
