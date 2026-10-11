# Sign-up (Criação de conta)

## Escopo
Front-end, back-end, banco de dados

## Contexto
Criação do fluxo de criação de contas da plataforma, é necessário fornecer:
- Primeiro nome
- Sobrenome
- Email
- Senha
- Confirmação de senha

## Requisitos funcionais
1. Adicionar validação no formulário na camada de cliente
   1. Caso o formulário esteja valido, podemos enviar a requisição para API
2. Os campos de nome e sobrenome devem ser separados
3. Criar uma nova conta no banco de dados na tabela de `accounts`
   1. `id`: nanoid (gerado com `nanoid` na camada de API)
   2. `first_name`: string
   3. `last_name`: string
   4. `created_at`: timestamp
   5. `updated_at`: timestamp
   6. `active`: boolean
   7. `email`: string
   8. `password`: string (hashed)
   9. `salt`: string (hashed)
4.  A requisição deve ser um `POST` para `/api/v1/sign-up` e receber os dados como JSON no `body`
5.  Caso tudo de certo retornar `201` ou erros de acordo com a validação
    1.  `400`: Má formatação de dados


## Requisitos não funcionais
- Segurança: Salvar as senhas de forma segura no banco de dados
  - Receber dados do cliente de forma segura usando https (previnir network sniffing e ataques man-in-the-middle)
  - 

## Você deve
TODO

## Você não deve
TODO

## Tecnologias (stack)
React.js, Next.js, React-hook-form, shadcn, tailwindcss, supabase, TRPC

## Critérios de aceitação
TODO

## Resultado
TODO
