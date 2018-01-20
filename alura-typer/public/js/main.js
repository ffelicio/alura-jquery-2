var campo = $('.campo-digitacao');
var tempoInicial = $("#tempo-digitacao").text();
var botaoReiniciar = $("#botao-reiniciar");

$(function() {
    jogo.atualizarTamanhoFrase();
    jogo.inputJogador();
    jogo.inicializarCronometro();
    botaoReiniciar.click(jogo.reiniciar);
    placar.listar();
});

var jogo = {
    atualizarTamanhoFrase : () => {
        var frase = $(".frase").text();
        var numPalavras  = frase.split(" ").length;
        var tamanhoFrase = $("#tamanho-frase");
        tamanhoFrase.text(numPalavras);
    },
    atualizarTempoInicial : (tempo) => {
        // Atualiza a variável global quando o jogo for reiniciado.
        tempoInicial = tempo;
        $("#tempo-digitacao").text(tempo);
    },
    inputJogador : () => {
        /**
         * O evento 'input' mapeia tudo que o usuário está digitando.
         */
        campo.on("input", function() {
            jogo.inicializarContadores();

            jogo.compararTextoDigitado();
        });
    },
    inicializarContadores : () => {
        var conteudo = campo.val();

        /**
         * Para contar mais precisamente temos que utilizar uma expressão regular no lugar do espaço vazio,
         * uma expressão regular que busca qualquer caractere, exceto espaço vazio, essa expressão é mostrada abaixo.
         *
         * Agora os espaços não são mais considerados como palavras, mas a contagem sempre mostra a quantidade de palavras mais uma,
         * para resolver isso vamos subtrair um do length do conteúdo.
         */
        var qtdPalavras = conteudo.split(/\S+/).length - 1;
        $("#contador-palavras").text(qtdPalavras);

        var qtdCaracteres = conteudo.length;
        $("#contador-caracteres").text(qtdCaracteres);
    },
    compararTextoDigitado : () => {
        var frase = $(".frase").text();
        var digitado = campo.val();

        /**
         * Para saber se o jogador está certo ou não, vamos pegar apenas a parte inicial da frase que possui a mesma quantidade do valor
         * digitado.
         * Isso pode ser feito pela função 'substr' (sub-string):
         * A função substr devolve uma outra string com o tamanho definido nos parâmetros.
         * O primeiro parâmetro é o inicio, aqui '0', ou seja, sempre a partir do primeiro char.
         * O segundo define o fim, que é justamente o tamanho do valor digitado.
         */
        /*
        var comparavel = frase.substr(0 , digitado.length);
        if(digitado == comparavel) {
            campo.addClass("borda-verde").removeClass("borda-vermelha");
        } else {
            campo.addClass("borda-vermelha").removeClass("borda-verde");
        }
        */

        /**
         * A verificação abaixo faz a mesma ação que foi adicionada acima, mas no campo está sendo utilizado o 'toogleClass'.
         * A função mencionada recebe um segundo parâmetro para informar se sempre será adicionado (2º parâmetro com o valor 'true'),
         * ou sempre será removido (2º parâmetro com o valor 'false').
         */
        // var ehCorreto = (digitado == comparavel); // Comparação ECMA 5

        var ehCorreto = frase.startsWith(digitado); // Comparação ECMA 6

        campo.toggleClass("borda-verde", ehCorreto);
        campo.toggleClass("borda-vermelha", !ehCorreto);
    },
    inicializarCronometro : () => {
        /**
         * Na função abaixo não foi utilizado o evento 'click', porque o mesmo não mapeia o campo caso o usuário acesse o input através
         * do 'TAB'(tabulação). No caso, optou-se pelo evento 'focus', porque ele é usado para detectar quando o usuário entra em um campo,
         * não necessariamente digitando.
         *
         * No campo está sendo executada a função 'one'. Ela serve para escutar o evento somente uma vez.
         * A função .one() possuí a mesma sintaxe da função .on().
         * A função 'on' não seria a melhor alternativa, porque se o campo perdesse o foco e retornasse o foco no mesmo, a função
         * seria executada a todo momento, podendo acarretar outros bugs.
         */
        campo.one("focus", function() {
            var tempoRestante = $("#tempo-digitacao").text();
            botaoReiniciar.attr("disabled", true);

            /**
             * A função 'setInterval' é própria do Javascript.
             * Ela faz com que uma determinada ação (passada como primeiro parâmetro),
             * seja executada em um intervalo de tempo (passado como segundo parâmetro, no nosso caso, 1 segundo, ou 1000 milissegundos).
             *
             * Toda função 'setInterval' *retorna o seu próprio id*.
             * No caso, iremos utilizar a referência da mesma, para parar a sua execução quando o tempo tiver terminado.
             */
            var cronometroID = setInterval(function() {
                tempoRestante--;
                $("#tempo-digitacao").text(tempoRestante);

                // Verifica se o tempo acabou para poder desabilitar o textarea.
                if (tempoRestante < 1) {
                    /**
                     * A função abaixo serve para parar a execução da função 'setInterval'.
                     * Ela recebe como argumento, o id da função 'setInterval'.
                     */
                    clearInterval(cronometroID);

                    jogo.finalizar();
                }
            }, 1000);
        });
    },
    finalizar : () => {
        /**
         * Abaixo é utilizada a função 'attr'. Ela serve para resgatar alguma propriedade ou setar algum valor no campo.
         * Exemplo de resgate do atributo 'rows': campo.attr("rows");
         * Exemplo de alteração no atributo 'rows' do textarea: campo.attr("rows", 500);
         */
        campo.attr("disabled", true);

        /**
         * Essa ação de adicionar e remover classes se tornou uma tarefa tão comum, que o jQuery criou uma função
         * específica para isso, a 'toggleClass'.
         * Ela funciona da seguinte maneira, se no momento que a função for chamada, o elemento possuir a classe,
         * ela será removida. Mas se o elemento não possuir a classe, ela será adicionada.
         */
        campo.toggleClass('campo-desativado');

        botaoReiniciar.removeAttr('disabled');

        placar.inserir();
    },
    reiniciar : () => {
        campo.attr("disabled", false)
             .toggleClass('campo-desativado')
             .removeClass('borda-verde')
             .removeClass('borda-vermelha')
             .val('');

        $("#contador-palavras").text("0");
        $("#contador-caracteres").text("0");
        $("#tempo-digitacao").text(tempoInicial);

        // Reinicia o cronômetro.
        jogo.inicializarCronometro();
    }
}