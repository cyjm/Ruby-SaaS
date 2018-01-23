/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-submit-btn');
    //Set Stripe public key.
    Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
    
    //When user clicks form submit btn
    submitBtn.click(function(event){
        
        //prevent defauls submission behavior.
        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        
        //Collect the credit card fields.
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
        
        //Use stirpe js lib to check for card errors
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
            //If card error exist, dont send to stripe. Make submit btn available.
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
    
    //Stripe will return the card token.
    function stripeResponseHandler(status, response){
        var token = response.id;
        
        //Inject card token as hidden field into form.
        theForm.append($('<input type="hidden" name="user[stirpe_card_token]">').val(token));
        
        //Submit form to the rails app.
        theForm.get(0).submit();
    }
})
