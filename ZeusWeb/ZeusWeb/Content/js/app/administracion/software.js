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
                required: 'Ingresa  un nombre de software valido.'
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
                required: 'Ingresa  un nombre de software valido.'
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
        software: {
            activa: {},
            campos: [
                {nombre:'descripcion',label:'DESCRIPCION',cantidad:10}
            ],
            filtro:{cantidad:10},
            lista: [],
            crear: function () {
                if ($("#crear-form").valid()) {
                    $http.post('/Administracion/createSoftware', $scope.objetos.software.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Software creado correctamente.'
                               };
                               $scope.objetos.software.activa = {};
                               $scope.objetos.software.obtener();
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

                $scope.objetos.software.editar = true;
                $scope.objetos.software.activa = obj;
             
            },
            actualizar: function ()
            {
                if ($("#editar-form").valid()) {
                    $http.post('/Administracion/updatesoftware', $scope.objetos.software.activa).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Software actualizado correctamente.'
                              };
                              $scope.objetos.software.activa = {};
                              $scope.objetos.software.editar = false;
                              $scope.objetos.software.obtener();

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
            actualizarEstado: function (obj)
            {
             
                $http.post('/Administracion/updateStatesoftware', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Software actualizado correctamente.'
                              };
              
                              $scope.objetos.software.obtener();
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
            eliminar: function (obj)
            {
                if (confirm("Desea eliminar el Software " + obj.descripcion))
                {

                
                    $http.post('/Administracion/deletesoftware', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'Software eliminado correctamente.'
                            };
                            $scope.objetos.software.obtener();
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

                $http.post('/Administracion/filtrarsoftware', $scope.objetos.software.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

                           $scope.objetos.software.lista = data.elementos;
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
        estado:false,
        tipo: '',
        titulo: '',
        mensaje:''

    };
    $scope.objetos.software.obtener();
  
});



