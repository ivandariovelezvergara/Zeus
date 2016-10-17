
var app = angular.module('appArchivo', []);
app.controller('appArchivoCtrl', function ($scope, $http) {
    
    $scope.objetos = {
        auditoria: {
            activa: { id: 0, nombre: '', Estado: { id: 1 } },
            indice: 0,
            temp: { id: 0, nombre: '', Estado: {id:1} },
            lista: [],
            lista_filtro: '',
            calificaciones_filtro: '',
            items_filtro: '',
            seleccionar: function (pos) {
                $scope.objetos.auditoria.activa = $scope.objetos.auditoria.lista[pos];
                $scope.objetos.auditoria.indice = pos;

            },
            crear: function () {
                $http.post('/Auditoria/createAuditoria', $scope.objetos.auditoria.temp).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if(data.estado)
                       {
                           $scope.alerta = {
                               estado: true,
                               tipo: 'alert-success',
                               titulo: 'Realizado',
                               mensaje: 'Auditoria creada correctamente.'
                           };
                           $scope.objetos.auditoria.temp = { id: 0, nombre: '', Estado: { id: 1 } };
                           $scope.objetos.auditoria.obtener();
                       }
                       else
                       {
                           $scope.alerta = {
                               estado: true,
                               tipo: 'alert-danger',
                               titulo: 'Error',
                               mensaje: data.error
                           };
                       }
                   }).
                   error(function (data, status, headers, config) {
                       // called asynchronously if an error occurs
                       // or server returns response with an error status.
                       console.log(data);
                   });
            },
            eliminar: function () {
                if(confirm("Desea eliminar la auditoria " + $scope.objetos.auditoria.activa.nombre))
                {
                    $http.post('/Auditoria/deleteAuditoria', $scope.objetos.auditoria.activa).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Auditoria eliminada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
                }
            },
            obtener: function () {
                $http.post('/Auditoria/getAuditoria', {}).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if(data.estado)
                        {
                            $scope.objetos.auditoria.lista = data.elementos;
                            $scope.objetos.auditoria.seleccionar($scope.objetos.auditoria.indice);
                        }
                        else
                        {
                            console.log(data);
                        }

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data);
                    });
            },
            actualizarEstado: function () {
               
                $http.post('/Auditoria/updateStateAuditoria', $scope.objetos.auditoria.activa).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Auditoria actualizada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
                
            }
        },
        calificacion: {
            activa: { Estado: { id: 1 }, id: 0 },
            temp: { Estado: { id: 1 }, id: 0 },
            crear: function () {


                if ($scope.objetos.calificacion.temp.id != 0) {

                    $scope.objetos.calificacion.actualizar($scope.objetos.calificacion.temp);

                }
                else
                {
                    $scope.objetos.calificacion.temp.auditoria = $scope.objetos.auditoria.activa.id;
                    $http.post('/Auditoria/createCalificacion', $scope.objetos.calificacion.temp).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Calificación creada correctamente.'
                               };
                               $scope.objetos.calificacion.temp = { Estado: { id: 1 }, id: 0 };
                               $scope.objetos.auditoria.obtener();

                           }
                           else {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-danger',
                                   titulo: 'Error',
                                   mensaje: data.error
                               };
                           }
                       }).
                       error(function (data, status, headers, config) {
                           // called asynchronously if an error occurs
                           // or server returns response with an error status.
                           console.log(data);
                       });
                }

             
            },
            eliminar: function (obj) {
                if (confirm("Desea eliminar la calificación " + obj.descripcion)) {
                    $http.post('/Auditoria/deleteCalificacion', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Calificación eliminada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();
                                     
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
                }
            },
            actualizarEstado: function (obj) {

                $http.post('/Auditoria/updateStateCalificacion', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Calificación actualizada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();
                                
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            actualizar: function (obj) {

                $http.post('/Auditoria/updateCalificacion', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Calificación actualizada correctamente.'
                                          };
                                          $scope.objetos.calificacion.temp = { Estado: { id: 1 }, id: 0 };
                                          $scope.objetos.auditoria.obtener();
                                    
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            editar: function (obj) {
                $scope.objetos.calificacion.temp = obj;
            }
        },
        item: {
            activa: { Estado: { id: 1 }, id: 0 },
            temp: { Estado: { id: 1 }, id: 0 },
            crear: function () {

                if ($scope.objetos.item.temp.id != 0) {

                    $scope.objetos.item.actualizar($scope.objetos.item.temp);

                }
                else
                {
            
                    $scope.objetos.item.temp.auditoria = $scope.objetos.auditoria.activa.id;
                    $http.post('/Auditoria/createItem', $scope.objetos.item.temp).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Item creado correctamente.'
                               };
                               $scope.objetos.item.temp = { Estado: { id: 1 }, id: 0 };
                               $scope.objetos.auditoria.obtener();

                           }
                           else {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-danger',
                                   titulo: 'Error',
                                   mensaje: data.error
                               };
                           }
                       }).
                       error(function (data, status, headers, config) {
                           // called asynchronously if an error occurs
                           // or server returns response with an error status.
                           console.log(data);
                       });
                }
                
            },
            eliminar: function (obj) {
                if (confirm("Desea eliminar la item " + obj.nombre)) {
                    $http.post('/Auditoria/deleteItem', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Item eliminado correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
                }
            },
            actualizarEstado: function (obj) {

                $http.post('/Auditoria/updateStateItem', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Item actualizado correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            actualizar: function (obj) {

                $http.post('/Auditoria/updateItem', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Item actualizado correctamente.'
                                          };
                                          $scope.objetos.item.temp = { Estado: { id: 1 }, id: 0 };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            editar: function (obj) {
                $scope.objetos.item.temp = obj;
            },
            asignar: function (obj) {
                $scope.objetos.item.activa = obj;
            },
            agregarClasificacion: function (obj)
            {
                $http.post('/Auditoria/addClasificacionItem', { item: $scope.objetos.item.activa, clasificacion: obj }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if (data.estado) {
                        
                            $scope.objetos.auditoria.obtener();

                        }
                        else {
                            $scope.alerta = {
                                estado: true,
                                tipo: 'alert-danger',
                                titulo: 'Error',
                                mensaje: data.error
                            };
                        }
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data);
                    });
            },
            removerClasificacion: function (obj)
            {
                $http.post('/Auditoria/removeClasificacionItem', obj).
                 success(function (data, status, headers, config) {
                     // this callback will be called asynchronously
                     // when the response is available

                     if (data.estado) {

                         $scope.objetos.auditoria.obtener();

                     }
                     else {
                         $scope.alerta = {
                             estado: true,
                             tipo: 'alert-danger',
                             titulo: 'Error',
                             mensaje: data.error
                         };
                     }
                 }).
                 error(function (data, status, headers, config) {
                     // called asynchronously if an error occurs
                     // or server returns response with an error status.
                     console.log(data);
                 });
            }
        },
        categoria: {
            activa: { Estado: { id: 1 }, id: 0 },
            temp: { Estado: { id: 1 },id:0 },
            crear: function () {
                
                if ($scope.objetos.categoria.temp.id != 0) {

                    $scope.objetos.categoria.actualizar($scope.objetos.categoria.temp);

                }
                else {
                    
                    $scope.objetos.categoria.temp.auditoria = $scope.objetos.auditoria.activa.id;
                    $http.post('/Auditoria/createCategoria', $scope.objetos.categoria.temp).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Categoria creada correctamente.'
                               };
                               $scope.objetos.categoria.temp = { Estado: { id: 1 }, id: 0 };
                               $scope.objetos.auditoria.obtener();

                           }
                           else {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-danger',
                                   titulo: 'Error',
                                   mensaje: data.error
                               };
                           }
                       }).
                       error(function (data, status, headers, config) {
                           // called asynchronously if an error occurs
                           // or server returns response with an error status.
                           console.log(data);
                       });
                }

            },
            eliminar: function (obj) {
                if (confirm("Desea eliminar la categoria " + obj.nombre)) {
                    $http.post('/Auditoria/deleteCategoria', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Categoria eliminada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
                }
            },
            actualizarEstado: function (obj) {

                $http.post('/Auditoria/updateStateCategoria', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Categoria actualizada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            actualizar: function (obj) {

                $http.post('/Auditoria/updateCategoria', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Categoria actualizada correctamente.'
                                          };
                                          $scope.objetos.item.temp = { Estado: { id: 1 }, id: 0 };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            editar: function (obj) {
                $scope.objetos.categoria.temp = obj;
            },
            filtro:''
        },
        clasificacion: {
            activa: { Estado: { id: 1 }, id: 0 },
            temp: { Estado: { id: 1 }, id: 0 },
            crear: function () {
              
                if ($scope.objetos.clasificacion.temp.id != 0) {

                    $scope.objetos.clasificacion.actualizar($scope.objetos.clasificacion.temp);

                }
                else {
                    //$scope.objetos.categoria.temp.auditoria = $scope.objetos.auditoria.activa.id;
                    $http.post('/Auditoria/createClasificacion', $scope.objetos.clasificacion.temp).
                       success(function (data, status, headers, config) {
                           // this callback will be called asynchronously
                           // when the response is available

                           if (data.estado) {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-success',
                                   titulo: 'Realizado',
                                   mensaje: 'Clasificación creada correctamente.'
                               };
                               $scope.objetos.clasificacion.temp = { Estado: { id: 1 }, id: 0 };
                               $scope.objetos.auditoria.obtener();

                           }
                           else {
                               $scope.alerta = {
                                   estado: true,
                                   tipo: 'alert-danger',
                                   titulo: 'Error',
                                   mensaje: data.error
                               };
                           }
                       }).
                       error(function (data, status, headers, config) {
                           // called asynchronously if an error occurs
                           // or server returns response with an error status.
                           console.log(data);
                       });
                }

            },
            eliminar: function (obj) {
                if (confirm("Desea eliminar la clasificación " + obj.nombre)) {
                    $http.post('/Auditoria/deleteClasificacion', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Clasificación eliminada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
                }
            },
            actualizarEstado: function (obj) {

                $http.post('/Auditoria/updateStateClasificacion', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Clasificación actualizada correctamente.'
                                          };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            actualizar: function (obj) {

                $http.post('/Auditoria/updateClasificacion', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Realizado',
                                              mensaje: 'Clasificación actualizada correctamente.'
                                          };
                                          $scope.objetos.clasificacion.temp = { Estado: { id: 1 }, id: 0 };
                                          $scope.objetos.auditoria.obtener();

                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            },
            editar: function (obj) {
                $scope.objetos.clasificacion.temp = obj;
            },
            filtro: ''
        }
    };
    $scope.alerta = {
        estado: false,
        tipo: '',
        titulo: '',
        mensaje: ''
    };

    //funciones main
   
    $scope.objetos.auditoria.obtener();

    if ($scope.objetos.auditoria.lista.length > 0)
    {
        //$scope.objetos.auditoria.seleccionar(0);
    }
    
});