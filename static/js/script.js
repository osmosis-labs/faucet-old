$(document).ready(function() {
    $('#request-form').on('submit', function(e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            url: '/fund',
            type: 'POST',
            data: formData,
            success: function(response) {
                $('#address-input').val('');
                $('#success-alert').removeClass('d-none');
                $('#error-alert').addClass('d-none');
            },
            error: function(xhr, status, error) {
                $('#error-alert').removeClass('d-none');
                $('#success-alert').addClass('d-none');
            }
        });
    });
});
