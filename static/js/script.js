$(document).ready(function () {

    $('#faucet-form').submit(function (event) {
        // prevent form from submitting normally
        event.preventDefault();

        // clear alert messages
        $('#success-alert, #error-alert').addClass('d-none').text('');

        // get the address input value
        var address = $('#address-input').val();

        // validate address
        if (!is_valid_osmosis_address(address)) {
            $('#error-alert').text('Invalid Osmosis address').removeClass('d-none').addClass('animate__animated animate__shakeX');
            return;
        }

        // show spinning wheel on submit button
        $('#faucet-form button[type="submit"]').html('<i class="fa fa-spinner fa-spin"></i> Request tokens');

        // send AJAX request to the server
        $.ajax({
            url: '/fund',
            data: { address: address },
            type: 'GET',
            beforeSend: function () {
                // disable submit button while request is being processed
                $('#faucet-form button[type="submit"]').prop('disabled', true);
            },
            success: function (response) {
                // show success alert with message
                $('#success-alert').text(response.message).removeClass('d-none').addClass('animate__animated animate__bounceIn');
                // hide error alert
                $('#error-alert').addClass('d-none'); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var errorMessage = jqXHR.responseJSON.error.replace("400 Bad Request: ", "");
                // show error alert with message
                $('#error-alert').text(errorMessage).removeClass('d-none').addClass('animate__animated animate__shakeX'); 
                // hide success alert
                $('#success-alert').addClass('d-none');
            },
            complete: function () {
                // re-enable submit button when request is complete
                $('#faucet-form button[type="submit"]').prop('disabled', false).html('Request tokens');
            }
        });
    });

    // add the animation classes again on focusout event
    $('#address-input').focusout(function () {
        $('#error-alert').removeClass('animate__animated animate__shakeX');
    });
});

// Simple validation function to check if the address is valid
function is_valid_osmosis_address(address) {
    if (address.length !== 43 || !address.startsWith("osmo")) {
        return false;
    }

    var alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    for (var i = 4; i < 43; i++) {
        if (!alphabet.includes(address.charAt(i))) {
            return false;
        }
    }
    return true;
}
