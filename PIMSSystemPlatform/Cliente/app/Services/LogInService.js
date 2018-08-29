/**
 * IHM Engenharia
 * Service LogIn - Realiza as operações de acesso ao WebAPI relativas ao log de Usuario
 */
(function () {

    angular.module("app.web").factory("LogInService", LogInService);

    function LogInService($http, $state, $mdDialog, $rootScope, Constantes) {

        var Service = {            
            logIn: function (usuario) {

                var data = "grant_type=password&username=" + usuario.codUsuario + "&password=" + usuario.password;

                return $http.post(Constantes.API_URL_TOKEN, data)
                .then(function sucesso(resposta) {
                    $rootScope.usuarioLogado = usuario;
                    $rootScope.usuarioLogado.codUsuario = resposta.data.codUsuario;
                    $rootScope.usuarioLogado.nomeUsuario = resposta.data.nomeUsuario;
                    $rootScope.usuarioLogado.emailUsuario = resposta.data.emailUsuario;
                    $rootScope.usuarioLogado.domain = resposta.data.domain;


                    $rootScope.loginToken = resposta.data.access_token;
                    $http.defaults.headers.common.Authorization = "Bearer " + $rootScope.loginToken;
                    
                    $rootScope.errorPopup(resposta.data.Message);
                    
                },
                function erro(resposta) {
                    
                    $rootScope.errorPopup(resposta.data.error_description);

                })
            }
        }

        return Service;
    }

})()