var express = require("express");
var router = express.Router();

var Cart = require("../models/cart");
var Product = require("../models/product");
var Order = require("../models/order");
var User = require("../models/user");
const Store = require('../models/store');

router.get('/', isAdmin, function(_, res) {
  
  Promise.all([
    Order.countDocuments({}),
    User.countDocuments({}),
    Product.countDocuments({})
  ])
    .then(function(results) {
      Order.find(
        { paymentStatus: { $ne: 'Awaiting Payment' } },
        null,
        { sort: { _id: -1 }, limit: 5 },
        function(err, orders) {
          if (err) {
            return res.status(500).send('Error!');
          }

          var cart;
          orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
          });

          // Fetch the Store data from the database
          Store.findOne({}, function(err, store) {
            if (err) {
              console.log('Error fetching store data:', err);
              res.render('admin/dashboard', {
                orders: orders,
                ordersLength: results[0],
                usersLength: results[1],
                productsLength: results[2],
                isadmin: 1,
                store: null // Pass null if store data is not found
              });
            } else {
              res.render('admin/dashboard', {
                orders: orders,
                ordersLength: results[0],
                usersLength: results[1],
                productsLength: results[2],
                isadmin: 1,
                store: store // Pass the store data to the view
              });
            }
          });
        }
      );
    })
    .catch(function(error) {
      res.status(500).send({ error: 'Error getting collection length' });
    });
});

router.post("/store-status", isAdmin, function (req, res, next) {
  Store.findOne({}, function (err, store) {
    if (err) {
      return res.status(500).send({ error: "Error updating store status" });
    }
    if (!store) {
      return res.status(404).send({ error: "Store not found" });
    }

    store.status = req.body.newStatus;

    store.save(function (err) {
      if (err) {
        return res.status(500).send({ error: "Error updating store status" });
      }
      res.redirect("/admin");
    });
  });
});

router.get("/orders", isAdmin, function (req, res, next) {
  Order.find(
    { paymentStatus: { $ne: "Awaiting Payment" } },
    null,
    { sort: { _id: -1 } },
    function (err, orders) {
      if (err) {
        return res.write("Error!");
      }

      var notconfirmedOrder = orders.filter(function (order) {
        return order.orderStatus === "Not-Confirmed";
      });

      var confirmedOrder = orders.filter(function (order) {
        return order.orderStatus === "Confirmed";
      });

      var cancelledOrder = orders.filter(function (order) {
        return order.orderStatus === "Cancelled";
      });

      

      var cart;
      orders.forEach(function (order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });

      res.render("admin/orders", {
        orders: orders,
        notconfirmedOrder: notconfirmedOrder,
        confirmedOrder: confirmedOrder,
        cancelledOrder: cancelledOrder,
        isadmin: 1
      });
    }
  );
});

router.get("/order/:id", isAdmin, function (req, res, next) {

  Order.findOne({ _id: req.params.id }, function (err, order) {
    if (err) {
      return res.redirect("/");
    }

    if (!order) {
      return res.redirect("/");
    }
    console.log(order.cart)

    res.render("admin/order-confirm", {
      order: order,
      user: req.user,
      isadmin: 1  
    });
  });
});

router.post("/order-status", isAdmin, function (req, res, next) {
  Order.findOne({ _id: req.body._id }, function (err, order) {
    if (err) {
      console.log(err)
      return res.status(500).send({ error: "Error updating order status" });
    }
    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    order.orderStatus = req.body.status;
    order.orderEta = req.body.eta;

    order.save(function (err) {
      if (err) {
        return res.status(500).send({ error: "Error updating order status" });
      }
      res.redirect("/admin/orders");
    });
  });
});


router.get("/products", isAdmin, function (req, res, next) {
  Product.find({}, function (err, products) {
    if (err) {
      return res.write("Error!");
    }
    res.render("admin/products", { products: products, isadmin: 1 });
  });
});

router.post("/edit-products", isAdmin, function (req, res, next) {
  console.log(req.body.additionalChoices);
  var additionalChoice = req.body.additionalChoices; // Assuming req.body.additionalChoice contains the input array as a string

  // Parse additionalChoice into an array
  var additionalChoiceArray = JSON.parse(additionalChoice);

  var transformedChoices = additionalChoiceArray.map(function (item, index) {
    return {
      title: item.title,
      choices: item.choices,
      prices: item.prices,
    };
  });

  console.log(transformedChoices);

  Product.findOne({ _id: req.body._id }, function (err, product) {
    if (err) {
      return res.status(500).send({ error: "Error updating product status" });
    }
    if (!product) {
      return res.status(404).send({ error: "Order not found" });
    }

    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.category = req.body.category;
    product.additionalChoices = transformedChoices

    product.save(function (err) {
      if (err) {
        return res.status(500).send({ error: "Error updating product status" });
      }
      res.redirect("/admin/products");
    });
  });
});

router.get("/delete-product/:id", isAdmin, function (req, res) {
  var productId = req.params.id;
  Product.deleteOne({ _id: productId }, function (err) {
    if (err) {
      return res.status(500).send({ error: "Error deleting product" });
    }
    res.redirect("/admin/products");
  });
});

router.post("/add-product/", isAdmin, function (req, res) {
  let sampleFiles = req.files.sampleFile;

  if (!Array.isArray(sampleFiles)) {
    sampleFiles = [sampleFiles];
  }

  let filePaths = [];
  sampleFiles.forEach(function (sampleFile) {
    let uploadFilename = "/products/" + sampleFile.name;
    //console.log(uploadFilename)
    let uploadFile = "./public/products/" + sampleFile.name;
    filePaths.push(uploadFilename);
    sampleFile.mv(uploadFile);
  });

  var additionalChoice = req.body.additionalChoices;

  var additionalChoiceArray = JSON.parse(additionalChoice);

  var transformedChoices = additionalChoiceArray.map(function (item, index) {
    return {
      title: item.title,
      choices: item.choices,
      prices: item.prices,
    };
  });

  let product = new Product({
    imagePath: filePaths,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    status: req.body.status,
    additionalChoices: transformedChoices,
  });
  product.save(function (err) {
    if (err) {
      return res.status(500).send({ error: "Error saving product" });
    }
    res.redirect("/admin/products");
  });
});

router.post("/product-status", isAdmin, function (req, res, next) {
  Product.findOne({ _id: req.body._id }, function (err, product) {
    if (err) {
      return res.status(500).send({ error: "Error updating product status" });
    }
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    product.status = req.body.status;

    product.save(function (err) {
      if (err) {
        return res.status(500).send({ error: "Error updating product status" });
      }
      res.redirect("/admin/products");
    });
  });
});

router.get("/users", isAdmin, function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      return res.write("Error!");
    }
    res.render("admin/users", { users: users, isadmin: 1 });
  });
});

router.post("/admin-status", isAdmin, function (req, res, next) {
  User.findOne({ _id: req.body.userId }, function (err, user) {
    if (err) {
      return res.status(500).send({ error: "Error updating user status" });
    }
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.admin = req.body.status;

    user.save(function (err) {
      if (err) {
        return res.status(500).send({ error: "Error updating user status" });
      }
      res.redirect("/admin/users");
    });
  });
});

router.get("/delete-user/:id", isAdmin, function (req, res) {
  var userId = req.params.id;
  User.deleteOne({ _id: userId }, function (err) {
    if (err) {
      return res.status(500).send({ error: "Error deleting users" });
    }
    res.redirect("/admin/users");
  });
});


module.exports = router;

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin === 1) {
    return next();
  }
  res.redirect("/user/signin");
}
