# Sistema de Reviews - Sign Up

Sistema de criação de contas com Next.js 15, TRPC, Supabase, Shadcn/UI, TailwindCSS e Biome.

## Stack

- **Framework**: Next.js 15 (App Router, React 19 RC)
- **API**: TRPC v11 (end-to-end type safety)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Custom com bcryptjs (hash de senha)
- **UI**: Shadcn/UI + TailwindCSS
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query (React Query)
- **Lint/Format**: Biome
- **Package Manager**: Bun

## Setup

### 1. Instalar dependências

```bash
bun install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env.local
```

### 3. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute a migration em `supabase/migrations/001_create_accounts_table.sql` no SQL Editor do Supabase
3. Copie a URL e as chaves (anon + service_role) para o `.env.local`

### 4. Rodar em desenvolvimento

```bash
bun dev
```

Acesse `http://localhost:3000` - redireciona automaticamente para `/auth/sign-up`

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts    # TRPC endpoint
│   ├── auth/sign-up/
│   │   ├── page.tsx                # Página de cadastro
│   │   └── success/page.tsx        # Página de sucesso
│   ├── globals.css                 # Estilos globais + Tailwind
│   ├── layout.tsx                  # Layout raiz
│   ├── page.tsx                    # Redirect para sign-up
│   └── providers.tsx               # Providers (TRPC, Query, Toast)
├── components/
│   └── ui/                         # Componentes Shadcn/UI
├── hooks/
│   └── use-toast.ts                # Hook de toast notifications
├── lib/
│   ├── auth/password.ts            # Hash/verify bcryptjs
│   ├── supabase.ts                 # Client Supabase (anon)
│   ├── supabase-admin.ts           # Client Supabase (service role)
│   └── utils.ts                    # Utilitários (cn)
└── trpc/
    ├── client.tsx                  # Cliente TRPC + React Query
    ├── context.ts                  # Contexto TRPC (supabase admin)
    ├── init.ts                     # Inicialização TRPC
    ├── provider.tsx                # Provider TRPC
    ├── root.ts                     # Router principal
    └── routers/
        └── auth.ts                 # Router de autenticação (signUp)
```

## Funcionalidades Implementadas

### Sign Up (`/auth/sign-up`)

- ✅ Formulário com validação client-side (Zod + React Hook Form)
- ✅ Campos: Primeiro nome, Sobrenome, Email, Senha, Confirmar senha
- ✅ Validações: obrigatórios, email válido, senha min 8 chars, senhas coincidem
- ✅ Integração TRPC com React Query (mutation)
- ✅ Hash de senha com bcryptjs (salt + hash)
- ✅ Inserção na tabela `accounts` do Supabase
- ✅ Tratamento de erros: email duplicado, erros de servidor
- ✅ Feedback visual: Alert vermelho para erros, Toast verde para sucesso
- ✅ Loading state no botão
- ✅ Redirecionamento para `/auth/sign-up/success` após sucesso

### Success Page (`/auth/sign-up/success`)

- ✅ Confirmação visual de conta criada
- ✅ Link para login (preparado para futura implementação)
- ✅ Link para criar outra conta

## Scripts Disponíveis

```bash
bun dev          # Desenvolvimento
bun build        # Build de produção
bun start        # Produção
bun lint         # Biome check
bun lint:fix     # Biome fix
bun format       # Biome format
```

## Próximos Passos (fora do escopo atual)

- [ ] Sign In / Login
- [ ] JWT / Session management
- [ ] Password reset
- [ ] Email verification
- [ ] Reviews CRUD
- [ ] Mastra.ai agents
- [ ] N8N workflows