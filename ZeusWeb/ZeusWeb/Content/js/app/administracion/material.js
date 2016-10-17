
//validaciones
$(function () {
    // Validation
    $("#crear-form").validate({
        // Rules for form validation
        rules: {
            descripcion: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            descripcion: {
                required: 'Ingresa  una descripción valida.'
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
            descripcion: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            descripcion: {
                required: 'Ingresa  una descripción valida.'
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
        material: {
            activa: {},
            temp:{},
            campos: [
                { descripcion: 'descripcion', label: 'DESCRIPCION', cantidad: 10 }
            ],
            filtro: { cantidad: 10 },
            lista: [],
            crear: function () {
                if ($("#crear-form").valid()) {
                    $http.post('/Administracion/creatematerial', $scope.objetos.material.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Material creado correctamente.'
                               };
                               $scope.objetos.material.activa = {};
                               $scope.objetos.material.obtener();
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

                $scope.objetos.material.editar = true;
                $scope.objetos.material.temp = obj;

            },
            actualizar: function () {
                if ($("#editar-form").valid()) {
                    $http.post('/Administracion/updatematerial', $scope.objetos.material.temp).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Material actualizado correctamente.'
                              };
                              $scope.objetos.material.temp = {};
                              $scope.objetos.material.editar = false;
                              $scope.objetos.material.obtener();

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

                $http.post('/Administracion/updateStatematerial', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Material actualizado correctamente.'
                              };

                              $scope.objetos.material.obtener();
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
                if (confirm("Desea eliminar el material " + obj.descripcion)) {


                    $http.post('/Administracion/deletematerial', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'material eliminado correctamente.'
                            };
                            $scope.objetos.material.obtener();
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

                $http.post('/Administracion/filtrarmaterial', $scope.objetos.material.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

                           $scope.objetos.material.lista = data.elementos;
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
    $scope.objetos.material.obtener();


});



