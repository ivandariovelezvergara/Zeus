var app = angular.module('appObject', []);

app.controller('appObjectCtrl', function ($scope, $http, $filter) {
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


    $scope.objetos = {
        pedidopapeleria: {
            lista: [],
            activa: { PapelData: [] },
            filtro:{cantidad:100,texto:''},
            cerrar: function (pedido)
            {
           
                $http.post('/PedidoPapeleria/cerrarPedido', pedido).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {

                            $scope.objetos.pedidopapeleria.obtener();
                            $scope.funciones.alertNotification("Procesado", "Pedido de papelería cerrado correctamente.", "success");
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
            obtener: function () {
                $http.post('/PedidoPapeleria/getPapelPedidoTodas', $scope.objetos.pedidopapeleria.filtro).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {

                          $scope.objetos.pedidopapeleria.lista = data.elementos;
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
            exportar: function () {
                var temp = $filter('filter')($scope.objetos.pedidopapeleria.lista, { marca: true });
                var pedidos = '';
               
                angular.forEach(temp, function (value, key) {
                    pedidos = pedidos + value.id + ',';
                });

                pedidos = pedidos.substring(0, pedidos.length - 1);
              
                location.href = '/PedidoPapeleria/getInformeExcel?pedidos=' + pedidos;

            }
        }
    };
    
    $scope.objetos.pedidopapeleria.obtener();
});