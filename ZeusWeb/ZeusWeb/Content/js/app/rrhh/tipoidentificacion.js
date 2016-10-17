//validaciones
$(function () {
    // Validation
    $("#crear-form").validate({
        // Rules for form validation
        rules: {
            descripcion: {
                required: true
            },
            prefijo: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            descripcion: {
                required: 'Ingresa  una descripción valida.'
            },
            prefijo: {
                required: 'Ingresa  un prefijo valido.'
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
            },
            prefijo: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            descripcion: {
                required: 'Ingresa  una descripción valida.'
            },
            prefijo: {
                required: 'Ingresa  un prefijo valido.'
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
        tipoidentificacion: {
            activa: {},
            campos: [
                { nombre: 'prefijo', label: 'PREFIJO', cantidad: 10 }
                , { nombre: 'descripcion', label: 'DESCRIPCION', cantidad: 10 }
            ],
            filtro: { cantidad: 10 },
            lista: [],
            crear: function () {
                if ($("#crear-form").valid()) {
                    $http.post('/RRHH/createTipoidentificacion', $scope.objetos.tipoidentificacion.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Tipo de identificación creada correctamente.'
                               };
                               $scope.objetos.tipoidentificacion.activa = {};
                               $scope.objetos.tipoidentificacion.obtener();
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

                $scope.objetos.tipoidentificacion.editar = true;
                $scope.objetos.tipoidentificacion.activa = obj;

            },
            actualizar: function () {
                if ($("#editar-form").valid()) {
                    $http.post('/RRHH/updateTipoidentificacion', $scope.objetos.tipoidentificacion.activa).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Tipo de identificación actualizada correctamente.'
                              };
                              $scope.objetos.tipoidentificacion.activa = {};
                              $scope.objetos.tipoidentificacion.editar = false;
                              $scope.objetos.tipoidentificacion.obtener();

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

                $http.post('/RRHH/updateStateTipoidentificacion', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Tipo de identificación actualizada correctamente.'
                              };

                              $scope.objetos.tipoidentificacion.obtener();
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
                if (confirm("Desea eliminar el centro de costo " + obj.descripcion)) {


                    $http.post('/RRHH/deleteTipoidentificacion', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'Tipo de identificación eliminado correctamente.'
                            };
                            $scope.objetos.tipoidentificacion.obtener();
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

                $http.post('/RRHH/filtrarTipoidentificacion', $scope.objetos.tipoidentificacion.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

                           $scope.objetos.tipoidentificacion.lista = data.elementos;
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
    $scope.objetos.tipoidentificacion.obtener();

});



