var angularApp = angular.module('app', ['ngRoute']);


// configure our routes
angularApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: '/Content/templates/sucursal/indicadores/inicio.html',
            controller: 'inicioController'
        })

        .when('/ajustesInventario', {
            templateUrl: '/Content/templates/sucursal/indicadores/ajustesinventario.html',
            controller: 'ajustesInventarioController'
        });
});


//funciones
angularApp.filter('orderObjectBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});

// create the controller and inject Angular's $scope
angularApp.controller('inicioController', function ($scope) {
    // create a message to display in our view
   
});
angularApp.controller('ajustesInventarioController', function ($scope, $http, $timeout,$filter) {
    // create a message to display in our view
    $scope.objetos = {
        centrocosto: {
            lista: [],
            activo: {},
            filtro:{},
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
            activo: {},
            obtener: function () {
                $http.post('/Helper/data_getConceptos', { plantilla: 'INDICADOR AJUSTES INVENTARIO' }).
                   success(function (data, status, headers, config) {

                       if (data.estado) {
                           $scope.objetos.concepto.lista = data.elementos;
                           $scope.objetos.mes.lista = $filter('filter')($scope.objetos.concepto.lista, { nombre: 'MES' })[0].Atributos;
                           $scope.objetos.mes.activo = $scope.objetos.mes.lista[0];
                           $scope.objetos.anio.lista = $filter('filter')($scope.objetos.concepto.lista, { nombre: 'AÑO' })[0].Atributos;
                           $scope.objetos.anio.activo = $scope.objetos.anio.lista[0];
                           $scope.objetos.calculo.lista = $filter('filter')($scope.objetos.concepto.lista, { nombre: 'CALCULO' })[0].Atributos;
                           $scope.objetos.calculo.activo = $scope.objetos.calculo.lista[0];
                         

                           $scope.objetos.datos.obtener();
                       }
                       else {
                           console.log(data);
                       }



                       // $filter('filter')($scope.objetos.concepto.lista, { Categoria: { id: categoria.id } })[0];

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
                                $scope.objetos.mes.activo = $scope.objetos.mes.lista[new Date().getMonth()];
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
                                $scope.objetos.anio.activo = $scope.objetos.anio.lista[$scope.objetos.anio.lista.length - 1];
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
            activo: {},
            obtener: function () {
             
                $http.post('/Helper/data_getValores', { plantilla: { id: 2 } }).
                     success(function (data, status, headers, config) {
                         // this callback will be called asynchronously
                         // when the response is available

                         if (data.estado) {


                             $scope.objetos.datos.lista = data.elementos;
            

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
            getDato: function (anio,mes,centrocosto,calculo) {
                var resFilter = $scope.objetos.datos.lista;

                resFilter = $filter('filter')(resFilter, { codificacion: 'MES:' + mes}); //mes
                resFilter = $filter('filter')(resFilter, { codificacion: 'CALCULO:' + calculo }); //calculo
                resFilter = $filter('filter')(resFilter, { codificacion: 'AÑO:' + anio }); //calculo
                resFilter = $filter('filter')(resFilter, { codificacion: 'EVENTOVALOR:% AJUSTE INVENTARIO / COSTO PROPIO' }); //eventoValor
                resFilter = $filter('filter')(resFilter, { codificacion: 'SUCURSAL:' + centrocosto }); //sucursal

                if (resFilter != null && resFilter.length > 0) {
                   return roundToTwo(resFilter[0].valor);
                }
                else {
                    return 0;
                }

            }
        },
        graficas: {
            anual: {
                char:null,
                load: function () {
                  //  $scope.objetos.graficas.anual.char = document.getElementById("gf_anual");
                    console.log('grafica');

                    var op = {
                        chart: {
                            renderTo: 'gf_anual'
                        },
                        title: {
                            text: 'Indicador de Ajustes de Inventario',
                            x: -20 //center
                        },
                        subtitle: {
                            text: '',
                            x: -20
                        },
                        xAxis: {
                            categories: $scope.objetos.funcion.convertToList($scope.objetos.mes.lista,'nombre')
                        },
                        yAxis: {
                            title: {
                                text: '% Ajuste'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]
                        },
                        tooltip: {
                            valueSuffix: '%'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        series: [{
                            name: '%META',
                            color: '#31B404',
                            data: $scope.objetos.funcion.convertToList($scope.objetos.variable.MetasxMes, 'valor')
                        }, {
                            name: '%REAL',
                            color: '#086A87',
                            data: $scope.objetos.funcion.convertToList($scope.objetos.variable.RealxMes, 'valor')
                        }]
                    };

                   

                    if ($scope.objetos.graficas.anual.char != null) {
                        $scope.objetos.graficas.anual.char = new Highcharts.Chart(op);
                        $scope.objetos.graficas.anual.char.redraw();
                    }
                    else {
                        $scope.objetos.graficas.anual.char = new Highcharts.Chart(op);
                    }
                  
                    




                }
            },
            compara: {
                load: function () {
                    $('#gf_compara').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Comparativo Anual'
                        },
                        subtitle: {
                            text: 'Actualizado: 15 - Junio - 2016'
                        },
                        xAxis: {
                            categories: [
                                'ENERO',
                                'FEBRERO',
                                'MARZO',
                                'ABRIL',
                                'MAYO',
                                'JUNIO',
                                'JULIO',
                                'AGOSTO',
                                'SEPTIEMBRE',
                                'OCTUBRE',
                                'NOVIEMBRE',
                                'DICIEMBRE'
                            ],
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '% Ajuste'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: '2015',
                            data: [49.9, 71.5]

                        }, {
                            name: '2016',
                            data: [83.6, 78.8]

                        }]
                    });
                }
            }
        },
        variable: {
            cargar: function () {

                //META ACTUAL
                var atributosMetaActual = [];
                atributosMetaActual.push({ id: 0, nombre: $scope.objetos.centrocosto.activo.descripcion, Concepto: { nombre: 'SUCURSAL' } });
                atributosMetaActual.push({ id: 0, nombre: $scope.objetos.mes.activo.nombre, Concepto: { nombre: 'MES' } });
                atributosMetaActual.push({ id: 0, nombre: $scope.objetos.anio.activo.nombre, Concepto: { nombre: 'AÑO' } });
                atributosMetaActual.push({ id: 0, nombre: '% AJUSTE INVENTARIO / COSTO PROPIO', Concepto: { nombre: 'EVENTOVALOR' } });
                atributosMetaActual.push({ id: 0, nombre: 'META', Concepto: { nombre: 'CALCULO' } });
                $scope.objetos.datos.obtenerValor(2, 'metaActual', atributosMetaActual);

                //PROMEDIO ACTUAL
                var atributosPromedioActual = [];
                atributosPromedioActual.push({ id: 0, nombre: $scope.objetos.centrocosto.activo.descripcion, Concepto: { nombre: 'SUCURSAL' } });
                atributosPromedioActual.push({ id: 0, nombre: $scope.objetos.mes.activo.nombre, Concepto: { nombre: 'MES' } });
                atributosPromedioActual.push({ id: 0, nombre: $scope.objetos.anio.activo.nombre, Concepto: { nombre: 'AÑO' } });
                atributosPromedioActual.push({ id: 0, nombre: '% AJUSTE INVENTARIO / COSTO PROPIO', Concepto: { nombre: 'EVENTOVALOR' } });
                atributosPromedioActual.push({ id: 0, nombre: 'PROMEDIO', Concepto: { nombre: 'CALCULO' } });
                $scope.objetos.datos.obtenerValor(2, 'promedioActual', atributosPromedioActual);

                //REAL ACTUAL
                var atributosRealActual = [];
                atributosRealActual.push({ id: 0, nombre: $scope.objetos.centrocosto.activo.descripcion, Concepto: { nombre: 'SUCURSAL' } });
                atributosRealActual.push({ id: 0, nombre: $scope.objetos.mes.activo.nombre, Concepto: { nombre: 'MES' } });
                atributosRealActual.push({ id: 0, nombre: $scope.objetos.anio.activo.nombre, Concepto: { nombre: 'AÑO' } });
                atributosRealActual.push({ id: 0, nombre: '% AJUSTE INVENTARIO / COSTO PROPIO', Concepto: { nombre: 'EVENTOVALOR' } });
                atributosRealActual.push({ id: 0, nombre: 'REAL', Concepto: { nombre: 'CALCULO' } });
                $scope.objetos.datos.obtenerValor(2, 'realActual', atributosRealActual);

                //LISTA % METAS X MES
                var atributosMetasXMes = [];
                atributosMetasXMes.push({ id: 0, nombre: $scope.objetos.centrocosto.activo.descripcion, Concepto: { nombre: 'SUCURSAL' } });
               // atributosMetasXMes.push({ id: 0, nombre: $scope.objetos.mes.activo.nombre, Concepto: { nombre: 'MES' } });
                atributosMetasXMes.push({ id: 0, nombre: $scope.objetos.anio.activo.nombre, Concepto: { nombre: 'AÑO' } });
                atributosMetasXMes.push({ id: 0, nombre: '% AJUSTE INVENTARIO / COSTO PROPIO', Concepto: { nombre: 'EVENTOVALOR' } });
                atributosMetasXMes.push({ id: 0, nombre: 'META', Concepto: { nombre: 'CALCULO' } });
                $scope.objetos.datos.obtenerValores(2, 'MetasxMes', atributosMetasXMes, 'Atributos[1].id');

                //LISTA % REAL X MES
                var atributosRealXMes = [];
                atributosRealXMes.push({ id: 0, nombre: $scope.objetos.centrocosto.activo.descripcion, Concepto: { nombre: 'SUCURSAL' } });
                // atributosRealXMes.push({ id: 0, nombre: $scope.objetos.mes.activo.nombre, Concepto: { nombre: 'MES' } });
                atributosRealXMes.push({ id: 0, nombre: $scope.objetos.anio.activo.nombre, Concepto: { nombre: 'AÑO' } });
                atributosRealXMes.push({ id: 0, nombre: '% AJUSTE INVENTARIO / COSTO PROPIO', Concepto: { nombre: 'EVENTOVALOR' } });
                atributosRealXMes.push({ id: 0, nombre: 'REAL', Concepto: { nombre: 'CALCULO' } });
                $scope.objetos.datos.obtenerValores(2, 'RealxMes', atributosRealXMes, 'Atributos[1].id');


                //RECARGAMOS GRAFICAS
                $timeout($scope.objetos.graficas.anual.load, 5000, false);
                $timeout($scope.objetos.graficas.compara.load, 5000, false);
            }
        },
        funcion: {
            convertToList: function (lista,variable) {
                var rlist = [];
                angular.forEach(lista, function (val, key) {
                    rlist.push(val[variable]);
                });

                return rlist;
            }
        }
    };


    //iniciar

    $scope.objetos.centrocosto.obtener();
    
   
  //  $timeout($scope.objetos.variable.cargar, 5000, false);
    
});