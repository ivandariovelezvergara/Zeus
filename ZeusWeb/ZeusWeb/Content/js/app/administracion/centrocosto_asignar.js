var app = angular.module('appModulo', []);

app.controller('appControlador', function ($scope, $http) {
    //funciones
    $scope.funciones = {
        alertNotification: function (titulo,contenido,tipo) {
                
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
        confirmacionYesNo: function (titulo,contenido,objeto,funcion) {
            return confirm(titulo + "\n" + contenido);
        }
    };
    //objetos
    $scope.objetos = {
      
        usuario: {
            activo: { nombre: '-- Seleccionar Usuario --' },
            lista: [],
            top: 10,
            filtro: {cantidad:10},
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
                $scope.objetos.usuario.activo = usuario;
            }
        },
        modulo: {
            activo: { nombre: '-- Seleccionar Modulo --' },
            lista: [],
            filtro: { cantidad: 10 },
            campos: [
                { nombre: 'nombre', label: 'NOMBRE', cantidad: 10 },
                { nombre: 'icono', label: 'ICONO', cantidad: 10 }
            ],
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
            },
            seleccionar: function (modulo) {
                $scope.objetos.modulo.activo = modulo;
               
            }
        },
        centrocosto: {
            activo: { descripcion: '-- Seleccionar Centro de Costo --' },
            lista: [],
            listaAsignados:[],
            filtro: {cantidad:10},
            campos: [
                 { nombre: 'descripcion', label: 'DESCRIPCION', cantidad: 10 }
            ],
            obtener: function () {

                $http.post('/Administracion/filtrarCentrocosto', $scope.objetos.centrocosto.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {

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
            },
            obtenerAsignados:function()
            {
                if ($scope.objetos.modulo.activo.id === undefined || $scope.objetos.usuario.activo.id === undefined)
                {
                    $scope.funciones.alertNotification("Faltan Datos", "No se ha escogido algun modulo ó usuario para consultar.", "danger");
                    return;
                }

                

                $http.post('/Administracion/getCentroCostoAsignado', { modulo: $scope.objetos.modulo.activo, usuario: $scope.objetos.usuario.activo }).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.funciones.alertNotification("Actualización", "Datos cargados correctamente", "success");
                           $scope.objetos.centrocosto.listaAsignados = data.elementos;
                      
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
            seleccionar: function (centrocosto) {
                $scope.objetos.centrocosto.activo = centrocosto;

            },
            agregar: function ()
            {
                if ($scope.objetos.modulo.activo.id === undefined || $scope.objetos.usuario.activo.id === undefined) {
                    $scope.funciones.alertNotification("Faltan Datos", "No se ha escogido algun modulo ó usuario para consultar.", "danger");
                    return;
                }

                $http.post('/Administracion/createCentrocostoAsignado', { modulo: $scope.objetos.modulo.activo, usuario: $scope.objetos.usuario.activo, centrocosto: $scope.objetos.centrocosto.activo }).
                 success(function (data, status, headers, config) {
                     // this callback will be called asynchronously
                     // when the response is available

                     if (data.estado) {
                         $scope.funciones.alertNotification("Procesado", "Centro de costo asignado.", "success");
                         $scope.objetos.centrocosto.obtenerAsignados();
                     }
                     else {
                         $scope.funciones.alertNotification("Error", JSON.stringify(data), "danger");
                     }

                 }).
                 error(function (data, status, headers, config) {
                     // called asynchronously if an error occurs
                     // or server returns response with an error status.
                     console.log(data);
                 });
            },
            eliminar: function (centroCosto) {
                if ($scope.funciones.confirmacionYesNo("Confirmación", "Desea eliminar el centro de costo " + centroCosto.descripcion + " asignado ")) {


                    $http.post('/Administracion/updateStateCentrocostoAsignado', { centroCostoAsignado: centroCosto.id }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.funciones.alertNotification("Procesado", "Centro de costo " + centroCosto.descripcion + " des-asignado.", "success");
                            $scope.objetos.centrocosto.obtenerAsignados();
                        }
                        else {
                            $scope.funciones.alertNotification("Error", data, "danger");
                        }

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.funciones.alertNotification("Error", data, "danger");
                        console.log(data);
                    });
                }
            }
        }
    };
    
});