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
        documentacion: {
            lista: [],
            activa: {},
            temp: {},
            filtro:{},
            obtener: function () {
                $http.post('/Documentos/getDocumentacionLista', {}).
               success(function (data, status, headers, config) {
                   // this callback will be called asynchronously
                   // when the response is available
                   if (data.estado) {
                       $scope.objetos.documentacion.lista = data.elementos;
                   }
                   else
                   {
                       alert(data.error);
                   }
                   
               }).
               error(function (data, status, headers, config) {
                   // called asynchronously if an error occurs
                   // or server returns response with an error status.
                   console.log(data);
               });

            },
            agregarFila: function () {
                $scope.objetos.documentacion.lista.unshift({ id: 0, codigo:'', edit: true, Archivo: {id:0,nombre:'-- Seleccionar --'}, Estado: {id:1,descripcion:'Activo'}});
            },
            cancelarFila: function (pos, registro) {
                if (registro.id == 0)
                    $scope.objetos.documentacion.lista.splice(pos, 1);
                else
                    registro.edit = false;
                
            },
            cambiarEstado: function (registro) {
                if (registro.Estado.id == 1) {
                    registro.Estado.id = 2;
                    registro.Estado.descripcion = 'Inactivo';
                }
                else
                {
                    registro.Estado.id = 1;
                    registro.Estado.descripcion = 'Activo';
                }

                $http.post('/Documentos/updateStateDocumentacion', registro).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                      if (data.estado) {
                          $scope.funciones.alertNotification("Actualizado", "Asignación cambio de estado", "success");
                           
                      }
                      else {

                          $scope.funciones.alertNotification("Error", data.error, "error");

                          if (registro.Estado.id == 1) {
                              registro.Estado.id = 2;
                              registro.Estado.descripcion = 'Inactivo';
                          }
                          else {
                              registro.Estado.id = 1;
                              registro.Estado.descripcion = 'Activo';
                          }

                      }

                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });

            },
            seleccionarArchivo: function (archivo) {
                $scope.objetos.documentacion.temp.Archivo = archivo;
            },
            guardarDocumentacion: function (doc) {

                if (doc.Archivo.id == 0)
                {
                    $scope.funciones.alertNotification("Error", "Debe escogerse un archivo asociado.", "danger");
                    return;
                }

                if (doc.codigo == null || doc.codigo == '')
                {
                    $scope.funciones.alertNotification("Error", "Debe ingresar un código valido.", "danger");
                    return;
                }

                $http.post('/Documentos/updateDocumentacion', doc).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                      if (data.estado) {
                
                          doc.edit = false;
                          $scope.funciones.alertNotification("Actualizado", "", "success");
                      }
                      else {
  
                          $scope.funciones.alertNotification("Error", data.error, "danger");
                      }

                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                  });

                
            }
        },
        biblioteca: {
            carpetas: [],
            archivos: [],
            carpeta: {},
            vista: 'carpeta',
            seleccionarCarpeta: function (carpeta) {
                $scope.objetos.biblioteca.carpeta = carpeta;
                $scope.objetos.biblioteca.vista = 'archivo';
                $scope.objetos.biblioteca.actualizarArchivos();
            },
            actualizarArchivos: function () {

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
            actualizarCarpetas: function () {
                $scope.objetos.biblioteca.vista = 'carpeta';
                $http.post('/Documentos/getCarpetas', {}).
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
            crearCarpeta: function (objeto) {
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
            eliminarCarpeta: function (objeto) {
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
            eliminaArchivo: function (objeto) {

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
            alertaCarpeta: {
                estado: false,
                tipo: '',
                titulo: '',
                mensaje: ''
            },
            archivoReemplaza: {},
            reemplazar: function (obj) {
                $scope.objetos.biblioteca.archivoReemplaza = obj;
            },
            archivoCompartido: {},
            compartirArchivo: function (obj) {
                $scope.objetos.biblioteca.archivoCompartido = obj;
            },
            limpiarfecha: function (fecha) {
                var re = /-?\d+/;
                var m = re.exec(fecha);
                var d = new Date(parseInt(m));
                return $.datepicker.formatDate("dd/mm/yy", d);

            },
            usuarios: [],
            lista: [],
            obtenerLista: function () {
                if ($scope.objetos.biblioteca.vista == 'carpeta') {
                    $scope.objetos.biblioteca.lista = $scope.objetos.biblioteca.carpetas;
                }
                else {
                    $scope.objetos.biblioteca.lista = $scope.objetos.biblioteca.archivos;
                }
            },
            obtenerIconFile: function (ext) {
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
            verArchivo: function (url, ext) {
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
                        text = "<iframe src='" + url.replace("ift", "html") + "' ></iframe>";
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
    };

    //init
    $scope.objetos.documentacion.obtener();

    $scope.objetos.biblioteca.actualizarCarpetas();
    if ($scope.objetos.biblioteca.carpetas.length > 0) {
        $scope.objetos.biblioteca.seleccionarCarpeta($scope.objetos.biblioteca.carpetas[0]);
    };
    $scope.filtroArchivos = { cantidad: 100, texto: '' };
});