(function () {

    angular.module("app.web").constant("Constantes", {

        API_URL: "http://localhost:57749/api/values",
                        
        TIPO_OPERACAO: {
            NENHUMA: 0,
            INSERCAO: 1,
            EDICAO: 2,
            DELECAO: 3
        },
        TIPO_OPERACAO_STRING: [
            "",
            "ADICIONAR",
            "EDITAR",
            "DELETAR",
        ],
        

        // Ambiente de Testes Local
        API_URL_BASE: "http://localhost:57749/api",
        API_URL_TOKEN: "http://localhost:57749/token",
        
    }).run(function ($rootScope, Constantes) {
        $rootScope.Constantes = Constantes;
    });

})()