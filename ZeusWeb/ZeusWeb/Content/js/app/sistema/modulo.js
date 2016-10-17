//validaciones
$(function () {
    // Validation
    $("#crear-form").validate({
        // Rules for form validation
        rules: {
            nombre: {
                required: true
            },
            icono: {
                required: true
            },
            grupo: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  un modulo valido.'
            }, icono: {
                required: 'Ingresa  un icono valido.'
            },
            grupo: {
                required: 'Selecciona  un Modulo valido.'
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
            icono: {
                required: true
            },
            grupo: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  un modulo valido.'
            }, icono: {
                required: 'Ingresa  un icono valido.'
            },
            grupo: {
                required: 'Selecciona  un Modulo valido.'
            }
        },

 
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
});

var app = angular.module('appArchivo', []);

app.controller('appArchivoCtrl', function ($scope, $http) {

    $scope.objetos = {
        modulo: {
            activa: {},
            temp:{},
            campos: [
                { nombre: 'nombre', label: 'NOMBRE', cantidad: 10 },
                { nombre: 'icono', label: 'ICONO', cantidad: 10 }
             
            ],
            filtro: { cantidad: 10 },
            lista: [],
            crear: function () {
                if ($("#crear-form").valid()) {
                    $http.post('/Sistema/createmodulo', $scope.objetos.modulo.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Modulo creado correctamente.'
                               };
                               $scope.objetos.modulo.activa = {};
                               $scope.objetos.modulo.obtener();
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

                $scope.objetos.modulo.editar = true;
                $scope.objetos.modulo.temp = obj;

            },
            actualizar: function () {
                if ($("#editar-form").valid()) {
                    $http.post('/Sistema/updatemodulo', $scope.objetos.modulo.temp).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Modulo actualizado correctamente.'
                              };
                              $scope.objetos.modulo.temp = {};
                              $scope.objetos.modulo.editar = false;
                              $scope.objetos.modulo.obtener();

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

                $http.post('/Sistema/updateStatemodulo', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Modulo actualizado correctamente.'
                              };

                              $scope.objetos.modulo.obtener();
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
                if (confirm("Desea eliminar el modulo " + obj.nombre)) {


                    $http.post('/Sistema/deletemodulo', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'Modulo eliminado correctamente.'
                            };
                            $scope.objetos.modulo.obtener();
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

                $http.post('/Sistema/filtrarmodulo', $scope.objetos.modulo.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

                           $scope.objetos.modulo.lista = data.elementos;
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

        },
        grupomodulo: {
            activa: {},
            filtro: { cantidad: 100 },
            lista: [],
            obtener: function () {

                $http.post('/Sistema/filtrargrupomodulo', $scope.objetos.grupomodulo.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

                           $scope.objetos.grupomodulo.lista = data.elementos;
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
    $scope.objetos.modulo.obtener();
    $scope.objetos.grupomodulo.obtener();

});



