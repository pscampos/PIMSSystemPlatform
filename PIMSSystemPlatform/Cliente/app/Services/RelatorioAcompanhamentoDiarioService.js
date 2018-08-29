//
// IHM Engenharia
// Service - Realiza as operações de acesso ao WebAPI
//
(function () {

    angular.module("app.web").factory("RelatorioAcompanhamentoDiarioService", RelatorioAcompanhamentoDiarioService);

    function RelatorioAcompanhamentoDiarioService(Constantes, $http) {


        // Atributos privados.       
        var API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_RECUPERAR = Constantes.API_URL_BASE.concat('/RelatorioAcompanhamentoDiario/RecuperarRelatorioAcompanhamentoDiario');
        var API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_SALVAR = Constantes.API_URL_BASE.concat('/RelatorioAcompanhamentoDiario/SalvarRelatorioAcompanhamentoDiario');
        var API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_EXCLUIR = Constantes.API_URL_BASE.concat('/RelatorioAcompanhamentoDiario/ExcluirRelatorioAcompanhamentoDiario');
        var API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_RECUPERAR_DADOS = Constantes.API_URL_BASE.concat('/RelatorioAcompanhamentoDiario/RecuperarDadosRelatorioAcompanhamentoDiario');


        //-----------------------------------------------------------------------------------------

        // Interface pública.       
        return {
            recuperarRelatorioAcompanhamentoDiario: function () {
                return $http.get(sprintf(API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_RECUPERAR));
            },
            salvarRelatorioAcompanhamentoDiario: function (obj) {
                return $http.post(API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_SALVAR,obj);
            },
            excluirRelatorioAcompanhamentoDiario: function (obj) {
                return $http.post(API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_EXCLUIR, obj);
            },
            recuperarDadosRelatorioAcompanhamentoDiario: function (obj) {
                return $http.post(API_URL_RELATORIO_ACOMPANHAMENTO_DIARIO_RECUPERAR_DADOS, obj);
            },
        };
        //-----------------------------------------------------------------------------------------

    }

})();