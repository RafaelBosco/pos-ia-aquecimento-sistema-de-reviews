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
  - UI/UX: Boa esperiencia de uso atraves de uma interface bonita, elegante e moderna
  - Performance: o processo de criação de conta precisa ser rapido

## Você deve
- Criar a base do projeto com um endpoint inicial para criação de conta
- Criar a base do projeto com uma pagina inicial para a interface de criação de conta
- configurar as bibliotecas base

## Você não deve
- Implementar qualquer outra funcionalidade que nao esteja relacionada com signup (criação de contas)
- Não vamos realizar envios de email no momento. Apenas processar a requisição, salvar no banco de dados e retornar um sucesso

## Tecnologias (stack)
React.js, Next.js, React-hook-form, shadcn, tailwindcss, supabase, TRPC, Bunjs

## Critérios de aceitação
- Temos uma pagina para criar a nova conta em `/auth/sign-up`
- A pagina contem um formulario com validação
- A plataforma consegue se comunicar com a API para enviar os dados e receber uma resposta
- Estamos informando possiveis erros
  - Mostrar alert em vermelho no formulário
- Estamos informando o sucesso de criação da conta
  - Navegar para `/auth/sign-up/success`

## Resultado
- Pessoas conseguem criar uma nova conta na plataforma
