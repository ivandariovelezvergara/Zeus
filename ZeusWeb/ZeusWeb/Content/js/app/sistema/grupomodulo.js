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
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  un grupo del modulo valido.'
            }, icono: {
                required: 'Ingresa  un icono valido.'
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
            }
        },

        // Messages for form validation
        messages: {
            nombre: {
                required: 'Ingresa  un grupo del modulo valido.'
            }, icono: {
                required: 'Ingresa  un icono valido.'
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
        grupomodulo: {
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
                    $http.post('/Sistema/creategrupomodulo', $scope.objetos.grupomodulo.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Grupo creado correctamente.'
                               };
                               $scope.objetos.grupomodulo.activa = {};
                               $scope.objetos.grupomodulo.obtener();
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

                $scope.objetos.grupomodulo.editar = true;
                $scope.objetos.grupomodulo.temp = obj;

            },
            actualizar: function () {
                if ($("#editar-form").valid()) {
                    $http.post('/Sistema/updategrupomodulo', $scope.objetos.grupomodulo.temp).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Grupo actualizado correctamente.'
                              };
                              $scope.objetos.grupomodulo.temp = {};
                              $scope.objetos.grupomodulo.editar = false;
                              $scope.objetos.grupomodulo.obtener();

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

                $http.post('/Sistema/updateStategrupomodulo', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Grupo actualizado correctamente.'
                              };

                              $scope.objetos.grupomodulo.obtener();
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
                if (confirm("Desea eliminar el grupo del modulo " + obj.nombre)) {


                    $http.post('/Sistema/deletegrupomodulo', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'Grupo eliminado correctamente.'
                            };
                            $scope.objetos.grupomodulo.obtener();
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
    $scope.objetos.grupomodulo.obtener();

});



