Howter
======

**Howter** é um pequeno roteador criado para organizar a execução do código JavaScript em aplicações web.

- [Instalação](#instalação)
- [Funcionamento básico](#funcionamento-básico)
- [Rotas com múltiplos caminhos](#rotas-com-múltiplos-caminhos)
- [Parâmetros nomeados](#parâmetros-nomeados)
- [Caracter coringa](#caracter-coringa)
- [Prefixos](#prefixos)
- [Expressões regulares](#expressões-regulares)
- [Rotas estendidas](#rotas-estendidas)
- [Compartilhamento de dados](#compartilhamento-de-dados)

## Instalação

Para utilizá-lo, pode-se usar uma das seguintes opções:

- Baixar a [versão mais atualizada do projeto](https://github.com/dzestudio/howter/archive/master.zip);
- Instalar com [Bower](http://bower.io): `bower install howter`;
- Clonar o repositório: `git clone https://github.com/dzestudio/howter.git`.

Em seguida, basta carregar um dos arquivos do diretório `dist` através de uma tag `<script>`:

```html
<!-- Código completo -->
<script src="caminho/completo/até/howter.js"></script>

<!-- Versão minificada -->
<script src="caminho/completo/até/howter.min.js"></script>
```

## Funcionamento básico

Incluída a tag `<script>`, Howter ficará disponível através de uma variável global chamada (adivinhe) `Howter`. Com ele, seu código é dividido em **rotas** e **callbacks**. Na aplicação mais simples possível, você pode usar rotas para organizar a execução do JavaScript de acordo com a URL acessada pelo usuário. Você pode, por exemplo, perguntar o nome do visitante somente quando ele acessar http://example.com/welcome:

```javascript
(function (h) {

    h.route('/welcome', function () {
        var name = prompt('What is your name?', 'Harry Potter');

        alert('Hello, ' + name + '!');
    });

    h.dispatch(window.location.pathname);

}(Howter));

```

Como você pode ver pelo exemplo, o método `Howter.route` recebe dois argumentos, justamente a **rota** ("/welcome") e o **callback**, cuja única função é encapsular o código JavaScript que deve ser executado quando a rota for correspondida.

Quando o método `Howter.dispatch(path)` é chamado, seu argumento `path`
é comparado com cada uma das rotas definidas. Sempre que uma rota correspondente é encontrada, o callback é executado. No exemplo anterior, isso significa que o prompt perguntando o nome do usuário só será exibido quando `window.location.pathname` for "/welcome".

> **Nota**: o método `dispatch` pode ser chamado quantas vezes for necessário e com qualquer valor de `path`. Você pode, por exemplo, usar uma rota para encapsular instruções executadas diversas vezes e executá-la arbitrariamente sempre que necessário com `Howter.dispatch('/common-functions')`.

Para adicionar funcionalidades específicas a outras URLs, basta definir outras rotas:

```javascript
(function (h) {

    h.route('/welcome', function () {
        var name = prompt('What is your name?', 'Harry Potter');

        alert('Hello, ' + name + '!');
    });

    h.route('/contact', function () {
        alert('You reached the contact page!');
    }).route('/error', function () { // Rotas encadeadas!
        alert('You reached the error page!');
    });

    h.dispatch(window.location.pathname);

}(Howter));
```

## Rotas com múltiplos caminhos

Às vezes, é necessário executar o mesmo código JavaScript em duas rotas diferentes. Ao invés de definir duas rotas distintas, podemos passar um array de caminhos ao método `route`:

```javascript
h.route(['/users/list', '/products/list'], function () {
    // ...
});
```

Nesse caso, o callback será executado tanto em http://example.com/users/list quanto em http://example.com/products/list.

## Parâmetros nomeados

Imagine que você queira criar uma rota para páginas de perfil de usuário cujas URLs estão no formato [http://example.com/profile/&lt;username&gt;](http://example.com/user/username). Mesmo com rotas de múltiplos caminhos, não faz muito sentido ter um caminho para cada nome de usuário possível, certo? Seria um array infinito!

Para contornar isso, usamos parâmetros nomeados:

```javascript
h.route('/profile/:username', function (context) {
    alert('Hello, ' + context.params.username + '!');
});
```

Graças a esse trecho variável da URL, o callback será executado com qualquer nome de usuário. Pode-se usar quantos parâmetros nomeados forem necessários e acessar seus valores através do parâmetro `context`, uma instância da classe `Howter.Context` sempre passada como argumento do callback (mesmo quando o omitimos, como nos exemplos anteriores).

A propriedade do contexto que contém todos os parâmetros nomeados pode ser acessada tanto através de `context.params` quanto de `this.params`.

## Caracter coringa

Caracteres coringas são úteis para vincular a execução de callbacks à parte inicial de uma rota, independentemente de como ela termine. Você pode, por exemplo, determinar que todas as rotas iniciadas por "/admin" devam executar determinado código:

```javascript
h.route('/admin/*', function () {
    // ...
});
```

O asterisco é usado como caracter coringa e corresponderá a qualquer combinação de caracteres, repassados ao callback no parâmetro nomeado `this.params.splat`.

## Prefixos

Quando o número de suas rotas começar a crescer, pode ser uma boa ideia agrupá-las por prefixo. Para isso, use o método `Howter.prefix`:

```javascript
h.prefix('/admin', function () {
    // A rota abaixo equivale a /admin/users
    h.route('/users', function () {
        // ...
    });

    // A rota abaixo equivale a /admin/products
    h.route('/products', function () {
        // ...
    });

    h.prefix('/foo', function () {
        // A rota abaixo equivale a /admin/foo/bar
        h.route('/bar', function () {
            // ...
        });
    });
});
```

Você pode definir também um prefixo universal que será injetado antes de todas as rotas. Em rotas baseadas em URL, por exemplo, essa propriedade (`Howter.root`) pode ser setada assincronamente no HTML e evitar que você tenha que alterar todas as rotas quando a aplicação for movida para um subdiretório:

```html
<script>Howter = window.Howter || {}; Howter.root = '/subdirectory';</script>
```

## Expressões regulares

TBD.

## Rotas estendidas

É possível estender ou mesmo redefinir completamente um callback usando o método `Howter.extend(extension)`. Para ver na prática sua utilidade, vamos estender nosso exemplo de [parâmetros nomeados](#parâmetros-nomeados):

```javascript
h.route('/profile/:username', function (context) {
    alert('Hello, ' + context.params.username + '!');
}, 'profile');
```

Note que adicionamos um terceiro parâmetro à declaração da rota: um nome. Isso é necessário porque somente nomeando a rota podemos recuperá-la e estendê-la:

```javascript
h.route('profile').extend(function (original) {
    this.callback = function() {
        this.params.username = 'Amazing ' + this.params.username;

        original.call(this, this);
    };
});
```

A extensão é uma função que recebe o callback original como primeiro argumento e seu contexto na variável `this`. O exemplo acima altera o contexto concatenando a string "Amazing " ao parâmetro `name` e depois chama o callback original, recebido no argumento `original`.

## Compartilhamento de dados

TBD.
