var myApp = angular.module('appGeneral', []);

myApp.controller('appGeneralCtrl', ['$scope', '$http','$sce', function ($scope, $http, $sce) {
    //formatos
    $scope.formato = {};
    $scope.formato.fecha = function (fecha) {
        var re = /-?\d+/;
        var m = re.exec(fecha);
        var d = new Date(parseInt(m));
        return $.datepicker.formatDate("dd/mm/yy", d);
    };
    //eventos
    $scope.evento = {
        consultarEmpleado: function ()
        {
            $scope.objetos.notificacion.estado = false;
            $http.post('/Hseq/getCertificado', $scope.objetos.empleado.activo).
                  success(function (data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available

                      if (data.estado) {
      
                          $scope.objetos.certificado.lista = data.elementos;

                          $scope.objetos.notificacion.estado = true;
                          $scope.objetos.notificacion.mensaje = 'Se encontraron (' + data.elementos.length + ') certificados asociados a este documento.';
                          $scope.objetos.notificacion.tipo = 'alert-success';
                      }
                      else {
                          $scope.objetos.notificacion.estado = true;
                      
                          if (data.error.Message === undefined) {
                              $scope.objetos.notificacion.mensaje = data.error;
                          }
                          else { $scope.objetos.notificacion.mensaje = data.error.Message; }
                          
                          $scope.objetos.notificacion.tipo = 'alert-danger';
                    
                      }

                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log(data);
                      $scope.objetos.notificacion.estado = true;
                      $scope.objetos.notificacion.mensaje = data.error;
                      $scope.objetos.notificacion.tipo = 'alert-danger';
                  });
        },
        cargarDocumento: function () {

            if ($scope.objetos.certificado.activo.Formato.tipo == 'DINAMICO')
            {
                //agregamos variables de empleado
                var variables = $scope.objetos.certificado.activo.Variables;

                variables.push({ codigo: '@empleado-nombres', valor: $scope.objetos.certificado.activo.Empleado.nombres });
                variables.push({ codigo: '@empleado-apellidos', valor: $scope.objetos.certificado.activo.Empleado.apellidos });
                variables.push({ codigo: '@empleado-tipoId-descripcion', valor: $scope.objetos.certificado.activo.Empleado.TipoIdentificacion.descripcion });
                variables.push({ codigo: '@empleado-tipoId-prefijo', valor: $scope.objetos.certificado.activo.Empleado.TipoIdentificacion.prefijo });
                variables.push({ codigo: '@empleado-identificacion', valor: $scope.objetos.certificado.activo.Empleado.identificacion });
                variables.push({ codigo: '@empleado-fechaNacimiento-dd/mm/aa', valor: $scope.objetos.certificado.activo.Empleado.fechaNacimientoString });
                variables.push({ codigo: '@formato-fechaAsignado-dd/mm/aa', valor: $scope.formato.fecha($scope.objetos.certificado.activo.fecha) });
                
                $http.post('/Documentos/CargarDocumento', { variables: variables, formato: $scope.objetos.certificado.activo.Formato.Archivo.url }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available

                        $scope.objetos.certificado.activo.html = $sce.trustAsHtml(data);
            

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data);
                        $scope.objetos.notificacion.estado = true;
                        $scope.objetos.notificacion.mensaje = data.error;
                        $scope.objetos.notificacion.tipo = 'alert-danger';
                    });
            }
              

        }
    }
    //objetos
    $scope.objetos = {
        certificado: {
            activo: { Archivo: { url: '' }, Formato: {tipo:''}},
            lista:[]


        },
        empleado: {
            activo: {
                identificacion: '',
                TipoIdentificacion: { id: 1, prefijo: 'CC', descripcion: 'Cédula de Ciudadania' }
            }
        },
        notificacion: {
            estado: false,
            mensaje: '',
            tipo: 'alert-danger'
        }
    };

}]);


