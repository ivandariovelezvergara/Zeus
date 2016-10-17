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
                required: 'Ingresa  un centro de costo valido.'
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
                required: 'Ingresa  un centro de costo valido.'
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


    //funciones
    $scope.funciones = {
        alertNotification: function (titulo, contenido, tipo) {

            var color = "";
            var icon = "";
            switch (tipo) {
                case "success":
                    color = "#3ADF00"; icon = "fa fa-thumbs-o-up";
                    break;
                case "info":
                    color = "#81DAF5"; icon = "fa fa-hand-paper-o";
                    break;
                case "danger":
                    color = "#FA5858"; icon = "fa fa-thumbs-o-down";
                    break;

                default:
                    break;
            }

            $.smallBox({
                title: titulo,
                content: contenido,
                color: color,
                timeout: 8000,
                icon: icon
            });




        },
        confirmacionYesNo: function (titulo, contenido, objeto, funcion) {
            return confirm(titulo + "\n" + contenido);
        }
    };
    //objetos    
    $scope.objetos = {
        centrocosto: {
            activa: {},
            campos: [
                {nombre:'descripcion',label:'DESCRIPCION',cantidad:10}
            ],
            filtro:{cantidad:10},
            lista: [],
            crear: function () {
                if ($("#crear-form").valid()) {
                    $http.post('/Administracion/createCentrocosto', $scope.objetos.centrocosto.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.funciones.alertNotification("Procesado", "Centro de costo creado correctamente.", "success");
                               $scope.objetos.centrocosto.activa = {};
                               $scope.objetos.centrocosto.obtener();
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

                $scope.objetos.centrocosto.editar = true;
                $scope.objetos.centrocosto.activa = obj;
             
            },
            actualizar: function ()
            {
                if ($("#editar-form").valid()) {
                    $http.post('/Administracion/updateCentrocosto', $scope.objetos.centrocosto.activa).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.funciones.alertNotification("Procesado", "Centro de Costo " + $scope.objetos.centrocosto.activa + " actualizado correctamente.", "success");
                              $scope.objetos.centrocosto.activa = {};
                              $scope.objetos.centrocosto.editar = false;
                              $scope.objetos.centrocosto.obtener();

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
             
                $http.post('/Administracion/updateStateCentrocosto', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.funciones.alertNotification("Procesado", "Cambio de estado.", "success");
              
                              $scope.objetos.centrocosto.obtener();
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
                if (confirm("Desea eliminar el centro de costo " + obj.descripcion))
                {

                
                    $http.post('/Administracion/deleteCentrocosto', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.funciones.alertNotification("Procesado", "Centro de costo eliminado correctamente.", "success");
                            $scope.objetos.centrocosto.obtener();
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

                $http.post('/Administracion/filtrarCentrocosto', $scope.objetos.centrocosto.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.funciones.alertNotification("Actualización", "Datos cargados correctamente", "success");
                           $scope.objetos.centrocosto.lista = data.elementos;
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
    $scope.objetos.centrocosto.obtener();
  
});



