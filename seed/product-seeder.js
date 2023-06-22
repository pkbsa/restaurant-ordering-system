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
        status: "Available",
        additionalChoices: [
            {
                title: 'Additional Choice 1',
                choices: ['A', 'B', 'C'],
                prices: [1, 2, 3]
            },
            {
                title: 'Additional Choice 2',
                choices: ['X', 'Y', 'Z'],
                prices: [4, 5, 6]
            }
        ]
    }),
    new Product({
        imagePath: ['/products/img2.png'],
        title: 'Taro Rolls',
        description: 'Taro, glass noodle, and cabbage',
        price: 5.5,
        category: "PYE SNACKS",
        status: "Available",
        additionalChoices: [
            {
                title: 'Additional Choice 1',
                choices: ['A', 'B', 'C'],
                prices: [1, 2, 3]
            },
        ]
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
        imagePath: ['/products/img11.png'],
        title: 'Boat Noodles with Pork',
        description: 'Fresh pork blood broth with soy and anise, bean sprout,slice pork, pork meat ball top with celery and pork rind',
        price: 14.5,
        category: "PYE BOAT NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img12.png'],
        title: 'Boat Noodles with Pork',
        description: 'Fresh beef blood broth with soy and anise, bean sprout, slice beef, beef meat ball top with celery and pork rind',
        price: 14.5,
        category: "PYE BOAT NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img13.png'],
        title: 'Tom Yum Bolarn Noodles',
        description: 'Chicken and soy broth with lime juice, bean sprout, mince pork, fish cake, shrimp meat ball and fish meat ball top with cilantro and scallion (medium spicy)',
        price: 14.5,
        category: "PYE BOAT NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img14.png'],
        title: 'Yen Ta Fo Noodles',
        description: 'Chicken, soy broth with red bean paste, morning glory,shrimp,squid,white fungus,fish cake,shrimp meat ball and fish meat ball top with cilantro and scallion',
        price: 14.5,
        category: "PYE BOAT NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img15.png'],
        title: 'Pad Kee Mao',
        description: 'Sauteed wide ribbon noodles with Thai herbs, chili and mixed vegetables (spicy!!!) (Real Thai style kee mao!!!)',
        price: 14.5,
        category: "PYE DRY NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img16.png'],
        title: 'Pad See Ew',
        description: 'Sauteed wide ribbon noodles,egg with Chinese broccoli in sweet black soy sauce.',
        price: 14.5,
        category: "PYE DRY NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img17.png'],
        title: 'Fried Tofu',
        description: 'Fried tofu served with sweet chili sauce and crushed peanuts.',
        price: 6.5,
        category: "J SNACKS",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img18.png'],
        title: 'Taro Rolls',
        description: 'Taro rolls served with sweet chili sauce.',
        price: 5.5,
        category: "J SNACKS",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img19.png'],
        title: 'Jae Noodle Soup',
        description: 'Noodle soup in vegetable broth with Seitan and shitake mushrooms top with cilantro and scallion.',
        price: 14,
        category: "JAE NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img20.png'],
        title: 'Tom Yum Jae',
        description: 'Spicy and sour broth with Seitan and shitake mushrooms crushed peanuts top with cilantro and scallion.',
        price: 14,
        category: "JAE NOODLES",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img21.png'],
        title: 'Watermelon frozen',
        description: ' ',
        price: 7,
        category: "DRINK",
        status: "Available"
    }),
    new Product({
        imagePath: ['/products/img22.png'],
        title: 'Nam Keng Sai',
        description: 'Shaved iced with mixed tropical fruits Choice of sweet red syrup and condense milk OR coconut milk infused with palm sugar',
        price: 10,
        category: "DESERT",
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
