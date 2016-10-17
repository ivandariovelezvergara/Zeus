function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

//Genera un objeto Blob con los datos en un archivo TXT
function generarTexto(datos) {
    var texto = [];
    texto.push(datos);
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(texto, {
        type: 'text/plain'
    });
};
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
            nombre:'',
            html: '',
            agregarVariable:function()
            {
                $scope.objetos.variableAdicional.lista.push($scope.objetos.variableAdicional.temp);
                $scope.objetos.variableAdicional.temp = {};
            },
            removerVariable: function (pos) {
                $scope.objetos.variableAdicional.lista.splice(pos, 1);
            },
            previsualizar: function () {
                var html = $('.summernote').code();

                angular.forEach($scope.objetos.variablePredefinida.lista, function (variable, key) {
                    html = html.replace(variable.codigo, variable.ejemplo);
                });

                angular.forEach($scope.objetos.variableAdicional.lista, function (variable, key) {
                    html = html.replace(variable.codigo, variable.ejemplo);
                });

                $scope.objetos.formato.html = $sce.trustAsHtml("<div style='margin-top: 50px; margin-buttom:50px; margin-left:50px; margin-right:50px;'>" + html + "</div>");
            },
            exportar: function () {
                var html = $('.summernote').code();


                descargarArchivo(generarTexto(html), $scope.objetos.formato.nombre + '.ift');
            }
        },
        variableAdicional: {
            temp:{},
            tipoDato:[
                {}
            ],
            lista: []
        },
        variablePredefinida: {
            lista: [
                { codigo: '@empleado-nombres', descripcion: 'Nombres del empleado' },
                { codigo: '@empleado-apellidos', descripcion: 'Apellidos del empleado' },
                { codigo: '@empleado-tipoId-descripcion', descripcion: 'Tipo de identificación (CEDULA DE CIUDADANIA)' },
                { codigo: '@empleado-tipoId-prefijo', descripcion: 'Tipo de identificación (CC)' },
                { codigo: '@empleado-identificacion', descripcion: 'Número de Identificación del empleado.' },
                { codigo: '@empleado-fechaNacimiento-dd/mm/aa', descripcion: 'Fecha de nacimiento del empleado en el formato dd/mm/aa.' },
                { codigo: '@formato-fechaAsignado-dd/mm/aa', descripcion: 'Fecha de asignación del formato al empleado.' }
            ]
        }
    };

});