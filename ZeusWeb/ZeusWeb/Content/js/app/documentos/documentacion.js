var app = angular.module('app', []);

app.controller('appCtrl', function ($scope, $http, $sce) {
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
            activo: var_documentacion,
            validar: function () {
                if (!$scope.objetos.documentacion.activo.estado)
                {
                    $scope.funciones.alertNotification("Error", $scope.objetos.documentacion.activo.error.Message, "danger");
                }
            },
            getUrl: function () {


                return $sce.trustAsResourceUrl($scope.objetos.documentacion.activo.elementos[0].Archivo.url);
            },
            ver: function () {
                alert(document.getElementById("contenido").contentWindow.document);
            }
        }
    };

    //$scope.objetos.documentacion.getUrl();


});