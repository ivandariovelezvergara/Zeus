var app = angular.module('appModulo', []);

app.controller('appControlador', function ($scope, $http) {
    $scope.objetos = {
        material: {
            activo: {},
            lista: [],
            obtener: function () {
                
                $http.post('/PedidoPapeleria/getPapelPaquete', $scope.objetos.centrocosto.activo).
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
            },
            cambiar: function (papelPaquete)
            {
              
                if (papelPaquete.id!= 0)
                {
                    $http.post('/PedidoPapeleria/deletePapelPaquete', { id: papelPaquete.id } ).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.objetos.material.obtener();
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
                else
                {
                    $http.post('/PedidoPapeleria/createPapelPaquete', { centrocosto: $scope.objetos.centrocosto.activo, material: { id: papelPaquete.id_material } }).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available

                if (data.estado) {
                    $scope.objetos.material.obtener();
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
        centrocosto: {
            activo: { descripcion: '-- Seleccionar Centro de Costo --' },
            lista: [],
            listaAsignados: [],
            filtro: { cantidad: 10 },
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
            seleccionar: function (centrocosto) {
                $scope.objetos.centrocosto.activo = centrocosto;
                $scope.objetos.material.obtener();
            }
        }
    };
});