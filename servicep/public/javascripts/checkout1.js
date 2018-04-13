var $form = $('#checkout-form');
var Order = require('../models/order');
$form.submit(function (event) {
    // $('#charge-error').addClass('hidden');
    // $form.find('button').prop('disabled', true);
    // Stripe.card.createToken({
    //     number: $('#card-number').val(),
    //     cvc: $('#card-cvc').val(),
    //     exp_month: $('#card-expiry-month').val(),
    //     exp_year: $('#card-expiry-year').val(),
    //     name: $('#card-name').val()
    // }, stripeResponseHandler);
    // return false;
    // var token = response.id;

    // // Insert the token into the form so it gets submitted to the server:
    // $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // // Submit the form:
    // $form.get(0).submit();
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
    });
    order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
    });
    console.log("store");
});