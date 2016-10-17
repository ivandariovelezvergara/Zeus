var app = angular.module('appArchivo', []);
app.controller('appArchivoCtrl', function ($scope, $http, $filter) {
    $scope.objetos = {
        auditoria: {
            lista: [],
            obtener: function(){
                $http.post('/Auditoria/getInformeParametros', {parametro:'auditorias'}).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                          $scope.objetos.auditoria.lista = data.elementos;
           
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
        periodo: {
            filtroLista:(new Date).getFullYear(),
            lista: [],
            obtener: function () {
                $http.post('/Auditoria/getInformeParametros', { parametro: 'periodos' }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                          $scope.objetos.periodo.lista = data.elementos;
                        
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
        centrocosto: {
            lista: [],
            obtener: function () {
                $http.post('/Auditoria/getInformeParametros', { parametro: 'centroscosto' }).
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
            getDataGrafica: function () {
                var temp = [];
                angular.forEach($scope.objetos.informe.byCentroCosto, function (value, key) {
                    this.push({ name: value.nombre, data: [value.calificacion] });
                }, temp);


                return temp;
            },
            getGrafica: function () {
                $('#centrocosto').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Indicador por Centros de Costo'
                    },
                    xAxis: {
                        categories: [
                            '%'

                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Porcentaje (%)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
                    series: $scope.objetos.centrocosto.getDataGrafica()
                });
            }
        },
        usuario: {
            lista: [],
            obtener: function () {
                $http.post('/Auditoria/getInformeParametros', { parametro: 'usuario' }).
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
            }
        },
        informe: {
            byCentroCosto: [],
            byUsuario: [],
            byCategorias: [],
            byObservaciones: [],
            obtener: function () {

                /************************************/
                $http.post('/Auditoria/getInforme', { informe: 'bycentroscosto', auditorias: $scope.objetos.informe.activa.auditorias, auditores: $scope.objetos.informe.activa.auditores, periodos: $scope.objetos.informe.activa.periodos, ceccos: $scope.objetos.informe.activa.ceccos }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                     
                      if (data.estado) {
                          $scope.objetos.informe.byCentroCosto = data.elementos;
                          $scope.objetos.centrocosto.getGrafica();
                      }
                      else { console.log(data); }
                      
                     
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data); 
                  });
                /************************************/
                $http.post('/Auditoria/getInforme', { informe: 'byusuario', auditorias: $scope.objetos.informe.activa.auditorias, auditores: $scope.objetos.informe.activa.auditores, periodos: $scope.objetos.informe.activa.periodos, ceccos: $scope.objetos.informe.activa.ceccos }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                          $scope.objetos.informe.byUsuario = data.elementos;

                      }
                      else { console.log(data); }


                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });
                /************************************/
                $http.post('/Auditoria/getInforme', { informe: 'bycategorias', auditorias: $scope.objetos.informe.activa.auditorias, auditores: $scope.objetos.informe.activa.auditores, periodos: $scope.objetos.informe.activa.periodos, ceccos: $scope.objetos.informe.activa.ceccos }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                          $scope.objetos.informe.byCategorias = data.elementos;
                          $scope.objetos.categoria.getGrafica();
                      }
                      else { console.log(data); }


                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });
                /************************************/
                $http.post('/Auditoria/getInforme', { informe: 'byobservaciones', auditorias: $scope.objetos.informe.activa.auditorias, auditores: $scope.objetos.informe.activa.auditores, periodos: $scope.objetos.informe.activa.periodos, ceccos: $scope.objetos.informe.activa.ceccos }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                          $scope.objetos.informe.byObservaciones = data.elementos;
                          console.log(data);
                      }
                      else { console.log(data); }


                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });
            },
            activa: {
                auditorias: '',
                periodos: '',
                ceccos: '',
                auditores: ''
            },
            consultar: function ()
            {
                $scope.objetos.informe.activa.periodos='';
                $scope.objetos.informe.activa.auditorias='';
                $scope.objetos.informe.activa.auditores='';
                $scope.objetos.informe.activa.ceccos = '';

                /*LLENAR LISTAS DELIMITADAS POR COMA*/
                //periodos
                angular.forEach($scope.objetos.periodo.lista, function (obj, key) {

                    if (obj.estado)
                    {
                        $scope.objetos.informe.activa.periodos = $scope.objetos.informe.activa.periodos + "'" + obj.id + "',";
                    }
                });
                //auditorias
                angular.forEach($scope.objetos.auditoria.lista, function (obj, key) {

                    if (obj.estado) {
                        $scope.objetos.informe.activa.auditorias = $scope.objetos.informe.activa.auditorias + obj.id + ',';
                    }
                });
                //usuarios
                angular.forEach($scope.objetos.usuario.lista, function (obj, key) {

                    if (obj.estado) {
                        $scope.objetos.informe.activa.auditores = $scope.objetos.informe.activa.auditores + obj.id + ',';
                    }
                });
                //centrosdecosto
                angular.forEach($scope.objetos.centrocosto.lista, function (obj, key) {

                    if (obj.estado) {
                        $scope.objetos.informe.activa.ceccos = $scope.objetos.informe.activa.ceccos + obj.id + ',';
                    }
                });

                if ($scope.objetos.informe.activa.ceccos != '' && $scope.objetos.informe.activa.auditorias != '' && $scope.objetos.informe.activa.auditores != '' && $scope.objetos.informe.activa.ceccos != '') {
                    $scope.objetos.informe.obtener();
                }
                else
                { alert('Falta escoger filtros.'); }
   




            },
            exportar: function ()
            {

                /*LLENAR LISTAS DELIMITADAS POR COMA*/
                //periodos
                angular.forEach($scope.objetos.periodo.lista, function (obj, key) {

                    if (obj.estado) {
                        $scope.objetos.informe.activa.periodos = $scope.objetos.informe.activa.periodos + "'" + obj.id + "',";
                    }
                });

                location.href = '/Auditoria/getInformeExcel?periodos=' + $scope.objetos.informe.activa.periodos;
               // window.open('/Auditoria/getInformeExcel?periodos=' + $scope.objetos.informe.activa.periodos, 'popup', 'width=300,height=400');

               /* $http.get('/Auditoria/getInforme', { informe: 'bycentroscosto', auditorias: $scope.objetos.informe.activa.auditorias, auditores: $scope.objetos.informe.activa.auditores, periodos: $scope.objetos.informe.activa.periodos, ceccos: $scope.objetos.informe.activa.ceccos }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                          $scope.objetos.informe.byCentroCosto = data.elementos;
                          $scope.objetos.centrocosto.getGrafica();
                      }
                      else { console.log(data); }


                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });*/
            }
        },
        categoria:
        {
            lista:[],
            getDataGrafica: function (tipo) {
                var temp = [];
                var tempClasificacion = [];
                var sum = 0;
                var cant = 1;
                var catTemp = '';

                angular.forEach($scope.objetos.informe.byCategorias, function (value, key) {

                    //por clasificacion
                    tempClasificacion.push({ name: value.clasificacion, data: [value.calificacion], categoria: value.categoria });

                    //agrupamos por categoria
                    if (catTemp != value.categoria) {

                        if (catTemp != '') {
                            temp.push({ name: catTemp, data: [sum / cant]});
                            sum = value.calificacion;
                            cant = 1;
                        }
                        else
                        {
                            sum = value.calificacion;
                            cant = 1;
                        }

                        catTemp = value.categoria;
                        
                    }
                    else
                    {
                        sum = sum + value.calificacion;
                        cant = cant + 1;
                    }

                    

                });

                temp.push({ name: catTemp, data: [sum / cant] });

         
                switch (tipo) {
                    case "categoria":
                        return temp;
                        break;
                    case "clasificacion":
                        return tempClasificacion;
                        break;

                    default:
                        return [];
                        break;

                }

                
            },
            getGrafica: function () {
        
                $scope.objetos.categoria.lista = $scope.objetos.categoria.getDataGrafica("categoria");
               


                $('#categorias').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Indicador por Categorias'
                    },
                    xAxis: {
                        categories: [
                            '%'

                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Porcentaje (%)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
                    series: $scope.objetos.categoria.lista
                });

               
            },
            activa: '',
            filtrarGrafica: function ()
            {
                $('#clasificacion').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Indicador por Clasificación'
                    },
                    xAxis: {
                        categories: [
                            '%'

                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Porcentaje (%)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
                    series: $filter('filter')($scope.objetos.categoria.getDataGrafica("clasificacion"), { categoria: $scope.objetos.categoria.activa })
                });
            }
        },
        clasificacion:
        {
            lista: [],
            activa: {}
        },
        filtro: {
            notificacion:{estado:false,msg:'Cargando...'}
        },
        utils: {
            seleccionMultiple: function (objeto)
            {
                angular.forEach($scope.objetos[objeto].lista, function (obj, key) {
                    if ($scope.objetos[objeto].seleccionMultiple) {
                        obj.estado = true;
                    }
                    else
                    {
                        obj.estado = false;
                    }
                }, $scope.objetos[objeto].lista);
            }
        }
    };


    $scope.objetos.auditoria.obtener();
    $scope.objetos.periodo.obtener();
    $scope.objetos.centrocosto.obtener();
    $scope.objetos.usuario.obtener();
  

   
   

});