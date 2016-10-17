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
        usuario: {
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

            }
        },
        auditoria: {
            lista: [],
            activa: { id: 0 },
            posActiva:0,
            seleccionar: function (pos) {
                $scope.objetos.auditoria.posActiva = pos;
                $scope.objetos.auditoria.activa = $scope.objetos.auditoria.lista[$scope.objetos.auditoria.posActiva];
                $scope.objetos.auditoria.activa.pos = $scope.objetos.auditoria.posActiva;
            },
            obtener: function () {

                $http.post('/Auditoria/getAuditoriaUsuarios', {}).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.objetos.auditoria.lista = data.elementos;
                           $scope.objetos.auditoria.seleccionar($scope.objetos.auditoria.posActiva);
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
            agregarUsuario: function (obj) {

                if ($scope.objetos.auditoria.activa.id == 0) {
                    alert('Por Favor seleccione alguna auditoria');
                }
                else
                {

                
                        $http.post('/Auditoria/createUsuario', {usuario:obj,auditoria:$scope.objetos.auditoria.activa}).
                            success(function (data, status, headers, config) {
                                // this callback will be called asynchronously
                                // when the response is available

                                if (data.estado) {
                     
                                    $scope.funciones.alertNotification("Procesado", "Usuario asignado correctamente.", "success");
                                   $scope.objetos.auditoria.obtener();
                                  //  $scope.objetos.auditoria.seleccionar($scope.objetos.auditoria.activa.pos);
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
            eliminarusuario: function (obj)
            {
                
                    $http.post('/Auditoria/deleteUsuario', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Usuario eliminada correctamente.'
                                          };

                                          $scope.objetos.auditoria.obtener();
                                          $scope.objetos.auditoria.seleccionar($scope.objetos.auditoria.activa.pos);
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
        }

    };

    $scope.objetos.auditoria.obtener();

    if ($scope.objetos.auditoria.lista.lenght > 0)
    {
        $scope.objetos.auditoria.seleccionar(0);
    }
});