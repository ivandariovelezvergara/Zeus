var app = angular.module('appArchivo', []);

app.controller('appArchivoCtrl', function ($scope, $http) {
    $scope.objetos = {
        itempermiso: {
            lista:[],
            obtener: function () {
                $http.post('/Sistema/permisosRol', $scope.objetos.rol.activa).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available
                                
                                      if (data.estado) {

                                          $scope.objetos.itempermiso.lista = data.elementos;
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
            actualizarEstado:function(item)
            {
               
                $http.post('/Sistema/permisosRolUpdate', { rol: $scope.objetos.rol.activa, item: item }).
                                 success(function (data, status, headers, config) {
                                     // this callback will be called asynchronously
                              
                                     if (data.estado) {
                                         
                                         $scope.objetos.itempermiso.obtener();
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
        rol: {
            activa: {},
            lista: [],
            filtro: { cantidad: 100 },
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

    $scope.objetos.rol.obtener();
});