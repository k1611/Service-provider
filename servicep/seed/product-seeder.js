var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'https://img.gawkerassets.com/img/18dn3tqzbasybjpg/ku-xlarge.jpg',
        title: 'Painting ',
        description: 'Awesome paint!!!!',
        price: 10
    }),
    new Product({
        imagePath: 'https://bab-assets1.babapi.ooo/img/othe/7273534/6a/4a/fidsdesirejnkit6sw1.jpg.de22726a4a.989x1000x951.jpg',
        title: 'Furniture',
        description: 'home design',
        price: 20
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}