var app = angular.module('appModulo', []);

app.controller('appControlador', function ($scope, $http) {
    $scope.objetos = {
        rol: {
            activo: {},
            lista: [],
            obtener: function () {
                $http.post('/Sistema/rolesAsociados', { usuario: $scope.objetos.usuario.activo }).
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
            },
            asignar: function (rol) {
                if(rol.asignado==0)
                {
                    //insert
                    $http.post('/Sistema/createRolesAsociados', { rol: rol, usuario: $scope.objetos.usuario.activo }).
                         success(function (data, status, headers, config) {
                             // this callback will be called asynchronously
                             // when the response is available

                             if (data.estado) {
                                 $scope.objetos.rol.obtener();
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
                else {

                    if (rol.Estado.id == 1) {
                        ///update off
                        rol.Estado.id = 2;
                    }
                    else
                    {
                        ///update on
                        rol.Estado.id = 1;
                    }

                    //insert
                    $http.post('/Sistema/updateRolesAsociados', { rol: rol, usuario: $scope.objetos.usuario.activo }).
                         success(function (data, status, headers, config) {
                             // this callback will be called asynchronously
                             // when the response is available

                             if (data.estado) {
                                 $scope.objetos.rol.obtener();
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
        },
        usuario: {
            activo: { nombre: '-- Seleccionar Usuario --' },
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
                $scope.objetos.usuario.activo = usuario;
                $scope.objetos.rol.obtener();
            }
        }
    };
});