

var app = angular.module('appArchivo', []);

app.controller('appArchivoCtrl', function ($scope, $http) {

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
        biblioteca: {
            carpetas: [],
            archivos: [],
            carpeta: {},
            vista: 'carpeta',
            seleccionarCarpeta : function (carpeta) {
                $scope.objetos.biblioteca.carpeta = carpeta;
                $scope.objetos.biblioteca.vista = 'archivo';
                $scope.objetos.biblioteca.actualizarArchivos();
            },
            actualizarArchivos : function () {

                $http.post('/Documentos/getArchivos', { carpeta: $scope.objetos.biblioteca.carpeta, filtro: $scope.filtroArchivos }).
                 success(function (data, status, headers, config) {
                     // this callback will be called asynchronously
                     // when the response is available
     
                     $scope.objetos.biblioteca.lista = data;
                 }).
                 error(function (data, status, headers, config) {
                     // called asynchronously if an error occurs
                     // or server returns response with an error status.
                     console.log(data);
                 });
            },
            actualizarCarpetas : function () {
                $scope.objetos.biblioteca.vista = 'carpeta';
                $http.post('/Documentos/getCarpetas', {  }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                      $scope.objetos.biblioteca.lista = data;
                      $scope.objetos.biblioteca.carpetas = data;
              
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });
            },
            crearCarpeta:function(objeto)
            {
                $http.post('/Documentos/createCarpeta', objeto).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                      //$scope.newCarpeta.nombre = "";
                      objeto.nombre = "";
                      $scope.objetos.biblioteca.actualizarCarpetas();
                      $scope.funciones.alertNotification("Procesado", "Carpeta creada correctamente.", "success");
            
                  }).
                  error(function (data, status, headers, config) {
                      alert(data);
                  });
            },
            actualizarCarpeta: function (objeto) {

                $http.post('/Documentos/updateCarpeta', objeto).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
              
                      // $scope.objetos.biblioteca.actualizarCarpetas();
                      $scope.funciones.alertNotification("Procesado", "Carpeta Actualizada correctamente.", "success");
            

                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      $scope.funciones.alertNotification("Error", data, "danger");
                  });
            },
            eliminarCarpeta : function (objeto) {
                if (confirm("Desea eliminar la carpeta " + objeto.nombre + "?")) {
                    $http.post('/Documentos/deleteCarpeta', objeto).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                    
                            $scope.objetos.biblioteca.actualizarCarpetas();

                            $scope.funciones.alertNotification("Procesado", "Carpeta Eliminada correctamente.", "success");
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            $scope.funciones.alertNotification("Error", data, "danger");
                        });
                }

            },
            eliminaArchivo : function (objeto) {
        
                if (confirm("Desea eliminar el archivo " + objeto.nombre + "?")) {
                    $http.post('/Documentos/deleteArchivo', objeto).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
          
                            $scope.objetos.biblioteca.actualizarArchivos();
                            $scope.funciones.alertNotification("Procesado", "Archivo Eliminado correctamente.", "success");
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log(data);
                        });
                }

            },
            alertaCarpeta : {
                estado: false,
                tipo: '',
                titulo: '',
                mensaje:''
            },
            archivoReemplaza : {},
            reemplazar : function (obj) {
                $scope.objetos.biblioteca.archivoReemplaza = obj;
            },
            archivoCompartido : {},
            compartirArchivo : function (obj)
            {
                $scope.objetos.biblioteca.archivoCompartido = obj;
            },
            limpiarfecha : function (fecha) {
                var re = /-?\d+/;
                var m = re.exec(fecha);
                var d = new Date(parseInt(m));
                return $.datepicker.formatDate("dd/mm/yy", d);
   
            },
            usuarios : [],
            lista : [],
            obtenerLista : function () {
                if ($scope.objetos.biblioteca.vista == 'carpeta')
                {
                    $scope.objetos.biblioteca.lista = $scope.objetos.biblioteca.carpetas;
                }
                else
                {
                    $scope.objetos.biblioteca.lista = $scope.objetos.biblioteca.archivos;
                }
            },
            obtenerIconFile : function (ext)
            {
                switch (ext) {
                    case 'xlsx':
                        return 'fa fa-file-excel-o';
                        break;
                    case 'xlsm':
                        return 'fa fa-file-excel-o';
                        break;
                    case 'docx':
                        return 'fa fa-file-word-o';
                        break;
                    case 'doc':
                        return 'fa fa-file-word-o';
                        break;
                    case 'xls':
                        return 'fa fa-file-excel-o';
                        break;
                    case 'pdf':
                        return 'fa fa-file-pdf-o';
                        break;
                    default:
                        return 'fa fa-file-text-o';
                        break;
                }
            },
            verArchivo:function(url,ext)
                {
                    var text = '';
        

                    switch (ext) {
                        case 'jpg':
                            text = "<img src='" + url + "' />";
                            url = '';
                            break;
                        case 'png':
                            text = "<img src='" + url + "' />";
                            url = '';
                            break;
                        case 'ift':
                            text = "<iframe src='" + url.replace("ift","html") + "' ></iframe>";
                            url = '';
                            break;
                        case 'htm':
                            text = "<iframe src='" + url.replace("ift", "html") + "' style='width:100%;height:500px'></iframe>";
                            url = '';
                            break;
                        default:
                            url = 'https://docs.google.com/viewer?url=' + url;
                            break;

                    }

     
                    var myWindow = window.open(url, this.target, 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no');
                    myWindow.document.write(text);

                    return false;
            },
            exportarExcel: function () {
                window.open('data:application/vnd.ms-excel,' + '<tr><td>1</td><td>2</td></tr>');
                e.preventDefault();
            }
            }

        }

    $scope.objetos.biblioteca.actualizarCarpetas();
    if ($scope.objetos.biblioteca.carpetas.length > 0)
    {
        $scope.objetos.biblioteca.seleccionarCarpeta($scope.objetos.biblioteca.carpetas[0]);
    };
    $scope.filtroArchivos = { cantidad: 100, texto: '' };
    /*$scope.objetos.biblioteca.carpetas = [

    ];
    $scope.objetos.biblioteca.archivos = [
       
    ];
    $scope.objetos.biblioteca.carpeta = {};
    $scope.objetos.biblioteca.vista = 'carpeta';*/
   
   /* $scope.objetos.biblioteca.seleccionarCarpeta = function (carpeta) {
        $scope.objetos.biblioteca.carpeta = carpeta;
        $scope.objetos.biblioteca.vista = 'archivo';
        $scope.objetos.biblioteca.actualizarArchivos();
    };

    --
    $scope.objetos.biblioteca.actualizarArchivos = function () {

        $http.post('/Documentos/getArchivos', { carpeta: $scope.objetos.biblioteca.carpeta, filtro: $scope.filtroArchivos }).
         success(function (data, status, headers, config) {
             // this callback will be called asynchronously
             // when the response is available
     
             $scope.objetos.biblioteca.lista = data;
         }).
         error(function (data, status, headers, config) {
             // called asynchronously if an error occurs
             // or server returns response with an error status.
             console.log(data);
         });
    };
    $scope.objetos.biblioteca.actualizarCarpetas = function () {
        $scope.objetos.biblioteca.vista = 'carpeta';
        $http.post('/Documentos/getCarpetas', {  }).
          success(function (data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.objetos.biblioteca.lista = data;
              $scope.objetos.biblioteca.carpetas = data;
              
          }).
          error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(data);
          });
    };
    $scope.objetos.biblioteca.crearCarpeta=function(objeto)
    {
        $http.post('/Documentos/createCarpeta', objeto).
          success(function (data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              //$scope.newCarpeta.nombre = "";
              objeto.nombre = "";
              $scope.objetos.biblioteca.actualizarCarpetas();
              $scope.funciones.alertNotification("Procesado", "Carpeta creada correctamente.", "success");
            
          }).
          error(function (data, status, headers, config) {
              alert(data);
          });
    }
    $scope.objetos.biblioteca.actualizarCarpeta = function (objeto) {
        $http.post('/Documentos/updateCarpeta', objeto).
          success(function (data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              
             // $scope.objetos.biblioteca.actualizarCarpetas();
              $scope.funciones.alertNotification("Procesado", "Carpeta Actualizada correctamente.", "success");
            

          }).
          error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $scope.funciones.alertNotification("Error", data, "danger");
          });
    }
    $scope.objetos.biblioteca.eliminarCarpeta = function (objeto) {
        if (confirm("Desea eliminar la carpeta " + objeto.nombre + "?")) {
            $http.post('/Documentos/deleteCarpeta', objeto).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    
                    $scope.objetos.biblioteca.actualizarCarpetas();

                    $scope.funciones.alertNotification("Procesado", "Carpeta Eliminada correctamente.", "success");
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.funciones.alertNotification("Error", data, "danger");
                });
        }

    };
    $scope.objetos.biblioteca.eliminaArchivo = function (objeto) {
        
        if (confirm("Desea eliminar el archivo " + objeto.nombre + "?")) {
            $http.post('/Documentos/deleteArchivo', objeto).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
          
                    $scope.objetos.biblioteca.actualizarArchivos();
                    $scope.funciones.alertNotification("Procesado", "Archivo Eliminado correctamente.", "success");
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(data);
                });
        }

    };
    $scope.objetos.biblioteca.alertaCarpeta = {
        estado: false,
        tipo: '',
        titulo: '',
        mensaje:''
    };
    $scope.objetos.biblioteca.archivoReemplaza = {};
    $scope.objetos.biblioteca.reemplazar = function (obj) {
        $scope.objetos.biblioteca.archivoReemplaza = obj;
    }
    $scope.objetos.biblioteca.archivoCompartido = {};
    $scope.objetos.biblioteca.compartirArchivo = function (obj)
    {
        $scope.objetos.biblioteca.archivoCompartido = obj;
    }
    $scope.objetos.biblioteca.limpiarfecha = function (fecha) {
        var re = /-?\d+/;
        var m = re.exec(fecha);
        var d = new Date(parseInt(m));
        return $.datepicker.formatDate("dd/mm/yy", d);
   
    }
    
    $scope.objetos.biblioteca.usuarios = [];
    $scope.objetos.biblioteca.lista = [];
    $scope.objetos.biblioteca.obtenerLista = function () {
        if ($scope.objetos.biblioteca.vista == 'carpeta')
        {
            $scope.objetos.biblioteca.lista = $scope.objetos.biblioteca.carpetas;
        }
        else
        {
            $scope.objetos.biblioteca.lista = $scope.objetos.biblioteca.archivos;
        }
    }
    $scope.objetos.biblioteca.actualizarCarpetas();
    $scope.objetos.biblioteca.obtenerIconFile = function (ext)
    {
        switch (ext) {
            case 'xlsx':
                return 'fa fa-file-excel-o';
                break;
            case 'xlsm':
                return 'fa fa-file-excel-o';
                break;
            case 'docx':
                return 'fa fa-file-word-o';
                break;
            case 'doc':
                return 'fa fa-file-word-o';
                break;
            case 'xls':
                return 'fa fa-file-excel-o';
                break;
            case 'pdf':
                return 'fa fa-file-pdf-o';
                break;
            default:
                return 'fa fa-file-text-o';
                break;
        }
    }
    $scope.objetos.biblioteca.verArchivo=function(url,ext)
    {
        var text = '';
        

        switch (ext) {
            case 'jpg':
                text = "<img src='" + url + "' />";
                url = '';
                break;
            case 'png':
                text = "<img src='" + url + "' />";
                url = '';
                break;
            case 'ift':
                text = "<iframe src='" + url.replace("ift","html") + "' ></iframe>";
                url = '';
                break;
            default:
                url = 'https://docs.google.com/viewer?url=' + url;
                break;

        }

     
        var myWindow = window.open(url, this.target, 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no');
        myWindow.document.write(text);

         return false;
    }
    if ($scope.objetos.biblioteca.carpetas.length > 0)
    {
        $scope.objetos.biblioteca.seleccionarCarpeta($scope.objetos.biblioteca.carpetas[0]);
    }*/

 
   
});