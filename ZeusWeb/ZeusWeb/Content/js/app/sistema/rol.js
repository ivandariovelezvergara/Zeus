//validaciones
$(function () {
    // Validation
    $("#crear-form").validate({
        // Rules for form validation
        rules: {
            nombre: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  un rol valido.'
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
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  un rol valido.'
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

    $scope.objetos = {
        rol: {
            activa: {},
            campos: [
                { nombre: 'nombre', label: 'nombre', cantidad: 10 }
            ],
            filtro: { cantidad: 10 },
            lista: [],
            crear: function () {
                if ($("#crear-form").valid()) {
                    $http.post('/Sistema/createrol', $scope.objetos.rol.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'rol creado correctamente.'
                               };
                               $scope.objetos.rol.activa = {};
                               $scope.objetos.rol.obtener();
                           }
                           else {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-danger',
                                   titulo: 'Error',
                                   mensaje: data.error
                               };
                           }
                       }).
                       error(function (data, status, headers, config) {
                           // called asynchronously if an error occurs
                           // or server returns response with an error status.
                           console.log(data);
                       });
                }
            },
            editar: false,
            editarEvent: function (obj) {

                $scope.objetos.rol.editar = true;
                $scope.objetos.rol.activa = obj;

            },
            actualizar: function () {
                if ($("#editar-form").valid()) {
                    $http.post('/Sistema/updaterol', $scope.objetos.rol.activa).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'rol actualizado correctamente.'
                              };
                              $scope.objetos.rol.activa = {};
                              $scope.objetos.rol.editar = false;
                              $scope.objetos.rol.obtener();

                          }
                          else {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-danger',
                                  titulo: 'Error',
                                  mensaje: data.error
                              };
                          }
                      }).
                      error(function (data, status, headers, config) {
                          // called asynchronously if an error occurs
                          // or server returns response with an error status.
                          console.log(data);
                      });
                }
            },
            actualizarEstado: function (obj) {

                $http.post('/Sistema/updateStaterol', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'rol actualizado correctamente.'
                              };

                              $scope.objetos.rol.obtener();
                          }
                          else {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-danger',
                                  titulo: 'Error',
                                  mensaje: data.error
                              };
                          }
                      }).
                      error(function (data, status, headers, config) {
                          // called asynchronously if an error occurs
                          // or server returns response with an error status.
                          console.log(data);
                      });

            },
            eliminar: function (obj) {
                if (confirm("Desea eliminar el rol " + obj.nombre)) {


                    $http.post('/Sistema/deleterol', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'rol eliminado correctamente.'
                            };
                            $scope.objetos.rol.obtener();
                        }
                        else {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-danger',
                                titulo: 'Error',
                                mensaje: data.error
                            };
                        }
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data);
                    });
                }

            },
            obtener: function () {

                $http.post('/Sistema/filtrarrol', $scope.objetos.rol.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

                           $scope.objetos.rol.lista = data.elementos;
                       }
                       else {
                           console.log(data);
                       }

                   }).
                   error(function (data, status, headers, config) {
                       // called asynchronously if an error occurs
                       // or server returns response with an error status.
                       console.log(data);
                   });
            }

        }
    };
    $scope.alerta = {
        estado: false,
        tipo: '',
        titulo: '',
        mensaje: ''

    };
    $scope.objetos.rol.obtener();

});



