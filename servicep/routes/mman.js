var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var sess;
const bcrypt = require('bcryptjs');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var Mman = require('../models/mman');

// var csrfProtection = csrf();
// router.use(csrfProtection);

// router.get('/profile', function (req, res) {
//     sess = req.session;
//     if (!sess.emp_id) {

//        // sess.emp_id = req.user._id;
//         console.log('Employer id : ' + sess.emp_id);
//     }
//     else {
//         console.log(' Existing Employer id : ' + sess.emp_id);
//     }
    
//     res.render('mman/profile');
// });

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({mman: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('mman/profile', { orders: orders ,layout: false});
    });
});
// router.post('/profile', isLoggedIn, function (req, res, next) {
//     user: req.user
// });
router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res) {
    res.render('mman/signup',{layout: false});
});

router.post('/signup', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const add1 = req.body.add1;
    const pin = req.body.pin;


    let newEmployer = new Mman({
        name: name,
        email: email,
        password: password,
        contact: contact,
        add1: add1,
        pin: pin,
    });

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newEmployer.password, salt, function (err, hash) {
            if (err)
                console.log(err);
            newEmployer.password = hash;
            newEmployer.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    res.redirect('/');
                }
            });
        });
    });
});




// router.get('/signup', function (req, res, next) {
//     var messages = req.flash('error');
//     res.render('mman/signup', { messages: messages, hasErrors: messages.length > 0});
// });

// router.post('/signup', passport.authenticate('mman.local.signup', {
//     failureRedirect: '/mman/signup',
//     failureFlash: true
// }), function (req, res, next) {
//     if (req.session.oldUrl) {
//         var oldUrl1 = req.session.oldUrl;
//         req.session.oldUrl = null;
//         res.redirect(oldUrl1);
//     } else {
//         res.redirect('/mman/profile');
//     }
// });

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('mman/signin', { messages: messages, hasErrors: messages.length > 0,layout: false});
});

router.post('/signin', passport.authenticate('mman.local.signin', {
    failureRedirect: '/mman/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        console.log("redirect");

        res.redirect('/mman/profile');
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}