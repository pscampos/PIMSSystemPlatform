/**
 * IHM Engenharia
 * Controller Visualização de Associação das Analogicas
 */
(function () {

    angular.module("app.web").controller("RelatorioAcompanhamentoDiarioController", RelatorioAcompanhamentoDiarioController);

    function RelatorioAcompanhamentoDiarioController(
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
        };

        // Carregar rotas ativas
        function recuperarRelatorioAcompanhamentoDiario() {
            $scope.RelatorioAcompanhamentoDiarioModel = RelatorioAcompanhamentoDiarioModel;
            
            RelatorioAcompanhamentoDiarioModel.DthRelatorio = new Date();

            var recuperar = RelatorioAcompanhamentoDiarioService.recuperarRelatorioAcompanhamentoDiario();

            $rootScope.Waiting = $q.all([recuperar]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {
                        RelatorioAcompanhamentoDiarioModel.RelatorioAcompanhamentoDiario = resposta[0].data.Dados;
                        //if (RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario != null) {
                        //    recuperarDadosRelatorioAcompanhamentoDiario();
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

        function recuperarDadosRelatorioAcompanhamentoDiario() {
            $scope.RelatorioAcompanhamentoDiarioModel = RelatorioAcompanhamentoDiarioModel;

            var data = {
                RelatorioAcompanhamentoDiario: RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiario,
                Data: RelatorioAcompanhamentoDiarioModel.DthRelatorio,
                };

            var recuperarDados = RelatorioAcompanhamentoDiarioService.recuperarDadosRelatorioAcompanhamentoDiario(data);

            $rootScope.Waiting = $q.all([recuperarDados]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {
                        RelatorioAcompanhamentoDiarioModel.SelectedRelatorioAcompanhamentoDiarioDados = resposta[0].data.Dados;
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


        function selectedRelatorioChange() {
            recuperarDadosRelatorioAcompanhamentoDiario();
        };

        function dthInicioChange() {
            recuperarDadosRelatorioAcompanhamentoDiario();
        }





        //-----------------------------------------------------------------------------------------

        // Inicialização.


        Inicializar();

        //-----------------------------------------------------------------------------------------

        // Interface pública.


        return {
            selectedRelatorioChange: selectedRelatorioChange,
            dthInicioChange: dthInicioChange,
        };
        //-----------------------------------------------------------------------------------------
    }

})();