
var app = angular.module('appObject', []);

app.controller('appObjectCtrl', function ($scope, $http) {
    $scope.formato = {
        fecha: function (fecha) {
            var re = /-?\d+/;
            var m = re.exec(fecha);
            var d = new Date(parseInt(m));
            return $.datepicker.formatDate("dd/mm/yy", d);
        },
        fechaActual: function () {
            var hoy = new Date();
            return hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
        }
    };

    $scope.objetos = {
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

                $scope.objetos.papelPaquete.obtener();
            }
        },
        papelPaquete: {
            lista:[],
            obtener: function () {

                $http.post('/PedidoPapeleria/getPapelPaquetePermiso', $scope.objetos.centrocosto.activo).
                     success(function (data, status, headers, config) {
                         // this callback will be called asynchronously
                         // when the response is available

                         if (data.estado) {

                             $scope.objetos.papelPaquete.lista = data.elementos;
                             console.log(data.elementos);
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


});