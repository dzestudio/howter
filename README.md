Howter
======

**Howter** é um pequeno roteador criado para organizar a execução do código JavaScript em qualquer aplicação web. (nenhuma dependência)

Para utilizá-lo, basta baixar a versão mais atualizada do arquivo e incluí-la normalmente através de uma tag `<script>`:

```html
<script src="caminho/completo/até/howter.min.js"></script>
```

Incluída a tag `<script>`, Howter ficará disponível através de uma variável global chamada (adivinhe) `Howter`. O próximo passo é definir sua primeira rota:

```javascript
(function (h) {

    h.route('/', function () {
        alert('Hello, world!');
    });

}(Howter));
```

Uma rota é composta por um ou mais caminhos e uma função. Quando um dos caminhos corresponde ao caminho atual, a função é executada. No exemplo anterior, o usuário verá a mensagem "Hello, world!" se e somente se o caminho for `/`.

Mas afinal, de qual caminho estamos falando? É a URL atual do usuário?

Não necessariamente. Para tornar o roteador reutilizável em qualquer tipo de projeto JavaScript, é preciso especificar explicitamente o caminho atual. Isso é feito através do método `dispatch(path)`:

```javascript
(function (h) {

    h.route('/', function () {
        alert('Hello, world!');
    });

    h.dispatch(window.location.pathname);

}(Howter));
```

Agora está melhor. A mensagem será exibida se o usuário acessar http://localhost/ (ou http://www.foo.com/, http://www.example.com/ etc).

Para adicionar funcionalidades específicas a outro caminho (uma página de contato, por exemplo), basta definir outra rota:

```javascript
(function (h) {

    h.route('/', function () {
        alert('Hello, world!');
    });

    h.route('/contact', function () {
        alert('You reached the contact page!');
    });

    h.dispatch(window.location.pathname);

}(Howter));
```