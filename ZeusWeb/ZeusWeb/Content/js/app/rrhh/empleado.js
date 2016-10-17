//validaciones
$(function () {
    // Validation
    $("#crear-form").validate({
        // Rules for form validation
        rules: {
            numeroIdentificacion: {
                required: true
            },
            nombres: {
                required: true
            },
            apellidos: {
                required: true
            },
            fechanacimiento: {
                required: true
            }

        },

        // Messages for form validation
        messages: {
            numeroIdentificacion: {
                required: 'Ingrese un  número de identificacion valido'
            },
            nombres: {
                required: 'Ingrese algún nombre valido'
            },
            apellidos: {
                required: 'Ingrese algún apellido valido'
            },
            fechanacimiento: {
                required: 'Ingrese una fecha de nacimiento correcta'
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
            numeroIdentificacion: {
                required: true
            },
            nombres: {
                required: true
            },
            apellidos: {
                required: true
            },
            fechanacimiento: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            numeroIdentificacion: {
                required: 'Ingrese un  número de identificacion valido'
            },
            nombres: {
                required: 'Ingrese algún nombre valido'
            },
            apellidos: {
                required: 'Ingrese algún apellido valido'
            },
            fechanacimiento: {
                required: 'Ingrese una fecha de nacimiento correcta'
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
        empleado: {
            activa: { Usuario: { id: 0, nombre: '(Ninguno)' }, TipoIdentificacion: { id: 0, prefijo: 'N/A', descripcion: '(Ninguno)' } },
            temp: { Usuario: { id: 0, nombre: '(Ninguno)' }, TipoIdentificacion: { id: 0, prefijo: 'N/A', descripcion: '(Ninguno)' } },
            campos: [
                { nombre: 'usuario', label: 'USUARIO', cantidad: 10,filter:false }
                , { nombre: 'tipoId', label: 'TIPO IDENTIFICACION', cantidad: 10, filter: false }
                , { nombre: 'identificacion', label: 'NUMERO IDENTIFICACION', cantidad: 10, filter: true }
                , { nombre: 'nombres', label: 'NOMBRES', cantidad: 10, filter: true }
                , { nombre: 'apellidos', label: 'APELLIDOS', cantidad: 10, filter: true }
            ],
            filtro: { cantidad: 10 },
            lista: [],
            getLista:function()
            {
                var list = [];

                angular.forEach($scope.objetos.empleado.lista, function (value, key) {
                    value.tipoId = value.TipoIdentificacion.prefijo;
                    if (value.Usuario != null) {
                        value.usuario = value.Usuario.nombre;
                    }
                  
                    this.push(value);
                },list);

               

                return list;
            },
            crear: function () {
                console.log($scope.objetos.empleado.activa);
                if ($("#crear-form").valid() && $scope.objetos.empleado.activa.TipoIdentificacion.id!=0) {


                    $http.post('/RRHH/createempleado', $scope.objetos.empleado.activa).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Empleado creado correctamente.'
                               };
                               $scope.objetos.empleado.activa = { Usuario: { id: 0, nombre: '(Ninguno)' }, TipoIdentificacion: { id: 0, prefijo: 'N/A', descripcion: '(Ninguno)' } };
                               $scope.objetos.empleado.obtener();
                           }
                           else {
                               console.log(data);
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

                $scope.objetos.empleado.editar = true;
                $scope.objetos.empleado.temp = obj;

            },
            actualizar: function () {
                $scope.objetos.empleado.temp.fechaNacimiento = $scope.objetos.empleado.temp.fechaNacimientoString;
                console.log($scope.objetos.empleado.temp);
                if ($("#editar-form").valid() && $scope.objetos.empleado.temp.TipoIdentificacion.id != 0) {
                    $http.post('/RRHH/updateempleado', $scope.objetos.empleado.temp).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Empleado actualizado correctamente.'
                              };
                              $scope.objetos.empleado.temp = { Usuario: { id: 0, nombre: '(Ninguno)' }, TipoIdentificacion: { id: 0, prefijo: 'N/A', descripcion: '(Ninguno)' } };
                              $scope.objetos.empleado.editar = false;
                              $scope.objetos.empleado.obtener();

                          }
                          else {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-danger',
                                  titulo: 'Error',
                                  mensaje: data.error
                              };
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
            actualizarEstado: function (obj) {

                $http.post('/RRHH/updateStateempleado', obj).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.alerta = {
                                  estado: true,
                                  tipo: 'alert-success',
                                  titulo: 'Realizado',
                                  mensaje: 'Empleado actualizado correctamente.'
                              };

                              $scope.objetos.empleado.obtener();
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


                    $http.post('/RRHH/deleteempleado', obj).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-success',
                                titulo: 'Realizado',
                                mensaje: 'Empleado eliminado correctamente.'
                            };
                            $scope.objetos.empleado.obtener();
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

                $http.post('/RRHH/filtrarempleado', $scope.objetos.empleado.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available
                    
                       if (data.estado) {

                           $scope.objetos.empleado.lista = data.elementos;
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

        }, usuario: {
            lista: [],
            top: 10,
            filtro: {},
            campos: [
                { nombre: 'username', label: 'USERNAME' },
                { nombre: 'nombre', label: 'NOMBRE' },
                { nombre: 'correo', label: 'CORREO ELECTRONICO' },
            ],
            obtener: function () {

                $http.post('/Sistema/filtrarUsuarios', { top: $scope.objetos.usuario.top, filtro: $scope.objetos.usuario.filtro }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {

                          $scope.objetos.usuario.lista = data.elementos;
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

            },
            seleccionar: function (usuario) {

                $scope.objetos.empleado.activa.Usuario = usuario;

            },
            seleccionarEdit: function (usuario) {

                $scope.objetos.empleado.temp.Usuario = usuario;

            }
        }, tipoidentificacion: {
            activa: {},
            campos: [
                { nombre: 'prefijo', label: 'PREFIJO', cantidad: 10 }
                , { nombre: 'descripcion', label: 'DESCRIPCION', cantidad: 10 }
            ],
            filtro: { cantidad: 10 },
            top: 10,
            lista: [],
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
            },
            seleccionar: function (tipoId) {

                $scope.objetos.empleado.activa.TipoIdentificacion = tipoId;

            },
            seleccionarEdit: function (tipoId) {

                $scope.objetos.empleado.temp.TipoIdentificacion = tipoId;

            }
        }
    };
    $scope.alerta = {
        estado: false,
        tipo: '',
        titulo: '',
        mensaje: ''

    };
    $scope.objetos.empleado.obtener();

});



