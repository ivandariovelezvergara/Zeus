//validaciones
$(function () {
    // Validation
    $("#form").validate({
        // Rules for form validation
        rules: {
            passold: {
                required: true
            },
            passnew: {
                required: true
            },
            passnew2: {
                required: true,
                equalTo: '#passnew'
            }
        },

        // Messages for form validation
        messages: {
            passold: {
                required: 'Ingresa  una contraseña valida.'
            },
            passnew: {
                required: 'Ingresa  una contraseña valida.'
            },
            passnew2: {
                required: 'Ingresa  una contraseña valida.',
                equalTo: 'Contraseñas no coinciden.'
            }
        },

        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
});