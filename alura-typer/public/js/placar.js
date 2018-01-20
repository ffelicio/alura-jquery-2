let placar = {
    inserir : () => {
        /**
         * A função .find() recebe como parâmetro seletores CSS, e busca em seus filhos algum elemento que atenda aquela busca.
         */
        var corpoTabela = $(".placar").find("tbody");
        var usuario = "Fernando";
        var palavras = $("#contador-palavras").text();
        var caracteres = $("#contador-caracteres").text();
        var linha = placar.montarLinha(usuario, caracteres, palavras);

        /**
         * A função .append adiciona a string ou elemento HTML que é passada como parâmetro,
         * como último filho do elemento em qual ela for chamada.
         */
        // corpoTabela.append(linha);

        /**
         * A função .prepend adiciona a string ou elemento HTML que é passada como parâmetro,
         * como primeiro filho do elemento em qual ela for chamada.
         */
        corpoTabela.prepend(linha);

        // Abre a lista de placares
        $(".placar").slideDown(500);

        placar.scrollar();

        placar.remover();
    },
    listar : () => {
        $.get("http://localhost:3000/placar", (placares) => {
            if(placares.length > 0) {
                $(placares).each(function() {
                    var linhas = placar.montarLinha(this.usuario, this.caracteres, this.pontos);
                    $('tbody').append(linhas);
                    placar.remover();
                });
            }
        });
    },
    montarLinha : (usuario, caracteres, palavras) => {
        /**
         * Realizará a criação dos elementos das linhas da tabela diretamente com jQuery, para poder criar efetivamente
         * o html, ou seja, guardando na memória para poder utilizar posteriormente.
         */
        var linha = $("<tr>");
        var colunaUsuario = $("<td>").text(usuario);
        var colunaCaracteres = $("<td>").text(caracteres);
        var colunaPalavras = $("<td>").text(palavras);
        var colunaRemover = $("<td>");

        var link = $("<a>").attr("href", "#").addClass("botao-remover");
        var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

        // Icone dentro do <a>
        link.append(icone);

        // <a> dentro do <td>
        colunaRemover.append(link);

        linha.append(colunaUsuario);
        linha.append(colunaCaracteres);
        linha.append(colunaPalavras);
        linha.append(colunaRemover);

        return linha;
    },
    remover : () => {
        $('.botao-remover').click(function(event) {
            event.preventDefault();

            /**
             * Remove a linha da tabela, mas neste caso deverá subir a árvore do DOM para chegar a linha da tabela.
             * $(this) -> botão de remoção
             *  .parent() -> td (coluna) que engloba o botão de remoção
             *  .parent() -> tr (linha) da tabela
             *  .remove() -> instrução para remover a linha.
             */

            /**
             * Remove a linha da tabela.
             * Neste caso, está sendo utilizada a função .closest. Ela é responsável por buscar o elemento mais próximo do objeto
             * instanciado, no nosso caso a instrução "$(this)" que se refere ao botão de excluir.
             * No mesmo pode ser incluídos elemento html, id ou classe.
             */
            var linhaPlacar = $(this).closest('tr');

            /**
             * A função .fadeOut é responsável por remover a opacidade do elemento até um ponto e depois modifica a sua
             * propriedade "display".
             * A função .fadeIn é responsável por mostrar o elemento fazendo a transição da opcidade.
             * Existe também a função fadeToggle(), sendo responsável por alternar entre as 2 funções.
             * Todas as funções de fade mencionadas, recebe um parâmetro(opcional) que se refere ao tempo de execução da ação.
             * O tempo é em milisegundos.
             */
            linhaPlacar.fadeOut(1000);

            /**
             * A remoção da linha está envolvida na função setTimeout, para poder fazer a exclusão após a finalização da ação de fade
             * tratada acima.
             */
            setTimeout(() => {
                linhaPlacar.remove();
            }, 1000);
        });
    },
    mostrar : () => {
        /**
         * A função .slideToggle é um atalho para as funções .slideUp e .slideDown.
         * Ela retira a necessidade de utilizarmos algum tipo de lógica para poder realizar
         * a ação para mostrar ou o enconder o elemento.
         * O parâmetro(opcional), se refere ao tempo de transição. Ele é contado como millisegundos.
         *
         * A função .stop também foi incluída, para poder evitar a ação de slide várias vezes quando o usuário clica no botão
         * repetidamente.
         * Essa função faz exatamente o que precisamos, a animação que estiver acontecendo no momento é interrompida,
         * e uma próxima é iniciada.
         */
        $('.placar').stop().slideToggle(600);
    },
    scrollar : () => {
        // Nesta função será aplicado o scroll até a lista de placares.

        /**
         * A função .offset nos dá a posição em que determinado elemento se encontra na página. Esta função nos retorna a distância
         * que o elemento está do topo e a esquerda da página.
         * Abaixo está sendo utilizado o .top para poder resgatar a distância do elemento até o topo da página e fazer o scroll. 
         */
        var posicaoPlacar = $(".placar").offset().top;

        /**
         * Abaixo estamos utilizando a função .animate para poder fazer o scroll até a lista de placares.
         * Ela recebe dois parâmetros, um objeto que contém as propriedades CSS a serem animadas e os seus valores,
         * e o tempo de duração da animação.
         * 
         * Para fazer o scroll está sendo utilizada a propriedade 'scrollTop', ela recebe um valor em pixels,
         * que representa a posição da nossa página para onde desejamos scrollar.
         */
        $('html').animate({
            scrollTop: posicaoPlacar + "px"
        }, 1000);
    },
    salvar : () => {
        var placar = [];

        // Pega todos os tr's filhos de tbody
        var linhas = $("tbody>tr");

        linhas.each(function(){
            var usuario = $(this).find("td:nth-child(1)").text();
            var caracteres = $(this).find("td:nth-child(2)").text();
            var palavras = $(this).find("td:nth-child(3)").text();

            var score = { usuario : usuario, pontos : palavras, caracteres : caracteres };

            placar.push(score);
        });

        var dados = { "placar" : placar };

        $.post("http://localhost:3000/placar", dados, function(){
            console.log("Placar sincronizado com sucesso");
        });
    }
}

$('#botao-placar').click(placar.mostrar);
$("#botao-sync").click(placar.salvar);