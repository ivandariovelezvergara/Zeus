var app = angular.module('appArchivo', []);
app.controller('appArchivoCtrl', function ($scope, $http, $filter) {
    $scope.objetos = {
        auditoria: {
            lista:[],
            obtener: function () {
                $http.post('/Auditoria/getPendientes', { }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                    
                      if(data.estado)
                      {
                          console.log(data);
                          $scope.objetos.auditoria.lista = data.elementos;
                      }
                      else
                      {
                          alert('No hay datos');
                      }
                     
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });
            },
            notificar: function (aud) {
                $http.post('/Auditoria/notificarPendientes', {correo:aud.usuario_correo,auditoria:aud.auditoria,centrocosto:aud.centrocosto}).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          console.log(data);
                                          alert('Auditoria notificada al usuario');
                                      }
                                      else {
                                          alert('No se pudo realizar la notificación');
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
});