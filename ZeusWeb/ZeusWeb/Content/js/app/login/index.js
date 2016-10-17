//validaciones
$(function () {
    // Validation
    $("#login-form").validate({
        // Rules for form validation
        rules: {
            username: {
                required: true
            },
            password: {
                required: true,
                minlength: 3,
                maxlength: 20
            }
        },

        // Messages for form validation
        messages: {
            username: {
                required: 'Digite un usuario valido.'
            },
            password: {
                required: 'Ingrese una contraseña valida.',
                minlength: 'Contraseña muy corta.',
                maxlength:'Contraseña muy larga.'
            }
        },

        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
});