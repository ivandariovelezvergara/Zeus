var app = angular.module('app', []);

app.controller('appAjustesInventario', function ($scope, $http, $filter, $timeout) {


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
        centrocosto: {
            lista: [],
            activo: {},
            obtener: function () {

                $http.post('/Administracion/getCentroCosto', { modulo: { id: 0 } }).
                         success(function (data, status, headers, config) {
                             // this callback will be called asynchronously
                             // when the response is available

                             if (data.estado) {

                                 $scope.objetos.centrocosto.lista = data.elementos;
                                 $scope.objetos.centrocosto.activo = $scope.objetos.centrocosto.lista[0];
                                 $scope.objetos.concepto.obtener();
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
        concepto: {
            lista: [],
            activo:{},
            obtener: function () {
                $http.post('/Helper/data_getConceptos', { plantilla: 'INDICADOR AJUSTES INVENTARIO' }).
                   success(function (data, status, headers, config) {

                       if (data.estado)
                       {
                           $scope.objetos.concepto.lista = data.elementos;
                           $scope.objetos.mes.lista = $filter('filter')($scope.objetos.concepto.lista, { nombre: 'MES' })[0].Atributos;
                           $scope.objetos.mes.activo = $scope.objetos.mes.lista[0];
                           $scope.objetos.anio.lista = $filter('filter')($scope.objetos.concepto.lista, { nombre: 'AÑO' })[0].Atributos;
                           $scope.objetos.anio.activo = $scope.objetos.anio.lista[0];
                           $scope.objetos.calculo.lista = $filter('filter')($scope.objetos.concepto.lista, { nombre: 'CALCULO' })[0].Atributos;
                           $scope.objetos.calculo.activo = $scope.objetos.calculo.lista[0];
                

                           $scope.objetos.datos.obtener();
                       }
                       else
                       {
                           console.log(data);
                       }

                   

                   }).
                   error(function (data, status, headers, config) {
                       console.log(data);
                   });
            }
        },
        mes: {
            lista: [],
            activo: {},
            obtener: function () {

                $http.post('/Helper/data_getAtributos', { plantilla: 'INDICADOR AJUSTES INVENTARIO', concepto: 'MES' }).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available

                            if (data.estado) {
                                $scope.objetos.mes.lista = data.elementos;
                                $scope.objetos.mes.activo= $scope.objetos.mes.lista[new Date().getMonth()];
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
        anio: {
            lista: [],
            activo: {},
            obtener: function () {

                $http.post('/Helper/data_getAtributos', { plantilla: 'INDICADOR AJUSTES INVENTARIO', concepto: 'AñO' }).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available

                            if (data.estado) {
                                $scope.objetos.anio.lista = data.elementos;
                                $scope.objetos.anio.activo = $scope.objetos.anio.lista[$scope.objetos.anio.lista.length-1];
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
        calculo: {
            lista: [],
            activo: {},
            obtener: function () {

                $http.post('/Helper/data_getAtributos', { plantilla: 'INDICADOR AJUSTES INVENTARIO', concepto: 'CALCULO' }).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available

                            if (data.estado) {
                                $scope.objetos.calculo.lista = data.elementos;
                                $scope.objetos.calculo.activo = $scope.objetos.calculo.lista[1];
                               
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
        datos: {
            lista: [],
            valor:0,
            obtener: function () {
                $http.post('/Helper/data_getValores', { plantilla: { id: 2 }}).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available

                            if (data.estado) {


                                $scope.objetos.datos.lista = data.elementos;
                                $scope.objetos.datos.calcular();
                                
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
            obtenerByMes: function () {
                var atributos = [];

                atributos.push({ id: $scope.objetos.anio.activo.id });
                atributos.push({ id: $scope.objetos.calculo.activo.id });
                atributos.push({ id: 0, Concepto: { nombre: 'SUCURSAL' }, nombre: $scope.objetos.centrocosto.activo.descripcion });

                $http.post('/Helper/data_getValor', { plantilla: { id: 2 }, atributos: atributos }).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
              
                            if (data.estado) {



                               // console.log(data);

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
            calcular: function () {
                var resFilter = $scope.objetos.datos.lista;


                resFilter = $filter('filter')(resFilter, { codificacion: 'MES:' + $scope.objetos.mes.activo.nombre }); //mes
                resFilter = $filter('filter')(resFilter, { codificacion: 'CALCULO:' + $scope.objetos.calculo.activo.nombre }); //calculo
                resFilter = $filter('filter')(resFilter, { codificacion: 'AÑO:' + $scope.objetos.anio.activo.nombre }); //calculo
                resFilter = $filter('filter')(resFilter, { codificacion: 'EVENTOVALOR:% AJUSTE INVENTARIO / COSTO PROPIO' }); //eventoValor
                resFilter = $filter('filter')(resFilter, { codificacion: 'SUCURSAL:' + $scope.objetos.centrocosto.activo.descripcion }); //sucursal

                if (resFilter != null && resFilter.length>0)
                {
                    $scope.objetos.datos.valor = roundToTwo(resFilter[0].valor);
                }
                else
                {
                    $scope.objetos.datos.valor = 0;
                }

       
            

           
            }
        },
        grafica: {
            generar: function () {
             

            }

        }
    };

    //$timeout($scope.objetos.datos.obtener, 5000,false);
    
    
});