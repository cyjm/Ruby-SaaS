/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-signup-btn');
    //Set Stripe public key.
    Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
    
    //When user clicks form submit btn
    submitBtn.click(function(event){
        
        //Prevent defauls submission behavior.
        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        
        //Collect the credit card fields.
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
        
        //Validate errors with the Stripe js library
        var error = false;
        
        //Validate card number
        if (!Stripe.card.validateCardNumber(ccNum)){
            error = true;
            alert('The credit card number appears to be invalid');
        }
        //Validate CVC
        if (!Stripe.card.validateCVC(cvcNum)){
            error = true;
            alert('The CVC number appears to be invalid');
        }
        //Validate expiry date
        if (!Stripe.card.validateExpiry(expMonth,expYear)){
            error = true;
            alert('The expiration date appears to be invalid');
        }
        
        if (error){
            //If card error exist, dont send to Stripe. Make submit btn available.
            submitBtn.prop('disabled', false).val("Sign Up");
        } else {
            //Send the card info to Stripe.
            Stripe.createToken({
            number: ccNum,
            cvc: cvcNum,
            exp_month: expMonth,
            exp_year: expYear
            }, stripeResponseHandler);   
        }
        return false;
    });
    
    function stripeResponseHandler(status, response){
        //Grab token from Stripe response
        var token = response.id;
        
        //Inject card token as hidden field into form.
        theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
        
        //Submit form to the rails app.
        theForm.get(0).submit();
    }
})
