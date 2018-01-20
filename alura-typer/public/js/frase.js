var frase = {
    aleatoria : () => {
        $("#spinner").toggle();

        // Faz uma requisição para resgatar as frases.
        $.get('http://localhost:3000/frases', (frases) => {
            var frase = $('.frase');

            /**
             * Math.random(): gera um número aleatório entre 0 e 1, mas com casas decimais.
             * Math.floor(argumento): arredonda o número para baixo.
             */
            var numeroAleatorio = Math.floor(Math.random() * frases.length);

            frase.text(frases[numeroAleatorio].texto);
            jogo.atualizarTamanhoFrase();
            jogo.atualizarTempoInicial(frases[numeroAleatorio].tempo);
        }).fail(() => {
            /**
             * A .fail() recebe uma função anônima com o código que é executado quando um erro acontece.
             */

            $("#erro").toggle();

            setTimeout(function(){
                $("#erro").toggle();
            }, 2000);
        }).always(() => {
            /**
             * A função .always é sempre executada independente de sucesso ou falha na requisição executada por Ajax.
             */

            $("#spinner").toggle();
        });
    },
    buscarPorId : () => {
        $("#spinner").toggle();

        var dados = {id : $('#frase-id').val()};

        //passando objeto como segundo parametro
        $.get('http://localhost:3000/frases', dados, (fraseSelecionada) => {
            var frase = $(".frase");
            frase.text(fraseSelecionada.texto);
            jogo.atualizarTamanhoFrase();
            jogo.atualizarTempoInicial(fraseSelecionada.tempo);
        }).fail(() => {
            $("#erro").toggle();
            setTimeout(function(){
                $("#erro").toggle();
            }, 2000);
        }).always(() => {
            $("#spinner").toggle();
        });
    }
};

$("#botao-frase").click(frase.aleatoria);
$("#botao-frase-id").click(frase.buscarPorId);