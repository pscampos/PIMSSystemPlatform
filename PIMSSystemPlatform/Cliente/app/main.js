(function () {

    var app = angular.module("app.web", ['ngMaterial', 'ui.router', 'md.data.table', 'filters', 'ngMessages', 'cgBusy', 'chart.js', 'nvd3']);

    app.config(function ($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {

        $mdDateLocaleProvider.formatDate = function (dateString) {
            return moment(dateString).format('DD/MM/YYYY');
        };

        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };


        // For any unmatched url, redirect to /login
        //$urlRouterProvider.otherwise("/main.relatorioacompanhamentodiario");
        //
        // Now set up the states
        $stateProvider
            .state('main', {
                url: "/main",
                templateUrl: "views/main.html",
                controller: "HomeController",
                controllerAs: "body"
            })



             .state('main.admrelatorioacompanhamentodiario', {
                 url: "/admrelatorioacompanhamentodiario",
                 templateUrl: "views/RelatorioAcompanhamentoDiarioAdm.html",
                 //controller: "RelatorioAcompanhamentoDiarioAdmController",
                 //controllerAs: "relatorioacompanhamentodiario",
                 menu: "Adm Relatório de Acompanhamento Diário",
                 icon: "toc",
                 nomeTela: "Adm Relatório de Acompanhamento Diário",
                 svg: false,
             })

            .state('main.relatorioacompanhamentodiario', {
                url: "/relatorioacompanhamentodiario",
                templateUrl: "views/RelatorioAcompanhamentoDiario.html",
                //controller: "RelatorioAcompanhamentoDiarioAdmController",
                //controllerAs: "relatorioacompanhamentodiario",
                menu: "Relatório de Acompanhamento Diário",
                icon: "toc",
                nomeTela: "Relatório de Acompanhamento Diário",
                svg: false,
            })
        

    });


    app.directive("decimals", function ($filter) {
        return {
            restrict: "A", // Only usable as an attribute of another HTML element
            require: "?ngModel",
            scope: {
                decimals: "@",
                decimalPoint: "@"
            },
            link: function (scope, element, attr, ngModel) {
                var decimalCount = parseInt(scope.decimals) || 2;
                var decimalPoint = scope.decimalPoint || ".";
                // Run when the model is first rendered and when the model is changed from code
                ngModel.$render = function () {
                    if (ngModel.$modelValue != null && ngModel.$modelValue >= 0) {
                        if (typeof decimalCount === "number") {
                            element.val(ngModel.$modelValue.toFixed(decimalCount).toString().replace(",", "."));
                        } else {
                            element.val(ngModel.$modelValue.toString().replace(",", "."));
                        }
                    }
                }
                // Run when the view value changes - after each keypress
                // The returned value is then written to the model
                ngModel.$parsers.unshift(function (newValue) {
                    if (typeof decimalCount === "number") {
                        var floatValue = parseFloat(newValue.replace(",", "."));
                        if (decimalCount === 0) {
                            return parseInt(floatValue);
                        }
                        return parseFloat(floatValue.toFixed(decimalCount));
                    }

                    return parseFloat(newValue.replace(",", "."));
                });
                // Formats the displayed value when the input field loses focus
                element.on("change", function (e) {
                    var floatValue = parseFloat(element.val().replace(",", "."));
                    if (!isNaN(floatValue) && typeof decimalCount === "number") {
                        if (decimalCount === 0) {
                            element.val(parseInt(floatValue));
                        } else {
                            var strValue = floatValue.toFixed(decimalCount);
                            element.val(strValue.replace(".", decimalPoint));
                        }
                    }
                });
            }
        }
    });


    app.run(function ($q, $state, $mdDialog, $rootScope, $http, Constantes, LogInService) { 

        $http.defaults.withCredentials = true;
        
        $rootScope.loginToken = "";

        
        var usuarioToLogIn = {
            codUsuario: "",
            nomeUsuario: "",
            emailUsuario: "",
            password: "",
            domain: "",
        }

        $rootScope.usuarioLogado = usuarioToLogIn; 

        $rootScope.logInPopup = function logInPopup() {

            $mdDialog.show({
                controller: LogInController,
                templateUrl: 'views/LogIn.html',
                parent: angular.element(document.body),
                //targetEvent: ev,
                clickOutsideToClose: true,
            })
                .then(function (answer) {

                },
                function () {
                }); 


            function LogInController($scope, $state, $mdDialog, $rootScope, Constantes, LogInService) {

                // Recupera Chamada de Serviço
                $scope.LogInService = LogInService;

                //Verifica se o enter foi acionado e chama a função de login
                $scope.checkIfEnterKeyWasPressed = function ($event) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        $scope.btnLogIn($event);
                    }
                };


                /*
                * Função que Faz o LogIn do Usuario
                * Tenta fazer o LogIn com usuário e senha informado
                *
                * @ev   {evento}   evento de click no botão de LogIn
                */
                $scope.btnLogIn = function (ev) {

                    var usuarioToLogIn = {
                        codUsuario: $scope.usuario,
                        nomeUsuario: "",
                        emailUsuario: "",
                        //gruposADUsuario: [],
                        //autenticado: false,
                        //gruposSistema: [],
                        password: $scope.senha,
                        //permissoes: [],
                        domain: "",
                    }

                    LogInService.logIn(usuarioToLogIn);

                }; 

                /*
                * Função que Faz o LogOut do Usuario
                * Tenta fazer o LogOut
                *
                * @ev   {evento}   evento de click no botão de LogOut
                */
                $scope.btnLogOut = function (ev) {

                    var usuarioToLogOut = {
                        codUsuario: "",
                        nomeUsuario: "",
                        emailUsuario: "",
                        password: "",
                        domain: "",
                    }

                    $rootScope.loginToken = "";
                    $http.defaults.headers.common.Authorization = "Bearer " + $rootScope.loginToken;

                    $rootScope.usuarioLogado = usuarioToLogOut;

                    // Popup alerta
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#content')))
                        .clickOutsideToClose(true)
                        .title('Informação')
                        .textContent('LogOut realizado com sucesso')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Ok')
                    );

                }; 


                /*
                * Função que fecha o modal
                *
                * @ev   {evento}   evento de click no botão de LogIn
                */
                $scope.btnCloseLogIn = function (ev) {

                    $mdDialog.hide();

                }

            }; 



        }

        $rootScope.errorPopup = function errorPopup(text) {
            // Popup alerta
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#content')))
                .clickOutsideToClose(true)
                .title('Informação')
                .textContent(text)
                .ariaLabel('Alert Dialog Demo')
                .ok('Ok')
            );
        }; 
        
        $state.go("main.admrelatorioacompanhamentodiario");

        //$rootScope.logInPopup(); 
    });
       

    app.config(function ($mdIconProvider) {
        // Configure URLs for icons specified by [set:]id.
        $mdIconProvider
             .defaultFontSet('material-icons')
    });


})();