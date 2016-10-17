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
        informe: {
            exportar: function ()
            {
                location.href = '/PedidoPapeleria/getInformeExcel';
                
            }
        }
    };
    
 
});