var app = angular.module('appGeneral', []);

app.controller('appGeneralCtrl', function ($scope, $http, $sce) {
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
        tabla: {
            activa:{},
            lista: [
                { id: 1, nombre: 'Empleados', valida: '/herramientas/cm_empleados_valida', cargue: '/RRHH/createEmpleado', funcion: 'tb_empleados' },
                { id: 2, nombre: 'Certificados - CMO', valida: '/herramientas/cm_certificadosCMO_valida', cargue: '/Hseq/createCertificado', funcion: 'tb_certificadosCMO' }
            ],
            cargarControles: function ()
            {
                //dataExcel = $scocpe.objetos[$scope.objetos.tabla.activa.funcion].campos;
                $scope.objetos.excel.contenedor = document.getElementById('gridExcel');



                $scope.objetos.excel.handsone = new Handsontable($scope.objetos.excel.contenedor,
                 {
                     colHeaders: $scope.objetos[$scope.objetos.tabla.activa.funcion].cols,
                     data: $scope.objetos[$scope.objetos.tabla.activa.funcion].data,
                     columns: $scope.objetos[$scope.objetos.tabla.activa.funcion].columns
                 });


              
            },
            validado: false,
            cantValidado: 0,
            cantValidadoError:0,
            cantInsertado:0,
            validar: function (obj, key, col) {
                $scope.objetos[$scope.objetos.tabla.activa.funcion].lista = [];

                $http.post($scope.objetos.tabla.activa.valida, obj).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available
            
                      

                       if(data.estado)
                       {
                           $scope.objetos[$scope.objetos.tabla.activa.funcion].data[key][col]='CORRECTO';
                       }
                       else
                       {
                           $scope.objetos.tabla.cantValidadoError++;
                           $scope.objetos[$scope.objetos.tabla.activa.funcion].data[key][col] = 'ERRONEO - ' + data.msg;
                       }
 
                       $scope.objetos.tabla.cantValidado++;
                       data.key = key;
                       $scope.objetos[$scope.objetos.tabla.activa.funcion].lista.push(data);
                       $scope.objetos.excel.handsone.loadData($scope.objetos[$scope.objetos.tabla.activa.funcion].data);
                   }).
                   error(function (data, status, headers, config) {
                       // called asynchronously if an error occurs
                       // or server returns response with an error status.

                       $scope.objetos[$scope.objetos.tabla.activa.funcion].data[key][col] = 'ERROR - ' + data;
                       $scope.objetos.excel.handsone.loadData($scope.objetos[$scope.objetos.tabla.activa.funcion].data);
                   });
            },
            cargar: function (obj, key, col) {
                

                $http.post($scope.objetos.tabla.activa.cargue, obj).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.objetos[$scope.objetos.tabla.activa.funcion].data[key][col] = 'CARGADO';
                       }
                       else {
                          
                           $scope.objetos[$scope.objetos.tabla.activa.funcion].data[key][col] = 'ERROR - ' + data;
                       }

                       $scope.objetos.tabla.cantInsertado++;

                       $scope.objetos.excel.handsone.loadData($scope.objetos[$scope.objetos.tabla.activa.funcion].data);
                   }).
                   error(function (data, status, headers, config) {
                       // called asynchronously if an error occurs
                       // or server returns response with an error status.

                       $scope.objetos[$scope.objetos.tabla.activa.funcion].data[key][col] = 'ERROR - ' + data;
                       $scope.objetos.excel.handsone.loadData($scope.objetos[$scope.objetos.tabla.activa.funcion].data);
                   });
            },
            limpiarTabla: function () {

                location.reload();
                $scope.objetos.excel.handsone.loadData([[]]);
                $scope.objetos.tabla.validado = false;
                $scope.objetos.tabla.cantValidado = 0;
                $scope.objetos.tabla.cantValidadoError = 0;
                $scope.objetos[$scope.objetos.tabla.activa.funcion].data = [[]];
            }
        },
        excel: {
            contenedor: {},
            handsone: {}

        },
        tb_empleados: {
            objeto: {
                id: 0,
                Usuario: { id: 0,username:'' },
                TipoIdentificacion: { prefijo: '' },
                identificacion: '',
                nombres: '',
                apellidos: '',
                fechaNacimiento: '',
                Estado: { id: 1 }
            },
            lista:[],
            cols: ['USUARIO', 'NOMBRES', 'APELLIDOS', 'TIPO IDENTIFICACION', 'NUMERO IDENTIFICACION', 'FECHA NACIMIENTO', 'RESULTADO VALIDACION', 'RESULTADO CARGUE'],
            data: [[]],
            columns: [{}, {}, {}, {}, {}, {}, { readOnly: true }, { readOnly: true }],
            validar: function () {
               
                $scope.objetos[$scope.objetos.tabla.activa.funcion].lista = [];

                angular.forEach($scope.objetos.tb_empleados.data, function (fila, key) {
                    
                    var obj = angular.copy($scope.objetos.tb_empleados.objeto);

                    
                        //VALIDACIONES
                        //-- usuario:
                        if (String(fila[0]) != '')
                        {
                            obj.Usuario.username = fila[0];
                        }
                        //-- todos:
                        obj.nombres = String(fila[1]).trim();
                        obj.apellidos = String(fila[2]).trim();
                        obj.TipoIdentificacion.prefijo = String(fila[3]).trim();
                        obj.identificacion = String(fila[4]).trim();
                        obj.fechaNacimiento = String(fila[5]).trim();
    

                        //$scope.objetos.tabla.validar(): objeto - key array - columna resultados 
                        $scope.objetos.tabla.validar(obj,key,6);
                    


                    
                });

                $scope.objetos.tabla.validado = true;
                
            },
            cargar: function () {

                angular.forEach($scope.objetos[$scope.objetos.tabla.activa.funcion].lista, function (reg, key) {

                    if (reg.estado)
                    {
                        //corregimos fecha
                        reg.objeto.fechaNacimiento = reg.objeto.fechaNacimientoString;

                        //$scope.objetos.tabla.cargar(): objeto - key array - columna resultados 
                        $scope.objetos.tabla.cargar(reg.objeto, reg.key, 7);
                    }



                });
            }
        },
        tb_certificadosCMO: {
            objeto: {
                id: 0,
                fecha: '',
                Empleado: { id: 0, TipoIdentificacion: {prefijo:''},identificacion:'' },
                Formato: {nombre:''},
                Archivo: {nombre:'',extension:''}
            },
            lista: [],
            cols: ['CERTIFICADO', 'FECHA', 'TIPO IDENTIFICACION EMPLEADO', 'NUMERO IDENTIFICACION EMPLEADO', 'NOMBRE ARCHIVO','EXTENSION ARCHIVO', 'RESULTADO VALIDACION', 'RESULTADO CARGUE'],
            data: [[]],
            columns: [{}, {}, {}, {}, {}, {}, { readOnly: true }, { readOnly: true }],
            validar: function () {

                $scope.objetos[$scope.objetos.tabla.activa.funcion].lista = [];

                angular.forEach($scope.objetos.tb_certificadosCMO.data, function (fila, key) {

                    var obj = angular.copy($scope.objetos.tb_certificadosCMO.objeto);


                    //VALIDACIONES
                    //-- todos:
                    try {
                        obj.Formato.nombre= String(fila[0]).trim();
                        obj.fecha = String(fila[1]).trim();
                        obj.Empleado.TipoIdentificacion.prefijo = String(fila[2]).trim();
                        obj.Empleado.identificacion = String(fila[3]).trim();
                        obj.Archivo.nombre = String(fila[4]).trim();
                        obj.Archivo.extension = String(fila[5]).trim();
                    } catch (e) {
                        alert(e);
                    }
                   

                    


                    //$scope.objetos.tabla.validar(): objeto - key array - columna resultados 
                    $scope.objetos.tabla.validar(obj, key, 6);




                });

                $scope.objetos.tabla.validado = true;

            },
            cargar: function () {

                angular.forEach($scope.objetos[$scope.objetos.tabla.activa.funcion].lista, function (reg, key) {

                    if (reg.estado) {
                        //corregimos fecha
                        //reg.objeto.fechaNacimiento = reg.objeto.fechaNacimientoString;

                        //$scope.objetos.tabla.cargar(): objeto - key array - columna resultados 
                        $scope.objetos.tabla.cargar(reg.objeto, reg.key, 7);
                    }



                });
            }
        }
    };

});