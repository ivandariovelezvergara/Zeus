//validaciones
$(function () {
    // Validation
    $("#crear-documento").validate({
        // Rules for form validation
        rules: {
            auditoria: {
                required: true
            },
            centrocosto: {
                required: true
            },
            fecha: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            auditoria: {
                required: 'Selecciona una auditoria valida.'
            },
            centrocosto: {
                required: 'Selecciona un centro de costo valido.'
            },
            fecha: {
                required: 'Ingrese fecha.'
            }
        },

        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
});
var app = angular.module('appArchivo', []);
app.controller('appArchivoCtrl', function ($scope, $http, $filter) {
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
            activa: {},
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
            activa: {},
            filtro:{texto:''},
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
        documento: {
            activa: {observaciones:''},
            lista: [],
            temp:{},
            filtro:{cantidad:10},
            crear: function () {
               
                if (typeof ($scope.objetos.documento.activa.auditoria) != "undefined" && typeof ($scope.objetos.documento.activa.centrocosto) != "undefined" && $scope.objetos.documento.activa.fecha != null)
                {

                    
                        $http.post('/Auditoria/createDocumento', { documento: $scope.objetos.documento.activa }).
                           success(function (data, status, headers, config) {
                               // this callback will be called asynchronously
                               // when the response is available

                               if (data.estado) {
                                  
                                   $scope.funciones.alertNotification("Procesado", "Auditoria creada correctamente.", "success");
                                   $scope.objetos.documento.activa = { observaciones: '' };
                                   $scope.objetos.documento.obtener();
                               }
                               else {
                                   $scope.funciones.alertNotification("Error", "Auditoria no se pudo crear.", "danger");
                               }
                           }).
                           error(function (data, status, headers, config) {
                               // called asynchronously if an error occurs
                               // or server returns response with an error status.
                               console.log(data);
                           });
                    
                }
            },
            obtener: function ()
            {
                $http.post('/Auditoria/getDocumentoAll', $scope.objetos.documento.filtro).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.objetos.documento.lista = data.elementos;
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
            eliminar: function (obj) {
                if (confirm("Desea eliminar la documento de auditoria " + obj.CentroCosto.descripcion + " - " + obj.Auditoria.nombre)) {
                    $http.post('/Auditoria/deleteDocumento', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                                          $scope.funciones.alertNotification("Procesado", "Auditoria eliminada correctamente.", "success");
                                          $scope.objetos.documento.obtener();
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
            cerrar: function (obj) {
             
                if (confirm("Desea cerrar " + obj.Auditoria.nombre + " realizada a " + obj.CentroCosto.descripcion )) {
                    $http.post('/Auditoria/updateStateDocumento', obj).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available

                                      if (data.estado) {
                    
                                          $scope.funciones.alertNotification("Procesado", obj.Auditoria.nombre + ' cerrada correctamente.', "success");
                                          $scope.objetos.documento.obtener();
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
            obtenerItems:function(obj)
            {
                $scope.objetos.documento.cargando = true;
                $http.post('/Auditoria/getDocumento', { filtro: $scope.objetos.documento.filtro, documento: obj }).
                   success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available

                       if (data.estado) {
                           $scope.objetos.documento.temp = data.elementos[0];
                           $scope.objetos.documento.cargando = false;
                           $scope.informe.cargar();
                           $scope.funciones.alertNotification("Cargado", 'Los items a evaluar fueron cargados, revise en la parte inferior.', "info");
                           window.scrollTo(0, 400);
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
            filtrarCategoria: function (categoria,item) {
                var temp = $filter('filter')(item.Clasificaciones, { Categoria: {id:categoria.id }})[0];

                //$scope.objetos.documento.temp.Items[pos].cat[temp.Categoria.id] = temp.nombre;

                return temp;
            }
        },item:{
            activa: {},
            temp:{},
            activar: function (obj) {
                $scope.objetos.item.activa = obj;
            },
            abrirHistorial: function (item) {
                window.open('/Auditoria/DetalleItem?a=' + $scope.objetos.documento.temp.Auditoria.id + '&i=' + item.id + '&cc=' + $scope.objetos.documento.temp.CentroCosto.id , "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=950, height=600");
            },
            getCalificacion: function (item) {
              
                var res = $filter('filter')(item.Calificaciones, { Estado: { id: 1 } })[0];

                if (res == null)
                {
                    return { Estado: {id:0},prefijo:'N/A',id:0};
                }

                return res;
            },
            calificar: function (item,calificacion)
            {
                $scope.objetos.documento.cargando = true;

                
                $http.post('/Auditoria/calificarItem', {calificacion:calificacion.id,item:item.id,documento:$scope.objetos.documento.temp.id}).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available


                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Actualizado',
                                              mensaje: ''
                                          };

                                          //var temp = $filter('filter')($scope.objetos.documento.temp.Items, { id: item.id })[0];



                                          //$scope.objetos.documento.temp[pos].Estado = { id: 1 };
                                          angular.forEach(item.Calificaciones, function (value, key) {
                                               
                                              if (calificacion.id == value.id) {
                                                  $scope.objetos.documento.cargando = false;
                                                  if (calificacion.id == 0)
                                                  {
                                                      item.Calificaciones[key] = calificacion;
                                                  }
                                                  else
                                                  {
                                                      item.Calificaciones[key].Estado = { id: 1 };
                                                  }
                                                 
                                              }
                                              else {
                                                  item.Calificaciones[key].Estado = { id: 2 };
                                              }

                                          });

                                      
                                          $scope.informe.cargar();
                                   
                                         // $scope.objetos.documento.obtenerItems({ id: $scope.objetos.documento.temp.id });
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                          console.log(data);
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });
              
            },
            actualizarObservacion: function (item) {
              
                

                $http.post('/Auditoria/observacionItem', { observacion: item.observacion, item: item.id, documento: $scope.objetos.documento.temp.id }).
                                  success(function (data, status, headers, config) {
                                      // this callback will be called asynchronously
                                      // when the response is available


                                      if (data.estado) {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-success',
                                              titulo: 'Actualizado',
                                              mensaje: ''
                                          };

                                            
                                      }
                                      else {
                                          $scope.alerta = {
                                              estado: true,
                                              tipo: 'alert-danger',
                                              titulo: 'Error',
                                              mensaje: data.error
                                          };
                                          console.log(data);
                                      }
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                      console.log(data);
                                  });

            }
        }, usuario: {
            lista: [],
            top: 10,
            filtro: {},
            campos: [
                { nombre: 'username', label: 'USERNAME' },
                { nombre: 'nombre', label: 'NOMBRE' },
                { nombre: 'correo', label: 'CORREO ELECTRONICO' },
            ],
            obtener: function () {

                $http.post('/Sistema/filtrarUsuarios', { top: $scope.objetos.usuario.top, filtro: $scope.objetos.usuario.filtro }).
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

            },
            compartir: function (item,usuario) {

                $http.post('/Auditoria/compartirItem', { item: item.id, usuario: usuario.id, documento: $scope.objetos.documento.temp.id }).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {

                          alert('Al usuario ' + usuario.nombre + ' se le ha enviado un correo eléctronico.' );
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
        }

    };
    $scope.informe = {
        porcentaje:0,
        cargar: function () {
           
            //var nombreCategoria =$scope.objetos.documento.activa.filtro_item.tfiltro;

            var total = 0;
            var cantidad = 0;
            angular.forEach($scope.objetos.documento.temp.Items, function (value, key) {
            
                

                var calificacion = $filter('filter')(value.Calificaciones, { Estado: { id: 1 } })[0];

              //  var clasificacion = $filter('filter')(value.Clasificaciones, { Categoria: { nombre: nombreCategoria } })[0];
                


                if (calificacion != null){
                    cantidad = cantidad + 1;
                    total += calificacion.valor;
                }

            });

            $scope.informe.porcentaje = Math.round((total / cantidad) * 100);
        
        }
    };
    $scope.formato = {};
    $scope.formato.fecha = function (fecha) {
        var re = /-?\d+/;
        var m = re.exec(fecha);
        var d = new Date(parseInt(m));
        return $.datepicker.formatDate("dd/mm/yy", d);
    };
   
    $scope.objetos.centrocosto.obtener();
    $scope.objetos.auditoria.obtener();
    $scope.objetos.documento.obtener();
    



});