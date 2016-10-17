var app = angular.module('app', []);
app.controller('appCtrl', function ($scope, $http) {
    $scope.tmp = { usuario: userID, auditoria: codeAuditoria, centroCosto: codeCentroCosto, item: codeItem };

    $scope.func = {
        fechaFormato: function (fecha) {
            var f = fecha.split('/');

            return f[2] + '-' + f[1] + '-' + f[0];

        }
    };

    $scope.objetos = {
        centrocosto: {
            lista: [],
            activo: { id: 0 },
            obtener: function () {
                
                    $http.post('/Administracion/getCentroCosto', { modulo: {id:4}}).
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
        auditoria: {
            lista: [],
            activo: { id: 0 },
            obtener: function () {
                $http.post('/Auditoria/getAuditoriaUsuario', {}).
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
        item: {
            lista: [],
            activo: {id:0},
            obtener: function () {
                $http.post('/Auditoria/getItem', {auditoria:$scope.objetos.auditoria.activo}).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                            $scope.objetos.item.lista = data.elementos;
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
        documento: {
            lista: [],
            activo:{id:0},
            obtener: function () {
                if ($scope.objetos.item.activo.id != 0 && $scope.objetos.centrocosto.id != 0)
                {
                    $scope.objetos.documento.activo = { id: 0 };
                    $http.post('/Auditoria/getDocumentoItem', { item: $scope.objetos.item.activo, centrocosto: $scope.objetos.centrocosto.activo }).
                      success(function (data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available

                          if (data.estado) {
                              $scope.objetos.documento.lista = data.elementos;
                             //console.log(data.elementos);
                              $scope.objetos.documento.graficar();
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
            graficar: function () {
                var neg_data = [];
                angular.forEach($scope.objetos.documento.lista, function (val, key) {
                    neg_data.push({ period: $scope.func.fechaFormato(val.fechaFormato), a: val.Items[0].Calificaciones[0].valor * 100 });
      
                });

                if ($('#graph-B').length) {
                    Morris.Line({
                        element: 'graph-B',
                        data: neg_data,
                        xkey: 'period',
                        ykeys: ['a'],
                        labels: ['Calificación'],
                        hideHover : 'auto',
                        units: '%'
                    });
                }
            }
        },
        comentario: {
            lista: [],
            activo: { Archivo: {id:0,nombre:'+ Adjuntar'}},
            obtener: function () {
                $http.post('/Auditoria/consultarComentario', { id: $scope.objetos.documento.activo.Items[0].id}).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    if (data.estado) {
                        $scope.objetos.comentario.lista = data.elementos;
                        
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
            obtenerById: function (id) {
                $http.post('/Auditoria/consultarComentario', { id: id}).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    if (data.estado) {
                        $scope.objetos.comentario.lista = data.elementos;
                        console.log($scope.objetos.comentario.lista[0]);
                        $scope.objetos.item.activo = $scope.objetos.comentario.lista[0].Item;
                       
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
            comentar: function () {
                $scope.objetos.comentario.activo.Item = $scope.objetos.documento.activo.Items[0];
                $http.post('/Auditoria/comentar', { comentario: $scope.objetos.comentario.activo }).
                              success(function (data, status, headers, config) {
                                  // this callback will be called asynchronously
                                  // when the response is available

                                  if (data.estado) {
                                      //$scope.objetos.comentario.lista = data.elementos;
                                      $scope.objetos.comentario.obtener();
                                      $scope.objetos.comentario.activo = { Archivo: { id: 0, nombre: '+ Adjuntar' } };
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
            enviar: function () {

            },
            eliminar: function (cm) {
                if (confirm("Desea eliminar el comentario: " + cm.comentario + "?")) {
                    $http.post('/Auditoria/eliminarComentario', { comentario: cm }).
                    success(function (data, status, headers, config) {

                        if (data.estado) {
                            $scope.objetos.comentario.obtener();
                        }
                        else {
                            console.log(data);
                        }

                    }).
                    error(function (data, status, headers, config) {

                        console.log(data);
                    });
                }
                
            },
            adjuntar: function (archivo) {
                $scope.objetos.comentario.activo.Archivo = archivo;
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
                      console.log(data);
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
    


    //carga
    $scope.objetos.centrocosto.obtener();
    $scope.objetos.auditoria.obtener();



    //biblioteca
    $scope.objetos.biblioteca.actualizarCarpetas();
    if ($scope.objetos.biblioteca.carpetas.length > 0) {
        $scope.objetos.biblioteca.seleccionarCarpeta($scope.objetos.biblioteca.carpetas[0]);
    };
    $scope.filtroArchivos = { cantidad: 100, texto: '' };


    //consultamos item
    if ($scope.tmp.item != "")
    {

        $scope.objetos.auditoria.activo.id = $scope.tmp.auditoria;
        $scope.objetos.item.obtener();
        $scope.objetos.centrocosto.activo.id = $scope.tmp.centroCosto;
        $scope.objetos.item.activo.id = $scope.tmp.item;
        $scope.objetos.documento.obtener();

       // $scope.objetos.comentario.obtenerById($scope.tmp.itemCalificado);
    }
        
});