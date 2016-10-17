//validaciones
$(function () {
    // Validation
    $("#crear-form").validate({
        // Rules for form validation
        rules: {
            username: {
                required: true
            },
            nombre: {
                required: true
            },
            correo: {
                required: true,
                email:true
            }
        },

        // Messages for form validation
        messages: {
            username: {
                required: 'Ingresa  un usuario valido.'
            },
            nombre: {
                required: 'Ingresa  el nombre completo.'
            },
            correo: {
                required: 'Ingrese un correo valido.',
                email: 'Ingrese un correo valido.'
            }
        },

        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    $("#editar-form").validate({
        // Rules for form validation
        rules: {
            nombre: {
                required: true
            },
            correo: {
                required: true,
                email: true
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  el nombre completo.'
            },
            correo: {
                required: 'Ingrese un correo valido.',
                email: 'Ingrese un correo valido.'
            }
        },

        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
});

var app = angular.module('appArchivo', []);

app.controller('appArchivoCtrl', function ($scope, $http) {
    
    $scope.usuarios = {
        campos: [
            { nombre: 'username', label: 'USERNAME' },
            { nombre: 'nombre', label: 'NOMBRE' },
            { nombre: 'correo', label: 'CORREO ELECTRONICO' },
        ],
        datos: [],
        filtro: {},
        top: 20,
        editar: false,
        editable: {}
    };
    $scope.usuario = {};
    $scope.alerta = {};

    $scope.limpiarMensajeAlerta = function ()
    {
        //mensaje de alerta
        $scope.alerta = {
            estado: false,
            tipo: '',
            titulo: '',
            mensaje: ''
        };
    }

  

    $scope.crearUsuario = function () {
        $scope.limpiarMensajeAlerta();
        if ($("#crear-form").valid())
        {
           $http.post('/Sistema/createUsuario', $scope.usuario).
           success(function (data, status, headers, config) {
               // this callback will be called asynchronously
               // when the response is available

               $scope.actualizarUsuarios();
               $scope.usuario = {};
               $scope.alerta = {
                   estado: true,
                   tipo: 'alert-success',
                   titulo: 'Realizado',
                   mensaje: 'Usuario creado correctamente.'
               };
           }).
           error(function (data, status, headers, config) {
               // called asynchronously if an error occurs
               // or server returns response with an error status.
               $scope.alertaCarpeta = {
                   estado: true,
                   tipo: 'alert-error',
                   titulo: 'Error',
                   mensaje: data
               };
           });
        }
    }
    $scope.editar = function (obj) {
        $scope.usuarios.editar = true;
        $scope.usuarios.editable = obj;
      
    }
    
    $scope.actualizarUsuarios = function ()
    {
        $scope.limpiarMensajeAlerta();
        $http.post('/Sistema/filtrarUsuarios', {top:$scope.usuarios.top,filtro:$scope.usuarios.filtro}).
          success(function (data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available

              if (data.estado) {
     
                  $scope.usuarios.datos = data.elementos;
              }
              else
              {
                  console.log(data);
              }
          }).
          error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(data);
          });
    }
    $scope.actualizarUsuario = function ()
    {
        if ($("#editar-form").valid()) {
            $scope.limpiarMensajeAlerta();
            $http.post('/Sistema/updateUsuario', $scope.usuarios.editable).
               success(function (data, status, headers, config) {
                   // this callback will be called asynchronously
                   // when the response is available

                   $scope.actualizarUsuarios();
                   $scope.usuarios.editar = false;
                   $scope.usuario = {};
                   $scope.alerta = {
                       estado: true,
                       tipo: 'alert-success',
                       titulo: 'Realizado',
                       mensaje: 'Usuario actualizado correctamente.'
                   };
               }).
               error(function (data, status, headers, config) {
                   // called asynchronously if an error occurs
                   // or server returns response with an error status.
                   $scope.alertaCarpeta = {
                       estado: true,
                       tipo: 'alert-error',
                       titulo: 'Error',
                       mensaje: data
                   };
               });
        }
    }
    $scope.actualizarEstadoUsuario = function (obj) {
        $http.post('/Sistema/updateStateUsuario', obj).
           success(function (data, status, headers, config) {
               // this callback will be called asynchronously
               // when the response is available

               $scope.actualizarUsuarios();
              
               $scope.alerta = {
                   estado: true,
                   tipo: 'alert-success',
                   titulo: 'Realizado',
                   mensaje: 'Usuario cambio de estado correctamente.'
               };
           }).
           error(function (data, status, headers, config) {
               // called asynchronously if an error occurs
               // or server returns response with an error status.
               $scope.alertaCarpeta = {
                   estado: true,
                   tipo: 'alert-error',
                   titulo: 'Error',
                   mensaje: data
               };
           });
    }
    $scope.eliminarUsuario = function (obj) {
        $scope.limpiarMensajeAlerta();
        if (confirm("Desea eliminar el usuario " + obj.nombre))
        {
            $http.post('/Sistema/deleteUsuario', obj).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           $scope.actualizarUsuarios();

                           $scope.alerta = {
                               estado: true,
                               tipo: 'alert-success',
                               titulo: 'Realizado',
                               mensaje: 'Usuario eliminado correctamente.'
                           };
                       }).
                       error(function (data, status, headers, config) {
                           // called asynchronously if an error occurs
                           // or server returns response with an error status.
                           $scope.alertaCarpeta = {
                               estado: true,
                               tipo: 'alert-error',
                               titulo: 'Error',
                               mensaje: data
                           };
                       });
        }
        
    }
    
    $scope.actualizarUsuarios();
    $scope.limpiarMensajeAlerta();
});



