//validaciones

//angular
var app = angular.module('app', []);
app.controller('appCtrl', function ($scope, $http, $filter) {
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
        plantilla:{
            lista: [],
            activa: { id: 0 },
            filtro:{},
            obtener:function(){
                $http.post('/GestionDatos/getPlantillas', {  }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
                        
                          $scope.objetos.plantilla.lista = data.elementos;
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
            seleccionar: function (plantilla) {
                if ($scope.objetos.plantilla.activa.id == 0)
                {
                    $scope.objetos.plantilla.activa = plantilla;

                    $scope.objetos.excel.cargarColumnas('nombre', $scope.objetos.plantilla.activa.Conceptos);
                    $scope.objetos.excel.cargarControl();

                    var nuevaLista = [];
                    nuevaLista.push(plantilla);
                    $scope.objetos.plantilla.lista = nuevaLista;
                }

                

            }
        },
        excel: {
            contenedor: {},
            handsone: {},
            colsHeaders:[],
            colsDefine: [],
            rowsData:[],
            cargarControl: function () {

         
                $scope.objetos.excel.contenedor = document.getElementById('gridExcel');



                $scope.objetos.excel.handsone = new Handsontable($scope.objetos.excel.contenedor,
                 {
                     colHeaders: $scope.objetos.excel.colsHeaders,
                     data: $scope.objetos.excel.rowsData,
                     columns: $scope.objetos.excel.colsDefine
                  
                 });
            },
            cargarColumnas:function(parametro,arreglo){

                var row = [];

                angular.forEach(arreglo, function (value, key) {
                    $scope.objetos.excel.colsHeaders.push(value[parametro]);
                    $scope.objetos.excel.colsDefine.push({});
                    row.push('[ ' + value['ejemplo']+ ' ]');
                });

                $scope.objetos.excel.rowsData.push(row);
               
            }
        },
        origen: {
            activa: { id: 0, descripcion: '' },
            cargarDatos: function () {
                var envio = [];

              

                //recolectamos datos y validamos tipos de datos
                angular.forEach($scope.objetos.excel.rowsData, function (dValor, dKey) {
                    var reg = {};
                    reg["CARGUE"] = "";
                    reg["CARGUEOK"] = true;
                    //recorremos columnas
                    angular.forEach($scope.objetos.plantilla.activa.Conceptos, function (cValor, cKey) {

                        var valida = $scope.objetos.origen.validaDato(cValor.tipoDato, dValor[cKey]);

                        if (!valida.estado) {
                            reg["CARGUE"] += " | " + "[" + cValor.nombre + "]" + valida.msg;
                            reg["CARGUEOK"]=false;
                        }
                        
                        reg[cValor.nombre] = dValor[cKey];
                    });

                    envio.push(reg);
                    
                });

                //enviamos datos recolectados sin errores

                console.log(envio);
                console.log($filter('filter')(envio, {CARGUEOK:true}));
               

                console.log($scope.objetos.origen.activa);

            },
            validaDato: function (tipoDato, valor)
            {
                var res = {};
                switch (tipoDato) {
                    case "NUMERO":
                        res.estado = !isNaN(valor.replace(',','.'));
                        res.msg = "No es númerico";
                        break;
                    default:
                        res.estado = (valor === undefined || valor == null || valor.length <= 0) ? false : true;
                        res.msg = "Vacio";
                        break;
                }

                return res;
            }
        }
    

    };

    $scope.formato = {};
    $scope.formato.fecha = function (fecha) {
        var re = /-?\d+/;
        var m = re.exec(fecha);
        var d = new Date(parseInt(m));
        return $.datepicker.formatDate("dd/mm/yy", d);
    };

    $scope.objetos.plantilla.obtener();

});