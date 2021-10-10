# tests-js
Nesse desafio, você deverá criar testes unitários para uma aplicação já pronta usando tudo que aprendeu até agora sobre testes. Para que você possa focar somente na parte de testes unitários sem precisar estudar muito a aplicação do zero, o template foi desenvolvido com base em uma aplicação já conhecida: FinAPI. A API construída no primeiro módulo da trilha.

## ✅ To-do
- [X] POST `/api/v1/users` <br />
A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`.

- [X] POST `/api/v1/sessions` <br />
A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.

Essa aplicação não possui refresh token, ou seja, o token criado dura apenas 1 dia e deve ser recriado após o período mencionado.

- [X] GET `/api/v1/profile` <br />
A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

- [X] GET `/api/v1/statements/balance` <br />
A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

- [X] POST `/api/v1/statements/deposit` <br />
A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

- [X] POST `/api/v1/statements/withdraw` <br />
A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.

- [X] GET `/api/v1/statements/:statement_id` <br />
A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.
