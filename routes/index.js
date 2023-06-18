var express = require("express");
var Cart = require("../models/cart");

var Product = require("../models/product");
var Order = require("../models/order");

const stripe = require("stripe")(
  "sk_test_51MR6MPExAgqOVTCm0kkqWiINL1gFOP2X1V2EJJZEzTrMdrW3tsXodHr1p7jeXWm7K2oeKTiU56xnAwiFFlOVpu8D00JwVPq6vC"
);

var router = express.Router();
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
      totalPrice: cart.totalPrice,
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
    res.render("shop/product-view", { product: product });
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
    console.log(req.session.referringUrl);
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
    totalPrice: cart.totalPrice,
    cart: cart,
    user: req.user,
  });
});

router.get("/success", isLoggedIn, function (req, res, next) {
  req.session.cart = null;
  console.log(req.session.cart)
  res.render("shop/success")
})
router.get("/cancel", isLoggedIn, function (req, res, next) {
  res.render("shop/cancel")
})

const YOUR_DOMAIN = "http://localhost:3000";

router.post("/create-checkout-session", async (req, res) => {
  const cart = req.session.cart;
  const user = req.session.user;

  const totalprice = req.body.totalprice * 100;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalprice,
          product_data: {
            name: "Pye Boat Noodles",
            description: "Custom payment description",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });
  createOrder(session, user, cart);
  res.redirect(303, session.url);
});

const fulfillOrder = (session) => {
  const paymentId = session.id;

  Order.findOneAndUpdate(
    { paymentId: paymentId },
    { $set: { status: "paid" } },
    { new: true },
    (err, order) => {
      if (err) {
        console.log("Error fulfilling order:", err);
        return;
      }

      if (order) {
        console.log("Order fulfilled:", order);
      }
    }
  );
};

const createOrder = (session, user, cart) => {
  console.log('Creating order');
  const order = new Order({
    user: user,
    cart: cart,
    paymentId: session.id,
    status: 'awaiting payment',
    date: Date.now()
  });
  order.save(function (err, result) {
  });
};

const emailCustomerAboutFailedPayment = (session) => {
  const paymentId = session.id;

  Order.findOneAndUpdate(
    { paymentId: paymentId },
    { $set: { status: "payment failed" } },
    { new: true },
    (err, order) => {
      if (err) {
        console.log("Error fulfilling order:", err);
        return;
      }

      if (order) {
        console.log("Order fulfilled:", order);
      }
    }
  );
};

const endpointSecret =
  "whsec_3625c57a647dd4749ea2df8603f689c2d150ed0959939d3ea3a470e75b91a150";

router.use(express.json({ type: 'application/json' }));

router.post('/webhook', (request, response) => {

  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log('⚠️  Webhook signature verification failed.', err.message);
    return response.sendStatus(400);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log("waiting payment")
     
      if (session.payment_status === 'paid') {
        console.log("change payment status to paid")

        fulfillOrder(session);
      }

      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;
      console.log("change payment status to paid")

      fulfillOrder(session);

      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;

      emailCustomerAboutFailedPayment(session);

      break;
    }
  }
  response.status(200).end();
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
