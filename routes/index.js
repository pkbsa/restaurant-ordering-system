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
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

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

router.get("/order/:id", function (req, res, next) {
  Order.findOne({ _id: req.params.id }, function (err, order) {
    if (err) {
      return res.redirect("/");
    }

    if (!order) {
      return res.redirect("/");
    }

    res.render("user/order", {
      order: order,
      user: req.user,
    });
  });
});

router.post("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/menu");
    }
    var additionalChoices = [];
    for (var key in req.body) {
      if (key.startsWith("additionalChoice")) {
        additionalChoices.push(req.body[key]);
      }
    }
    var price = req.body.price;
    console.log(price);
    var additionalChoicesString = additionalChoices.join(", ");
    var additionalNote = req.body.additionalNote;

    cart.add(
      product,
      product.id,
      price,
      additionalChoicesString,
      additionalNote,
      function () {
        req.session.cart = cart;
        console.log("refering url: " + req.session.referringUrl);
        req.session.save(function (err) {
          res.redirect(req.session.referringUrl);
        });
      }
    );
  });
});

router.post("/addone-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  let additionalChoices = req.body.additionalChoices;
  let additionalNote = req.body.additionalNote;
  let price = parseFloat(req.body.price) / parseFloat(req.body.qty);
  console.log(price);

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/products");
    }
    cart.add(
      product,
      product.id,
      price,
      additionalChoices,
      additionalNote,
      function () {
        req.session.cart = cart;
        req.session.save(function (err) {
          res.redirect("/shopping-cart?cache=" + Date.now());
        });
      }
    );
  });
});

router.get("/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId, function () {
    console.log(cart);
    req.session.cart = cart;
    req.session.save(function (err) {
      res.redirect("/shopping-cart?cache=" + Date.now());
    });
  });
});

router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId, function () {
    req.session.cart = cart;
    req.session.save(function (err) {
      res.redirect("/shopping-cart?cache=" + Date.now());
    });
  });
});

router.get("/shopping-cart", function (req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

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
  console.log(req.session.cart);
  res.render("shop/success");
});
router.get("/cancel", isLoggedIn, function (req, res, next) {
  res.render("shop/cancel");
});

const YOUR_DOMAIN = "http://localhost:3000";

router.post("/create-checkout-session", async (req, res) => {
  const cart = req.session.cart;
  const user = req.user;

  const lineItems = [];

  // Convert cart items into line items
  for (const itemId in cart.items) {
    const cartItem = cart.items[itemId];
    const { item, qty } = cartItem;
    const price = cartItem.onePrice;

    const lineItem = {
      price_data: {
        currency: "usd",
        unit_amount_decimal: price * 100,
        product_data: {
          name: item.title,
          description: item.description,
        },
      },
      quantity: qty,
    };

    lineItems.push(lineItem);
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems, // Use the converted line items
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
    { $set: { paymentStatus: "Paid" } },
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
  var currentDate = new Date();
  var timezoneOffset = -420;
  currentDate.setMinutes(currentDate.getMinutes() + timezoneOffset);
  var formattedDate = currentDate.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  console.log("Creating order");

  var deliveryName = user.firstname +" "+user.lastname;
  var deliveryAddress = user.address;
  var deliveryUrl = `http://maps.google.com/maps?z=12&t=m&q=loc:${user.latitude}+${user.longitude}`;
  var deliveryContact = user.mobilePhone;
  
  const order = new Order({
    user: user,
    cart: cart,
    deliveryName: deliveryName,
    deliveryAddress: deliveryAddress, 
    deliveryUrl: deliveryUrl,
    deliveryContact: deliveryContact,
    paymentId: session.id,
    paymentStatus: "Awaiting Payment",
    orderStatus: "Order Received",
    date: formattedDate,
  });
  order.save(function (err, result) {});
};

const emailCustomerAboutFailedPayment = (session) => {
  const paymentId = session.id;

  Order.findOneAndUpdate(
    { paymentId: paymentId },
    { $set: { paymentStatus: "payment failed" } },
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

const removeOrder = async (session) => {
  try {
    // Retrieve the order based on the session
    const order = await Order.findOne({ paymentId: session.id });

    if (order) {
      // Remove the order from the database
      await Order.findByIdAndRemove(order._id);
      console.log("Order removed:", order);
    } else {
      console.log("Order not found:", session.id);
    }
  } catch (err) {
    console.log("Error removing order:", err);
  }
};

const endpointSecret =
  "whsec_3625c57a647dd4749ea2df8603f689c2d150ed0959939d3ea3a470e75b91a150";

router.use(express.json({ type: "application/json" }));

router.post("/webhook", async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.log("⚠️  Webhook signature verification failed.", err.message);
    return response.sendStatus(400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("waiting payment");

      if (session.payment_status === "paid") {
        console.log("Change payment status to paid");
        fulfillOrder(session);
      } else {
        console.log("Order is still waiting for payment. Removing order...");
        await removeOrder(session);
      }

      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      console.log("change payment status to paid");

      fulfillOrder(session);

      break;
    }

    case "checkout.session.async_payment_failed": {
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
