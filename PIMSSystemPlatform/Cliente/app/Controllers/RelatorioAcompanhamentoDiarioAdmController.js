/**
 * IHM Engenharia
 * Controller Visualização de Associação das Analogicas
 */
(function () {

    angular.module("app.web").controller("RelatorioAcompanhamentoDiarioAdmController", RelatorioAcompanhamentoDiarioAdmController);

    function RelatorioAcompanhamentoDiarioAdmController(
        RelatorioAcompanhamentoDiarioModel, RelatorioAcompanhamentoDiarioService, $q, $rootScope, $scope, $state, $timeout, $mdDialog) {

        //-----------------------------------------------------------------------------------------

        // Funções privadas.
        
        function Inicializar() {

            RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario = null;
            RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario = null;
            RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiarioDados = null;
            RelatorioAcompanhamentoDiarioModel.DthRelatorio = null;

            // Recupera  os Clientes
            recuperarRelatorioAcompanhamentoDiario();
            newReport();
        };

        // Carregar rotas ativas
        function recuperarRelatorioAcompanhamentoDiario() {
            $scope.RelatorioAcompanhamentoDiarioModel = RelatorioAcompanhamentoDiarioModel;

            var recuperar = RelatorioAcompanhamentoDiarioService.recuperarRelatorioAcompanhamentoDiario();

            $rootScope.Waiting = $q.all([recuperar]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {
                        RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario = resposta[0].data.Dados;
                    }
                    else {
                        $rootScope.errorPopup(resposta[0].data.Mensagem);
                    }
                })
                .catch(function (erro) {
                    $rootScope.errorPopup(erro.data.Message);
                });
        };

        function salvarRelatorioAcompanhamentoDiario() {
            $scope.RelatorioAcompanhamentoDiarioModel = RelatorioAcompanhamentoDiarioModel;

            var relatorioAcompanhamentoDiario = RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario;

            var salvar = RelatorioAcompanhamentoDiarioService.salvarRelatorioAcompanhamentoDiario(relatorioAcompanhamentoDiario);

            $rootScope.Waiting = $q.all([salvar]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {
                        RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario = resposta[0].data.Dados;

                        var isNew = true;

                        for (var i = 0; i < RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario.length; i++) {
                            if (RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario[i].Name == RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario.Name) {
                                RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario[i] = JSON.parse(JSON.stringify(RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario));
                                isNew = false;
                                break;
                            }
                        }
                        if (isNew) {
                            RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario.push(JSON.parse(JSON.stringify(RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario)));
                        }
                        
                    }
                    else {
                        $rootScope.errorPopup(resposta[0].data.Mensagem);
                    }
                })
                .catch(function (erro) {
                    $rootScope.errorPopup(erro.data.Message);
                });
        };

        function excluirRelatorioAcompanhamentoDiario() {
            $scope.RelatorioAcompanhamentoDiarioModel = RelatorioAcompanhamentoDiarioModel;

            var relatorioAcompanhamentoDiario = RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario;

            var excluir = RelatorioAcompanhamentoDiarioService.excluirRelatorioAcompanhamentoDiario(relatorioAcompanhamentoDiario);

            $rootScope.Waiting = $q.all([excluir]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {                        
                        //RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario = null;

                        var index = RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario.indexOf(RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario);
                        if (index != -1) {
                            RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario.splice(index, 1);
                            newReport();
                        }
                        //var indexOriginal = RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario.indexOf(RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario);
                        //if (indexOriginal != -1) {
                        //    RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario.splice(index, 1);
                        //    newReport();
                        //}
                    }
                    else {
                        $rootScope.errorPopup(resposta[0].data.Mensagem);
                    }
                })
                .catch(function (erro) {
                    $rootScope.errorPopup(erro.data.Message);
                });
        };

        //-----------------------------------------------------------------------------------------

        // Funções públicas.

        function addAttribute() {
            var AFAttribute = {
                Name: RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario.Attributes.length + 1,
                Value: "",
                Path: "",
            }

            RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario.Attributes.push(AFAttribute);

        }

        function newReport() {
            var AFElement = {
                Name: "",
                Path: "",
                WebId: "",
                Attributes: [],
            }

            RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario = AFElement;

        }

        function saveReport() {
            salvarRelatorioAcompanhamentoDiario();
        }

        function excludeReport(){
            excluirRelatorioAcompanhamentoDiario();
        }








        //-----------------------------------------------------------------------------------------

        // Inicialização.


        Inicializar();

        //-----------------------------------------------------------------------------------------

        // Interface pública.


        return {
            addAttribute: addAttribute,
            newReport: newReport,
            saveReport: saveReport,
            excludeReport: excludeReport,
        };
        //-----------------------------------------------------------------------------------------
    }

})();