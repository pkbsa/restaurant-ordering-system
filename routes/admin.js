var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");

var Product = require("../models/product");
var Order = require('../models/order');
var User = require('../models/user')

router.get("/", isAdmin, function (_, res) {
  Promise.all([
    Order.countDocuments({}),
    User.countDocuments({}),
    Product.countDocuments({}),
  ])
    .then(function (results) {
      Order.find(
        { paymentStatus: { $ne: "Awaiting Payment" } },
        null,
        { sort: { _id: -1 }, limit: 5 },
        function (err, orders) {
          if (err) {
            return res.status(500).send("Error!");
          }

          var cart;
          orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
          });
          res.render("admin/dashboard", {
            orders: orders,
            ordersLength: results[0],
            usersLength: results[1],
            productsLength: results[2],
            isadmin: 1,
          });
        }
      );
    })
    .catch(function (error) {
      res.status(500).send({ error: "Error getting collection length" });
    });
});

router.get("/orders", isAdmin, function (req, res, next) {
  Order.find( {paymentStatus: { $ne: "Awaiting Payment" }}, null, {sort: {_id: -1}}, function (err, orders){
      if (err) {
          return res.write('Error!')
        }
        var cart;
        orders.forEach(function(order){
          cart = new Cart(order.cart);
          order.items = cart.generateArray(); 
        })
        res.render("admin/orders",{orders: orders, isadmin: 1})
  });
});

router.get("/products", isAdmin, function (req, res, next) {
    Product.find( {}, function (err, products){
        if (err) {
            return res.write('Error!')
          }
        res.render("admin/products",{products: products, isadmin: 1})
    });
});

router.post('/edit-products', (req, res) => {
  const additionalChoices = [];
  console.log(req.body)
  // Iterate over the submitted form data
  for (const key in req.body) {
    if (key.startsWith('choiceTitle')) {
      const choiceIndex = key.substring('choiceTitle'.length);

      const choiceTitle = req.body[key];

      const choices = [];
      const prices = [];

      // Get the choices and prices for the current additional choice
      for (const subKey in req.body) {
        if (subKey.startsWith(`choice${choiceIndex}-`)) {
          const choiceNumber = subKey.substring(`choice${choiceIndex}-`.length);
          const choice = req.body[subKey];
          choices.push(choice);

          const price = Number(req.body[`price${choiceIndex}-${choiceNumber}`]);
          prices.push(price);
        }
      }

      // Create an object for the current additional choice
      const additionalChoice = {
        title: choiceTitle,
        choices: choices,
        prices: prices
      };

      additionalChoices.push(additionalChoice);
    }
  }

  console.log(additionalChoices);

  // Render the additionalChoices data in your desired format
  const formattedData = JSON.stringify(additionalChoices, null, 2);
  res.send(`<pre>${formattedData}</pre>`);
});

router.get("/users", isAdmin, function (req, res, next) {
  User.find( {}, function (err, users){
      if (err) {
          return res.write('Error!')
        }
      res.render("admin/users",{users: users, isadmin: 1})
  });
});

router.post("/admin-status", isAdmin, function (req, res, next) {
  User.findOne({ _id: req.body.userId }, function(err, user) {
    if (err) {
        return res.status(500).send({ error: "Error updating user status" });
    }
    if (!user) {
        return res.status(404).send({ error: "User not found" });
    }

    user.admin = req.body.status;

    user.save(function(err) {
        if (err) {
            return res.status(500).send({ error: "Error updating user status" });
        }
        res.redirect('/admin/users');
    });
  });

});

router.post("/order-edit", isAdmin, function (req, res, next) {
  console.log(req.body)
  Order.findOne({ _id: req.body._id }, function(err, order) {
    if (err) {
        return res.status(500).send({ error: "Error updating order status" });
    }
    if (!order) {
        return res.status(404).send({ error: "Order not found" });
    }
    order.status = req.body.status;
    order.save(function(err) {
        if (err) {
            return res.status(500).send({ error: "Error updating order status" });
        }
        res.redirect('/admin');
    });
  });
});

router.post("/product-edit", isAdmin, function (req, res, next) {
  console.log(req.body)
  Product.findOne({ _id: req.body._id }, function(err, product) {
    if (err) {
        return res.status(500).send({ error: "Error updating product status" });
    }
    if (!product) {
        return res.status(404).send({ error: "Order not found" });
    }

    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.status = req.body.status;

    product.save(function(err) {
        if (err) {
            return res.status(500).send({ error: "Error updating product status" });
        }
        res.redirect('/admin/products');
    });
  });
});

router.get("/delete-order/:id", isAdmin, function(req, res) {
  var orderId = req.params.id;
  Order.deleteOne({ _id: orderId }, function(err) {
      if (err) {
          return res.status(500).send({ error: "Error deleting order" });
      }
      res.redirect('/admin/orders');
  });
});

router.get("/delete-product/:id", isAdmin, function(req, res) {
  var productId = req.params.id;
  Product.deleteOne({ _id: productId }, function(err) {
      if (err) {
          return res.status(500).send({ error: "Error deleting product" });
      }
      res.redirect('/admin/products');
  });
});

router.get("/delete-user/:id", isAdmin, function(req, res) {
  var userId = req.params.id;
  User.deleteOne({ _id: userId }, function(err) {
      if (err) {
          return res.status(500).send({ error: "Error deleting users" });
      }
      res.redirect('/admin/users');
  });
});

router.post("/add-product/", isAdmin, function(req, res){
  console.log(req.body);
  let sampleFiles = req.files.sampleFile;

  if(!Array.isArray(sampleFiles)){
    sampleFiles = [sampleFiles];
  }

  let filePaths = [];
  sampleFiles.forEach(function(sampleFile) {
    let uploadFilename = "/products/" + sampleFile.name;
    //console.log(uploadFilename)
    let uploadFile = "./public/products/" + sampleFile.name;
    filePaths.push(uploadFilename);
    sampleFile.mv(uploadFile);
  });

  let product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    status: req.body.status,
    imagePath: filePaths
  });
  product.save(function(err) {
    if (err) {
      return res.status(500).send({ error: "Error saving product" });
    }
    res.redirect("/admin/products");
  });
});

module.exports = router;

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin === 1) {
    return next();
  }
  res.redirect("/user/signin");
}