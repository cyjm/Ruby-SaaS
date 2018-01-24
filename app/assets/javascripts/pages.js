/* global $ */
// Modifications to the flash alerts
$(document).on('turbolinks:load', function(){
   $('.alert') .delay(4000).fadeOut(3000);
});