
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
        centrocosto: {
            lista: [],
            activa: {},
            obtener: function () {

                $http.post('/Administracion/getCentroCosto', { modulo: { id: 11 } }).
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
            }
        },
        material: 
        {
            lista:[],
            activa:{},
            obtener: function () {

                $http.post('/PedidoPapeleria/getPapelPaquete', $scope.objetos.pedidopapeleria.activa.CentroCosto).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.objetos.material.lista = data.elementos;
             

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
        },
        pedidopapeleria:
         {
            lista: [],
            activa: { PapelData: [], fecha: $scope.formato.fechaActual(), observaciones: 'Responsable: ' },
            filtro:{cantidad:0,texto:''},
            modifica:false,
            obtener:function() {
                $http.post('/PedidoPapeleria/getPapelPedido', {}).
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
            guardar: function ()
            {

                //validamos variables
                if ($scope.objetos.pedidopapeleria.activa.fecha !== undefined && $scope.objetos.pedidopapeleria.activa.fecha != '') {
                    //creamos objeto para enviar
                    var tempPapelData = {};
                    angular.forEach($scope.objetos.material.lista, function (mat, key) {

                        if (mat.cantidad != undefined && mat.cantidad != 0) {
                            tempPapelData = {};
                            tempPapelData.Material = { id: mat.id_material };
                            tempPapelData.cantidad = mat.cantidad;
                            tempPapelData.observaciones = '[UMD: ' + mat.umd + '] OBS:' + mat.observaciones;
                            tempPapelData.Estado = { id: 1 };



                            $scope.objetos.pedidopapeleria.activa.PapelData.push(tempPapelData);

                        }

                    });

                    //enviamos objeto
                    if ($scope.objetos.pedidopapeleria.activa.PapelData.length > 0) {
                        $http.post('/PedidoPapeleria/crearPedido', $scope.objetos.pedidopapeleria.activa).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available

                            if (data.estado) {

                                modifica: false;

                                $scope.funciones.alertNotification("Procesado", "Pedido de papelería creado correctamente.", "success");

                                //vaciamos pedido actual
                                $scope.objetos.pedidopapeleria.activa = { PapelData: [], fecha: $scope.formato.fechaActual() };
                                $scope.objetos.material.lista = [];
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
                        alert("Ningun material ha sido escogido.");
                    }
                   

                }
                else
                {
                    alert("Fecha requerida.");
                }
            },
            modificar: function (pedido)
            {
                $scope.objetos.pedidopapeleria.modifica = true;

                //asignamos pedido activo
                $scope.objetos.pedidopapeleria.activa = pedido;

                //cargamos materiales
                $scope.objetos.material.obtener();


            },
            eliminar: function (pedido)
            {
                if (confirm("Desea elimnar el pedido de papelería?"))
                {
                    $http.post('/PedidoPapeleria/eliminarPedido', pedido).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                            $scope.objetos.pedidopapeleria.obtener();
                            $scope.funciones.alertNotification("Procesado", "Pedido de papelería eliminado correctamente.", "success");

                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log(data);
                        });
                }

            }
         },
        temp: {
            lista: [
                  { descripcion: 'UNIDAD' },
                  { descripcion: 'CAJA' },
                  {descripcion:'PAQUETE'}
            ]
        }
    };
    

    console.log($scope.formato.fechaActual());


    $scope.objetos.centrocosto.obtener();
    $scope.objetos.pedidopapeleria.obtener();
});