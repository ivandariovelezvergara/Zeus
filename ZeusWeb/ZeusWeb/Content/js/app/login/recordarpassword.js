//validaciones
$(function () {
    // Validation
    $("#recuerda-form").validate({
        // Rules for form validation
        rules: {
            username: {
                required: true
            },
            username2: {
                required: true,
                equalTo:'#username'
            }
        },

        // Messages for form validation
        messages: {
            username: {
                required: 'Digite un usuario valido.'
            },
            username2: {
                required: 'Digite un usuario valido.',
                equalTo: 'Usuarios no coinciden.'
            }
        },

        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
});