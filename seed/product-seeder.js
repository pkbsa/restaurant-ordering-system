var Product = require('../models/product')
var mongoose = require('mongoose');

const { mongodb_url } = require('../config/config.js');
mongoose.connect("mongodb+srv://admin:1234@cluster0.avu5zrm.mongodb.net/?retryWrites=true&w=majority")

var products = [
    new Product({
        imagePath: ['/products/img1.png'],
        title: 'Dumplings',
        description: 'Minced shrimp, pork and Jicama with sweet soy dipping.',
        price: 6.5,
        category: "PYE SNACKS",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img2.png'],
        title: 'Taro Rolls',
        description: 'Taro, glass noodle, and cabbage',
        price: 5.5,
        category: "PYE SNACKS",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img3.png'],
        title: 'Fried Pork Strips',
        description: 'Strips of marinated pork shoulder butt',
        price: 11.5,
        category: "PYE SNACKS",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img4.png'],
        title: 'Salted Chicken Wings',
        description: '(aka tiny wings) Fried marinated split half mid-wings',
        price: 11,
        category: "PYE SNACKS",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img5.png'],
        title: 'Pad Gra Pow',
        description: '(Medium spicy) Sauteed jalapeno with basil and long bean (slice or ground meat)',
        price: 14,
        category: "PYE OVER RICE",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img6.png'],
        title: 'Gra Tiem',
        description: 'Pan Fried choice of meat with garlic and pepper (DRY)',
        price: 14,
        category: "PYE OVER RICE",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img7.png'],
        title: 'Fried Tofu',
        description: 'Fried tofu served with sweet chili sauce and crushed peanuts',
        price: 6.5,
        category: "PYE VEGETARIAN DISHES",
        status: "Available"
    }),
]

var done = 0;
for(var i=0; i<products.length;i++){
    products[i].save(function(err, result){
        done++;
        if (done == products.length){
            exitsave();
        }
    });
}

function exitsave(){
    mongoose.disconnect();
}
