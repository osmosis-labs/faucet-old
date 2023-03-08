$(document).ready(function() {
    $('#faucet-form').submit(function(event) {
        event.preventDefault(); // prevent form from submitting normally

        var address = $('#address-input').val(); // get the address input value

        // show spinning wheel on submit button
        $('#faucet-form button[type="submit"]').html('<i class="fa fa-spinner fa-spin"></i> Request tokens');

        // send AJAX request to the server
        $.ajax({
            url: '/fund',
            data: { address: address },
            type: 'GET',
            beforeSend: function() {
                // disable submit button while request is being processed
                $('#faucet-form button[type="submit"]').prop('disabled', true);
            },
            success: function(response) {
                console.log(response);
                $('#success-alert').text(response.message).removeClass('d-none'); // show success alert with message
                $('#error-alert').addClass('d-none'); // hide error alert
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseJSON);
                var errorMessage = jqXHR.responseJSON.error.replace("400 Bad Request: ", "");
                $('#error-alert').text(errorMessage).removeClass('d-none'); // show error alert with message
                $('#success-alert').addClass('d-none'); // hide success alert
            },
            complete: function() {
                // re-enable submit button when request is complete
                $('#faucet-form button[type="submit"]').prop('disabled', false).html('Request tokens');
            }
        });
    });
});
