
var app = angular.module('appArchivo', []);

app.controller('appArchivoCtrl', function ($scope, $http, $sce) {
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
        formato: {
            activo: { Archivo: {nombre:'-- Formato --'},Variables:[]},
            tipos: ['DINAMICO','DINAMICO-PDF','ARCHIVO']
                
        },
        variable: {
            activo: {},
            agregar: function () {
                $scope.objetos.formato.activo.Variables.push($scope.objetos.variable.activo);
                $scope.objetos.variable.activo = {};
            },
            remover: function (pos) {
                $scope.objetos.formato.activo.Variables.splice(pos, 1);
            }
        }, 
        carpeta: {
            activa:{},
            lista:[],
            obtener:function(){
                $http.post('/Documentos/getCarpetas', { }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      console.log(data);
                      $scope.objetos.carpeta.lista = data;
                     
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });
            }
        },
        archivo: {
                activa: {nombre:'-- Formato --'},
                lista: [],
                adjuntos: [],
                filtro: { cantidad: 100, texto: '' },
                obtener: function () {
                    $http.post('/Documentos/getArchivos', { carpeta: $scope.objetos.carpeta.activa, filtro: $scope.objetos.archivo.filtro }).
                           success(function (data, status, headers, config) {
                               // this callback will be called asynchronously
                               // when the response is available

                               $scope.objetos.archivo.lista = data;
                           }).
                           error(function (data, status, headers, config) {
                               // called asynchronously if an error occurs
                               // or server returns response with an error status.
                               console.log(data);
                           });
                },
                seleccionar: function (archivo) {
                    $scope.objetos.formato.activo.Archivo = archivo;
                }
            }
    };


    $scope.objetos.carpeta.obtener();

});