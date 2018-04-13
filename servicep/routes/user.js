var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
const bcrypt = require('bcryptjs');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var Mman = require('../models/mman');

// var csrfProtection = csrf();
// router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders });
    });
});
// router.get('/profile/update', function (req, res, next) {
//     res.render('user/profile', {csrfToken: req.csrfToken()});
// });
// router.post('/profile/update', isLoggedIn, function (req, res, next) {
//     User.findByID(req.user.id, function(err, user) {
//         if (!user) {
//             req.flash('error', 'No account found');
//             return res.redirect('/signin');
//         }
//        var email = reqbody.email.trim();
//        user.save(function (err) {

//         // todo: don't forget to handle err

//         res.redirect('/profile/');
//     });
//     });
// });
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
    res.render('user/signup');
});

router.post('/signup', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const add1 = req.body.add1;
    const pin = req.body.pin;


    let newEmployer = new User({
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


//update 
router.get('/update', function (req, res) {
    res.render('user/profile');
});

router.post('/update', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const add1 = req.body.add1;
    const pin = req.body.pin;

    let newEmployer = new User({
        name: name,
        email: email,
        contact: contact,
        add1: add1,
        pin: pin,
    });

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

// router.get('/signup', function (req, res, next) {
//     var messages = req.flash('error');
//     res.render('user/signup', { messages: messages, hasErrors: messages.length > 0});
// });

// router.post('/signup', passport.authenticate('user.local.signup', {
//     failureRedirect: '/user/signup',
//     failureFlash: true
// }), function (req, res, next) {
//     if (req.session.oldUrl) {
//         var oldUrl = req.session.oldUrl;
//         req.session.oldUrl = null;
//         res.redirect(oldUrl);
//     } else {
//         res.redirect('/user/profile');
//     }
// });
router.get('/update', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/profile', { messages: messages, hasErrors: messages.length > 0});
});

router.post('/update', passport.authenticate('user.local.update', {
    failureRedirect: '/user/profile',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});


router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('user.local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
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