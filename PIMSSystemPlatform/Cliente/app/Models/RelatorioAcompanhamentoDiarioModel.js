//
// IHM Engenharia
// Model para Visualização da Associação de Analogicas
//
(function () {

    angular.module("app.web").factory("RelatorioAcompanhamentoDiarioModel", RelatorioAcompanhamentoDiarioModel);

    function RelatorioAcompanhamentoDiarioModel() {

        // Atributos privados.
        var RelatorioAcompanhamentoDiario = null;
        var SelectedRelatorioAcompanhamentoDiario = null;
        var SelectedRelatorioAcompanhamentoDiarioDados = null;
        var DthRelatorio = null;

        //-----------------------------------------------------------------------------------------

        // Funções privadas.



        //-----------------------------------------------------------------------------------------

        // Funções públicas.  




        //-----------------------------------------------------------------------------------------


        // Inicialização.


        //-----------------------------------------------------------------------------------------


        // Interface pública.

        return {
            getSelectedRelatorioAcompanhamentoDiario: function () { return SelectedRelatorioAcompanhamentoDiario },
            getRelatorioAcompanhamentoDiario: function () { return RelatorioAcompanhamentoDiario },
            getSelectedRelatorioAcompanhamentoDiarioData: function () { return SelectedRelatorioAcompanhamentoDiarioData },
            getDthRelatorio: function () { return DthRelatorio },
        }

        //-----------------------------------------------------------------------------------------

    };

})();