# FINTRACK — Documentação Viva de Arquitetura

**Versão:** 1.0.0  
**Última atualização:** Junho 2026  
**Status do Projeto:** Em desenvolvimento ativo (Etapa 4.3)  
**Responsabilidade:** Guia arquitetural permanente para contexto futuro de IAs

---

## 📋 Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Autenticação](#5-autenticação)
6. [Banco de Dados](#6-banco-de-dados)
7. [React Query & Cache](#7-react-query--cache)
8. [Etapas Implementadas](#8-etapas-implementadas)
9. [Estado Atual do Projeto](#9-estado-atual-do-projeto)
10. [Roadmap Futuro](#10-roadmap-futuro)
11. [Padrões Obrigatórios](#11-padrões-obrigatórios)
12. [Fluxos Críticos](#12-fluxos-críticos)
13. [Manutenção e Evolução](#13-manutenção-e-evolução)

---

## 1. Visão Geral do Projeto

### O que é FinTrack?

**FinTrack** é uma plataforma SaaS (Software as a Service) moderna e responsiva para **gestão financeira pessoal inteligente**. O sistema foi desenvolvido com a mais alta qualidade arquitetural, seguindo padrões enterprise de separação de responsabilidades, tipagem forte e persistência real.

### Objetivo Principal

Fornecer ao usuário uma **ferramenta completa de controle financeiro** que permita:

- ✅ Registrar receitas e despesas em tempo real
- ✅ Visualizar métricas financeiras consolidadas
- ✅ Acompanhar gráficos e tendências históricas
- ✅ Filtrar e buscar transações por múltiplos critérios
- ✅ Exportar e gerar relatórios analíticos
- ✅ Definir e acompanhar metas financeiras
- ✅ Gerenciar múltiplas carteiras/contas

### Público-Alvo

- Pessoas físicas que desejam controlar suas finanças pessoais
- Micro-empreendedores que precisam de gestão básica financeira
- Usuários em busca de inteligência financeira acessível

### Proposta de Valor

| Aspecto | Diferencial |
|--------|------------|
| **Experiência** | Interface intuitiva e moderna com design system completo |
| **Performance** | Cache inteligente com React Query e invalidação automática |
| **Confiabilidade** | Autenticação real com Supabase, dados persistentes |
| **Escalabilidade** | Arquitetura pronta para múltiplos usuários e crescimento |
| **Qualidade** | Tipagem forte TypeScript, sem `any`, zero lint errors |

### Visão Futura

O FinTrack está evoluindo para uma **plataforma de inteligência financeira completa** com:

- 🔮 Análise preditiva com IA
- 🔮 Recomendações personalizadas de economia
- 🔮 Integração bancária para sincronização automática
- 🔮 Mobile-first com suporte offline
- 🔮 API pública para integrações terceiras
- 🔮 Funcionalidades multi-usuário (compartilhamento de carteiras)

---

## 2. Stack Tecnológica

### Dependências Principais

#### Frontend Framework

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **React** | 19.2.6 | Framework de UI | Componentes reutilizáveis, estado previsível, grande comunidade |
| **TypeScript** | ~6.0.2 | Tipagem estática | Segurança de tipo, detecção de erros em build time, IDE superior |
| **React Router** | 7.17.0 | Roteamento | Navegação SPA eficiente, protected routes, query params |

#### Build & Development

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **Vite** | 8.0.12 | Build tool | Compilação ultrarrápida, HMR instantâneo, suporte ESM nativo |
| **ESLint** | 10.3.0 | Linting | Qualidade de código, padrões consistentes, detecção de bugs |
| **Prettier** | 3.8.3 | Formatação | Estilo de código consistente, zero discussões sobre formatação |

#### Estado & Data Fetching

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **React Query** | 5.101.0 | State management de dados assíncronos | Sincronização automática, cache inteligente, refetch automático |
| **@tanstack/react-table** | 8.21.3 | Tabelas avançadas | Paginação, sorting, filtering com performance |

#### Forms & Validação

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **React Hook Form** | 7.77.0 | Gerenciamento de formulários | Performance, integração com validação, estado mínimo |
| **Zod** | 4.4.3 | Validação de schema | Type-safe validation, inferência automática de tipos |

#### Backend & Banco de Dados

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **Supabase** | 2.107.0 | Backend as a Service | PostgreSQL gerenciado, auth nativa, RLS, SDK TypeScript |
| **PostgreSQL** | (cloud) | Banco de dados | Confiabilidade, suporte SQL avançado, ACID compliance |

#### UI & Styling

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **Tailwind CSS** | 4.3.0 | CSS utility-first | Prototipagem rápida, responsiveness automática, customização ilimitada |
| **shadcn/ui** | 4.10.0 | Componentes UI | Componentes acessíveis, cópia local do código, controle total |
| **lucide-react** | 1.17.0 | Iconografia | 1000+ ícones, importação tree-shakeable, design consistente |
| **next-themes** | 0.4.6 | Theme switching | Dark mode nativo, persistência, sem flash |

#### Visualização de Dados

| Tecnologia | Versão | Propósito | Por quê? |
|-----------|--------|----------|---------|
| **Recharts** | 3.8.1 | Gráficos interativos | Componentes compostos, responsivos, excelente performance |

#### Utilitários

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **clsx** | 2.1.1 | Concatenação de classes CSS condicional |
| **tailwind-merge** | 3.6.0 | Merge inteligente de classes Tailwind |
| **class-variance-authority** | 0.7.1 | Gerenciamento de variantes de componentes |

### Arquitetura de Dependências

```
src/
├── main.tsx (entry point)
├── App.tsx (root component)
├── app/
│   └── providers.tsx (QueryClientProvider, AuthProvider, RouterProvider)
└── ... (resto do código)
```

**Provider Stack (ordem importante):**
```tsx
<QueryClientProvider>  // React Query
  <AuthProvider>       // Supabase Auth
    <ThemeProvider>    // Dark mode
      <RouterProvider> // Routing
        <App />
      </RouterProvider>
    </ThemeProvider>
  </AuthProvider>
</QueryClientProvider>
```

---

## 3. Arquitetura do Sistema

### Fluxo de Dados Global

```
┌─────────────────────────────────────────────────┐
│            UI Layer (React Components)           │
│  - Pages (dashboard, transactions, etc)         │
│  - Components (cards, charts, tables)           │
│  - Forms (transaction creation, filtering)      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│        Hooks Layer (Custom React Hooks)         │
│  - useTransactions, useDashboardSummary         │
│  - useCreateTransaction, useUpdateTransaction  │
│  - useBalanceChart, useExpensesChart            │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│        React Query Layer (State Management)     │
│  - queryClient, queryKeys centralizadas         │
│  - Caching automático, invalidação inteligente  │
│  - Sincronização automática de mutations        │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│       Services Layer (Business Logic)           │
│  - dashboard-service (agregações)              │
│  - transaction.service (CRUD)                  │
│  - auth.service (autenticação)                 │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│     Supabase SDK (Database Abstraction)         │
│  - SQL queries, auto-generated types            │
│  - RLS policies (Row Level Security)            │
│  - Auth management                              │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│        PostgreSQL (Data Persistence)            │
│  - transactions table                           │
│  - auth.users (gerenciado pelo Supabase)        │
│  - policies (RLS)                               │
└─────────────────────────────────────────────────┘
```

### Separação de Responsabilidades

#### Camada de UI (Components)

**Responsabilidades:**
- Renderizar elementos visuais
- Coletar input do usuário
- Disparar ações (mutations, navegação)
- Exibir loading/error states

**Restrições:**
- ❌ Não fazer chamadas diretas a `supabase`
- ❌ Não conter lógica de negócio complexa
- ❌ Não disparar queries diretamente
- ✅ Apenas usar hooks customizados

**Exemplo:**
```tsx
// ✅ Correto: usar hook
function MyComponent() {
  const { data, isLoading } = useTransactions()
  return <div>{data?.length}</div>
}

// ❌ Errado: chamada direta ao Supabase
function MyComponent() {
  const [data, setData] = useState(null)
  useEffect(() => {
    supabase.from('transactions').select() // ❌
  }, [])
}
```

#### Camada de Hooks (Custom Hooks)

**Responsabilidades:**
- Abstrair React Query
- Formatar dados para componentes
- Conectar mutations com invalidações
- Gerenciar loading/error states locais

**Restrições:**
- ❌ Não contêm lógica de negócio pesada
- ❌ Não fazem chamadas diretas ao Supabase
- ✅ Delegam operações a Services

**Exemplo:**
```ts
// ✅ Correto: abstrair React Query
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.list,
    queryFn: getTransactions,
  })
}

// Componente fica limpo
function MyComponent() {
  const { data } = useTransactions()
}
```

#### Camada de React Query (State Management)

**Responsabilidades:**
- Cachear dados automaticamente
- Gerenciar queryKeys centralizadas
- Invalidar queries após mutations
- Refetch automático

**Restrições:**
- ❌ Não contêm lógica de agregação
- ❌ Não fazem transformações complexas de dados
- ✅ Apenas orquestram fetch e cache

**Exemplo:**
```ts
// useCreateTransaction invalidação automática
export function useCreateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      // Invalida tudo que depende de transações
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.list,
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      })
    },
  })
}
```

#### Camada de Services (Business Logic)

**Responsabilidades:**
- Implementar regras de negócio
- Fazer agregações e transformações
- Chamar Supabase SDK
- Tratamento de erros

**Restrições:**
- ❌ Não usam React Hooks
- ❌ Não têm estado local
- ✅ Funções puras (ou async puras)

**Exemplo:**
```ts
// ✅ Correto: lógica pura em service
export async function getDashboardSummary() {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)
  
  const income = data
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
  
  return { income, balance: ... }
}
```

#### Supabase SDK (Database Abstraction)

**Responsabilidades:**
- Executar queries SQL
- Gerenciar autenticação
- Aplicar RLS
- Fornecer tipos auto-gerados

---

## 4. Estrutura de Pastas

```
/workspaces/fintrack/fintrack/
│
├── public/                          # Arquivos estáticos
│   └── (favicon, manifests, etc)
│
├── src/
│   ├── main.tsx                    # Entry point da aplicação
│   ├── App.tsx                     # Root component
│   │
│   ├── app/
│   │   └── providers.tsx           # Provider wrapper
│   │
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── dashboard/              # Dashboard-specific
│   │   │   ├── financial-overview.tsx    (cards com métricas)
│   │   │   ├── metric-card.tsx           (card individual)
│   │   │   ├── recent-transactions.tsx   (tabela recente)
│   │   │   ├── charts-empty-state.tsx
│   │   │   ├── dashboard-empty-state.tsx
│   │   │   └── quick-actions.tsx
│   │   │
│   │   ├── charts/                 # Componentes de gráficos
│   │   │   ├── balance-chart.tsx        (gráfico de saldo)
│   │   │   ├── expenses-chart.tsx       (receitas/despesas)
│   │   │   └── chart-container.tsx      (wrapper comum)
│   │   │
│   │   ├── layout/                 # Layout estrutural
│   │   │   ├── app-layout.tsx           (container principal)
│   │   │   ├── app-sidebar.tsx          (navegação)
│   │   │   ├── app-header.tsx           (cabeçalho com greetings)
│   │   │   └── theme-toggle.tsx         (dark/light mode)
│   │   │
│   │   └── ui/                     # shadcn/ui + custom
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── form.tsx               (form wrapper com React Hook Form)
│   │       ├── badge.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── sheet.tsx
│   │       ├── separator.tsx
│   │       ├── label.tsx
│   │       └── textarea.tsx
│   │
│   ├── features/                   # Feature modules com colocation
│   │   └── transactions/
│   │       ├── components/         # Componentes de transações
│   │       ├── hooks/              # Custom hooks
│   │       ├── services/           # Lógica de transações
│   │       ├── types/              # Types exclusivos do feature
│   │       ├── schemas/            # Zod schemas
│   │       ├── constants/          # Constantes do feature
│   │       └── mocks/              # Mock data
│   │
│   ├── hooks/                      # Custom hooks globais
│   │   ├── dashboard/
│   │   │   ├── use-dashboard-summary.ts      (agregações)
│   │   │   ├── use-dashboard-metrics.ts      (cards)
│   │   │   ├── use-balance-chart.ts          (saldo)
│   │   │   ├── use-expenses-chart.ts         (receitas/despesas)
│   │   │   └── use-transactions.ts           (listagem)
│   │   │
│   │   └── transaction/
│   │       └── use-transaction-filters.ts
│   │
│   ├── services/                   # Business logic layer
│   │   ├── auth/
│   │   │   └── auth.service.ts          (signup, signin, logout)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard-service.ts      (getDashboardSummary, etc)
│   │   │   └── dashboard-aggregation.ts  (aggregateByMonth, etc)
│   │   │
│   │   └── transaction/
│   │       └── transaction.service.ts    (CRUD de transações)
│   │
│   ├── providers/                  # React Context providers
│   │   ├── auth-context.ts         (contexto)
│   │   ├── auth-provider.tsx        (provider com Supabase)
│   │   └── theme-provider.tsx       (dark mode)
│   │
│   ├── routes/                     # Roteamento e proteção
│   │   ├── router.tsx              (criação das rotas)
│   │   └── protected-route.tsx      (wrapper de autenticação)
│   │
│   ├── pages/                      # Page components
│   │   ├── auth/
│   │   │   └── login-page.tsx
│   │   ├── dashboard/
│   │   │   └── dashboard-page.tsx
│   │   ├── transactions/
│   │   │   └── transactions-page.tsx
│   │   ├── wallets/
│   │   │   └── wallets-page.tsx
│   │   ├── goals/
│   │   │   └── goals-page.tsx
│   │   ├── reports/
│   │   │   └── reports-page.tsx
│   │   └── settings/
│   │       └── settings-page.tsx
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── database.types.ts        (gerado automaticamente pelo Supabase)
│   │   ├── dashboard.ts             (tipos do dashboard)
│   │   └── transaction.types.ts      (tipos de transações)
│   │
│   ├── schemas/                    # Zod validation schemas
│   │   └── transaction.schema.ts
│   │
│   ├── constants/                  # Constantes globais
│   │   └── transaction-categories.ts
│   │
│   ├── lib/                        # Utilitários & configurações
│   │   ├── supabase.ts             (inicialização do cliente)
│   │   ├── react-query.ts          (QueryClient config)
│   │   ├── query-keys.ts           (queryKeys centralizadas)
│   │   └── utils.ts                (funções utilitárias)
│   │
│   ├── utils/                      # Funções de utilitários
│   │   └── transaction-formatters.ts (formatCurrency, etc)
│   │
│   ├── styles/                     # CSS global
│   │   ├── global.css              (Tailwind directives)
│   │   └── tokens.css              (design tokens customizados)
│   │
│   └── mocks/                      # Mock data para dev/testes
│       └── dashboard/
│           └── dashboard-data.ts
│
├── vite.config.ts                  # Configuração do Vite
├── tsconfig.json                   # Configuração do TypeScript
├── tailwind.config.ts              # Configuração do Tailwind
├── eslint.config.js                # Configuração do ESLint
├── package.json                    # Dependências e scripts
└── README.md                       # Documentação do projeto
```

### Padrão de Organização: Feature Colocation

O projeto utiliza **Feature Colocation** em `src/features/`:

```
features/transactions/
├── components/         # Componentes específicos do feature
├── hooks/              # Custom hooks (useTransactions, etc)
├── services/           # Serviços (transaction.service.ts)
├── types/              # Types exclusivos
├── schemas/            # Zod schemas
├── constants/          # Constantes
└── mocks/              # Mock data
```

**Benefícios:**
- 🎯 Localidade: tudo de um feature em um só lugar
- 🔍 Facilita encontrar código relacionado
- 🚀 Escalabilidade: adicionar features sem desorganizar
- 🧹 Facilita deletar features inteiras

---

## 5. Autenticação

### Fluxo de Autenticação

```
Usuario acessa /login
        ↓
  Digita email/senha
        ↓
  signUp() / signIn() (auth.service.ts)
        ↓
  Supabase valida credenciais
        ↓
  Retorna session + user
        ↓
  AuthProvider salva em context
        ↓
  ProtectedRoute valida user
        ↓
  Redireciona para /dashboard
```

### AuthProvider (src/providers/auth-provider.tsx)

O `AuthProvider` é responsável por:

1. **Inicializar session** no mount
   - Chama `supabase.auth.getSession()`
   - Popula contexto com user/session/loading

2. **Sincronizar auth state**
   - Subscribe a `onAuthStateChange`
   - Atualiza contexto automaticamente

3. **Persistência automática**
   - Supabase cuida de localStorage
   - Session persiste após page reload

```tsx
// Estrutura do AuthContext
interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
}

// Uso em componentes
const { user, loading } = useContext(AuthContext)
```

### ProtectedRoute (src/routes/protected-route.tsx)

Valida se usuário está autenticado antes de renderizar página:

```tsx
<ProtectedRoute>
  <DashboardPage />  {/* Só renderiza se user existe */}
</ProtectedRoute>

// Se não autenticado: redireciona para /login
```

### Segurança: Row Level Security (RLS)

**Supabase RLS Policy na tabela `transactions`:**

```sql
-- Usuário pode ler apenas suas transações
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário pode criar apenas com seu próprio user_id
CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário pode atualizar apenas suas transações
CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuário pode deletar apenas suas transações
CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Implicações:**
- ✅ Mesmo se um usuário enviar `user_id` errado, Supabase rejeita
- ✅ Não precisa validar `user_id` no frontend
- ✅ Segurança de banco de dados nativa
- ✅ Sem necessidade de autorização manual

---

## 6. Banco de Dados

### Esquema PostgreSQL

#### Tabela: `transactions`

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  
  amount NUMERIC(15, 2) NOT NULL,
  -- Valores sempre positivos, tipo indica sinal
  -- Ex: amount=100, type='income' = +100
  
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  
  category VARCHAR(100) NOT NULL,
  
  transaction_date DATE NOT NULL,
  -- Data da transação (não UTC, data local)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount > 0)
);

CREATE INDEX idx_transactions_user_id 
  ON transactions(user_id);

CREATE INDEX idx_transactions_user_date 
  ON transactions(user_id, transaction_date);

CREATE INDEX idx_transactions_type 
  ON transactions(user_id, type);
```

### Tipos TypeScript (Auto-gerados)

```ts
// src/types/database.types.ts (GERADO AUTOMATICAMENTE)

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          type: 'income' | 'expense'
          category: string
          transaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          type: 'income' | 'expense'
          category: string
          transaction_date: string
          created_at?: string
        }
        Update: {
          // Todos os campos opcionais
          id?: string
          user_id?: string
          // ... rest
        }
      }
    }
  }
}
```

### Queries Principais

#### Listar Transações (com ordenação)

```ts
// src/features/transactions/services/transaction.service.ts
export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
  
  if (error) throw error
  return data
}
```

**RLS garante:** usuário vê apenas suas transações

#### Agregação: Dashboard Summary

```ts
export async function getDashboardSummary() {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)
  
  if (error) throw error
  
  // Processado em JavaScript
  const income = data
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
  
  return {
    balance: income - expenses,
    income,
    expenses,
    transactionsCount: data.length,
  }
}
```

**Nota:** Agregações são feitas em JavaScript, não SQL. Alternativa seria usar VIEW ou função SQL.

---

## 7. React Query & Cache

### Estrutura de Query Keys

Todas as query keys são **centralizadas** em `src/lib/query-keys.ts`:

```ts
export const queryKeys = {
  transactions: {
    list: ['transactions', 'list'] as const,
    details: (id: string) => ['transactions', 'details', id] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
    metrics: ['dashboard', 'summary'] as const,  // alias
    expensesChart: ['dashboard', 'expenses-chart'] as const,
    balanceChart: ['dashboard', 'balance-chart'] as const,
    recentTransactions: ['dashboard', 'recent-transactions'] as const,
  },
}
```

**Benefícios:**
- 🔑 Chaves centralizadas = sem duplicação
- 🎯 Invalidação precisa e coordenada
- 🔍 Fácil de auditar quais queries existem
- 🧹 Refactor simples se mudar estrutura

### Fluxo de Cache & Invalidação

#### 1. Query Simples (Read)

```ts
// Hook
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.list,
    queryFn: getTransactions,
    // Default: retry=1, refetchOnWindowFocus=false
  })
}

// Componente
function MyComponent() {
  const { data, isLoading } = useTransactions()
  // Primeira execução: fetch
  // Próximas 5 minutos: usar cache (staleTime padrão)
  // Após 5 min: marca como stale mas mantém cache
  // Quando volta da aba: refetch (staleTime expired)
}
```

#### 2. Mutation com Invalidação

```ts
export function useCreateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      // Invalida queries afetadas
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.list,
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.recentTransactions,
      })
      // React Query refetch automaticamente
      // UI atualiza com dados reais do servidor
    },
  })
}
```

**Sequência:**
```
1. usuário clica em "Criar transação"
   ↓
2. mutation é enviada (POST ao Supabase)
   ↓
3. Supabase confirma criação
   ↓
4. onSuccess dispara
   ↓
5. invalidateQueries marca queries como stale
   ↓
6. React Query refetch automático
   ↓
7. Dashboard atualiza com nova transação
```

### Configuração Global (src/lib/react-query.ts)

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                          // Retry 1x em erro
      refetchOnWindowFocus: false,        // Não refetch ao focar aba
      // staleTime padrão: 0 (sempre considerado stale)
      // gcTime padrão: 5 min (cache mantido 5 min após unused)
    },
  },
})
```

### Padrão de Hooks com React Query

```ts
// ✅ Padrão correto
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.list,
    queryFn: getTransactions,
  })
}

// ✅ Padrão com argumentos
export function useTransactionFilters(filters: Filters) {
  return useQuery({
    queryKey: queryKeys.transactions.filtered(filters),  // Key muda com filtros
    queryFn: () => getTransactionsFiltered(filters),
  })
}

// ✅ Padrão de mutation com invalidação
export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.list,
      })
    },
  })
}
```

---

## 8. Etapas Implementadas

### 📍 ETAPA 1: Fundação Arquitetural

**Duração:** Semana 1  
**Status:** ✅ Concluído

**Objetivos:**
- Criar projeto React + TypeScript com Vite
- Configurar routing com React Router
- Integrar Supabase e tipos auto-gerados
- Implementar autenticação básica
- Setup de componentes UI (shadcn/ui)

**O que foi implementado:**
- ✅ Vite + React 19 + TypeScript 6
- ✅ React Router com 6 rotas principais
- ✅ AuthProvider com Supabase
- ✅ ProtectedRoute para sessões
- ✅ shadcn/ui components importados
- ✅ Dark/Light mode com next-themes
- ✅ ESLint + Prettier configurados
- ✅ Tailwind CSS 4 integrado

**Problemas encontrados:**
- ⚠️ Inicialmente sem AppLayout (componentes espalhados)
- ⚠️ Imports sem @alias (caminhos longos)
- ⚠️ Sem estrutura clara de features

**Decisões arquiteturais:**
- 🎯 Feature colocation em `src/features/`
- 🎯 Services layer separada de hooks
- 🎯 Query keys centralizadas
- 🎯 Tipagem forte em tudo (sem `any`)

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 2: Persistência Real

**Duração:** Semana 2  
**Status:** ✅ Concluído

**Objetivos:**
- Migrar dados mockados para Supabase real
- Criar tabela `transactions` com esquema correto
- Implementar CRUD básico
- Conectar autenticação com user_id

**O que foi implementado:**
- ✅ Tabela `transactions` criada no PostgreSQL
- ✅ Schema tipos auto-gerados pelo Supabase
- ✅ `transaction.service.ts` com getTransactions()
- ✅ `createTransaction()` com user_id automático
- ✅ `updateTransaction()` e `deleteTransaction()` stub
- ✅ RLS policies criadas (leitura/escrita/deleção)
- ✅ Session persistência automática

**Problemas encontrados e resolvidos:**

| Problema | Solução |
|----------|---------|
| `date` vs `transaction_date` | Renomeou coluna para `transaction_date` |
| `amount` como string | Alterou para NUMERIC(15,2) |
| Sem `user_id` nas queries | RLS garante automaticamente |
| Cache invalidação | Implementou invalidateQueries em mutations |
| Auth race condition | useEffect com mounted flag |

**Decisões arquiteturais:**
- 🎯 RLS como camada de segurança
- 🎯 `user_id` automático (não enviado pelo front)
- 🎯 Types gerados automaticamente
- 🎯 Transaction date em local timezone

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 3: React Query & Sincronização

**Duração:** Semana 3  
**Status:** ✅ Concluído

**Objetivos:**
- Configurar React Query profissionalmente
- Centralizar query keys
- Implementar invalidação automática
- Sincronizar mutations com dados reais

**O que foi implementado:**
- ✅ QueryClient global com config default
- ✅ Query keys centralizadas em `query-keys.ts`
- ✅ Hooks especializados por domínio
- ✅ Mutations com invalidateQueries
- ✅ Sincronização automática pós-create
- ✅ DevTools do React Query integrado

**Padrão de Hooks:**

```ts
// Reads
useTransactions()          // queryKey: ['transactions', 'list']
useDashboardSummary()      // queryKey: ['dashboard', 'summary']

// Writes
useCreateTransaction()     // invalida transactions.list
useUpdateTransaction()     // invalida transaction específico
useDeleteTransaction()     // invalida transactions.list
```

**Cache Flow:**
```
User cria transação
     ↓
useCreateTransaction() dispara
     ↓
createTransaction() enviado ao Supabase
     ↓
Supabase confirma inserção
     ↓
onSuccess dispara
     ↓
invalidateQueries(['transactions', 'list'])
     ↓
React Query refetch automático
     ↓
Dashboard recebe novo dado
     ↓
UI atualiza em tempo real
```

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 4.1: Dashboard com Agregações

**Duração:** Semana 4  
**Status:** ✅ Concluído

**Objetivos:**
- Criar camada de agregação (summary, metrics)
- Substituir métricas fake por reais
- Conectar cards do dashboard aos dados

**O que foi implementado:**
- ✅ `dashboard-service.ts` com:
  - `getDashboardSummary()` - agregações básicas
  - `getDashboardMetrics()` - formatado para cards
  - `getExpensesChartData()` - dados de gráficos
  - `getBalanceChartData()` - dados de saldo
- ✅ `dashboard-aggregation.ts` com:
  - `aggregateByMonth()` - agrupa por mês
  - `calculateMonthlyExpenses()` - calcula receitas/despesas
  - `calculateCumulativeBalance()` - saldo cumulativo
- ✅ Hooks especializados:
  - `useDashboardSummary()`
  - `useDashboardMetrics()`
  - `useExpensesChart()`
  - `useBalanceChart()`
- ✅ FinancialOverview com cards reais
- ✅ Loading states (skeleton)
- ✅ Empty states para usuários sem dados

**Agregações Implementadas:**

```
Transações raw
     ↓
aggregateByMonth()  // { "2026-06": [...], "2026-05": [...] }
     ↓
calculateMonthlyExpenses()  // [{ month: "Jun", income: 12450, expense: 4320 }, ...]
     ↓
Recharts renderiza gráfico
```

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 4.2: Gráficos Reais

**Duração:** Semana 5  
**Status:** ✅ Concluído

**Objetivos:**
- Transformar gráficos de mock para reais
- Conectar BalanceChart com dados calculados
- Conectar ExpensesChart com dados mensuais
- Adicionar empty states para gráficos vazios

**O que foi implementado:**
- ✅ BalanceChart com linha de saldo cumulativo
- ✅ ExpensesChart com gráfico de receitas/despesas por mês
- ✅ Hooks especializados para cada gráfico
- ✅ Empty states quando sem dados
- ✅ Dados formatados para Recharts
- ✅ Últimos 12 meses de histórico
- ✅ Cálculos de saldo cumulativo corretos

**Fluxo de Dados:**
```
Transações do Supabase
     ↓
getBalanceChartData()
     ↓
aggregateByMonth() + calculateCumulativeBalance()
     ↓
[{ month: "Jan", balance: 4200 }, ...]
     ↓
useBalanceChart() retorna dados
     ↓
<BalanceChart /> renderiza com Recharts
```

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 4.3: Transações Recentes Reais

**Duração:** Semana 6  
**Status:** ✅ Concluído

**Objetivos:**
- Substituir tabela fake de transações recentes
- Conectar ao Supabase real
- Ordenar por data (descente)
- Sincronizar automaticamente

**O que foi implementado:**
- ✅ `getTransactions()` ordenado por data
- ✅ `useTransactions()` hook especializado
- ✅ RecentTransactions component com dados reais
- ✅ Empty state quando sem transações
- ✅ Loading states com skeleton
- ✅ Invalidação automática após nova transação
- ✅ Limite de 5 mais recentes
- ✅ Formatação de valores monetários

**Query Implementada:**
```ts
.from('transactions')
  .select('*')
  .order('transaction_date', { ascending: false })
  .limit(5)
```

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 4.4: Empty States Profissionais

**Duração:** Semana 7  
**Status:** ✅ Concluído

**Objetivos:**
- Melhorar UX para usuários novos (sem transações)
- Empty states em dashboard, cards e gráficos
- Mensagens de onboarding claras
- CTAs para criar primeira transação

**O que foi implementado:**
- ✅ `DashboardEmptyState` - quando sem transações
- ✅ `ChartsEmptyState` - quando gráficos vazios
- ✅ `RecentTransactionsEmpty` - quando nenhuma recente
- ✅ Mensagens claras e motivacionais
- ✅ Icons informativos (Lucide)
- ✅ Links para criar primeira transação
- ✅ Loading states bem definidos

**Estados Cobertos:**
- Carregando dados (skeleton)
- Sem transações (empty state)
- Com transações (dados reais)
- Erro ao carregar (fallback)

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 4.5: Quick Actions

**Duração:** Semana 8  
**Status:** ✅ Concluído

**Objetivos:**
- Adicionar botões de ação rápida no dashboard
- Criar transação sem sair do dashboard
- Modal integrado
- Integração com React Query

**O que foi implementado:**
- ✅ QuickActions component
- ✅ Modal de criar transação
- ✅ Form integrado com React Hook Form
- ✅ Validação com Zod
- ✅ Invalidação automática após criação
- ✅ Loading states no botão
- ✅ Mensagens de sucesso/erro

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

### 📍 ETAPA 4.6: Transações Page Completa

**Duração:** Semana 9  
**Status:** ✅ Concluído

**Objetivos:**
- Página dedicada de transações
- Tabela com todas as transações
- Estatísticas por tipo
- Fundação para filtros futuros

**O que foi implementado:**
- ✅ TransactionsPage layout
- ✅ Table component com React Table
- ✅ Stats: total, receitas, despesas
- ✅ Ordenação por data
- ✅ Loading states
- ✅ Estrutura para filtros

**Build & Lint:**
- ✅ build: sucesso
- ✅ lint: zero erros

---

## 9. Estado Atual do Projeto

### ✅ O que já funciona

| Feature | Status | Real/Mock | Notas |
|---------|--------|----------|-------|
| **Autenticação** | ✅ Funcional | Real | Supabase Auth |
| **Criar Transação** | ✅ Funcional | Real | Supabase |
| **Listar Transações** | ✅ Funcional | Real | Supabase, ordenado |
| **Dashboard Summary** | ✅ Funcional | Real | Agregado do Supabase |
| **Métricas Cards** | ✅ Funcional | Real | Saldo, receitas, despesas |
| **Gráfico de Saldo** | ✅ Funcional | Real | Últimos 12 meses |
| **Gráfico Receitas/Despesas** | ✅ Funcional | Real | Mensal, últimos 12 meses |
| **Transações Recentes** | ✅ Funcional | Real | Últimas 5, ordenado |
| **Empty States** | ✅ Funcional | Real | Dashboard, cards, gráficos |
| **Dark Mode** | ✅ Funcional | N/A | next-themes integrado |
| **React Query** | ✅ Funcional | N/A | Syncronização automática |
| **Protected Routes** | ✅ Funcional | N/A | Autenticação obrigatória |
| **RLS Policies** | ✅ Funcional | N/A | Segurança de dados |

### 🔄 O que está em desenvolvimento

| Feature | Status | Próximo Passo |
|---------|--------|--------------|
| **Editar Transação** | ⏳ Planejado | Implementar updateTransaction() |
| **Deletar Transação** | ⏳ Planejado | Implementar deleteTransaction() |
| **Filtros Avançados** | ⏳ Planejado | Query params, debounce |
| **Busca Textual** | ⏳ Planejado | Full-text search |
| **Relatórios** | ⏳ Planejado | Agregações complexas |
| **Metas Financeiras** | ⏳ Planejado | Nova tabela no DB |
| **Carteiras** | ⏳ Planejado | Multi-account support |

### 🎯 O que é real vs mock

```
REAL (Supabase):
✅ Autenticação (Supabase Auth)
✅ Transações (PostgreSQL)
✅ Dashboard summary (calculado a partir de transações reais)
✅ Gráficos (dados reais agregados)
✅ Empty states (verificados em tempo real)

ESTRUTURA PRONTA PARA REAL:
✅ Hooks layer (abstraem React Query)
✅ Services layer (abstraem Supabase)
✅ React Query (sincronização automática)
✅ TypeScript (tipos seguros)
✅ RLS (segurança de dados)

AINDA NÃO IMPLEMENTADO:
❌ Editar/deletar transações (CRUD incompleto)
❌ Filtros (estrutura pronta, falta implementação)
❌ Busca textual (estrutura pronta)
❌ Relatórios (estrutura pronta)
❌ Metas (tabela não existe)
❌ Carteiras (tabela não existe)
```

### 📊 Arquitetura Implementada

```
✅ UI Layer
    └── Componentes React puros
    └── Sem lógica de negócio
    └── Sem chamadas ao Supabase

✅ Hooks Layer
    └── Custom hooks especializados
    └── Abstraem React Query
    └── Delegam a Services

✅ React Query Layer
    └── Caching automático
    └── Invalidação inteligente
    └── Refetch automático

✅ Services Layer
    └── Lógica de agregação
    └── Cálculos financeiros
    └── Chamadas ao Supabase

✅ Supabase SDK
    └── Queries tipadas
    └── RLS automático
    └── Auth integrada

✅ PostgreSQL
    └── Dados reais persistidos
    └── Schema consistente
    └── Indexes otimizados
```

---

## 10. Roadmap Futuro

### 🎯 PRÓXIMAS ETAPAS (Ordenadas por Prioridade)

#### ETAPA 4.7: CRUD Completo (Editar/Deletar)

**Estimado:** 1 semana

**Objetivos:**
- Implementar `updateTransaction()`
- Implementar `deleteTransaction()`
- Criar hooks de mutation
- Adicionar modais de edição/confirmação

**Implementação:**
```ts
// Services
export async function updateTransaction(id: string, input: UpdateInput)
export async function deleteTransaction(id: string)

// Hooks
export function useUpdateTransaction()
export function useDeleteTransaction()

// Mutations invalidarão:
queryKeys.transactions.list
queryKeys.dashboard.summary
queryKeys.dashboard.recentTransactions
queryKeys.dashboard.expensesChart
queryKeys.dashboard.balanceChart
```

---

#### ETAPA 4.8: Filtros Reais

**Estimado:** 1.5 semanas

**Objetivos:**
- Filtro por tipo (income/expense)
- Filtro por categoria
- Filtro por período (data início/fim)
- Filtro por mês/ano
- Busca textual (título)

**Implementação:**

```ts
// Query params
?type=income&category=salary&startDate=2026-01-01&endDate=2026-06-30

// Service
export async function getTransactionsFiltered(filters: FilterInput)

// Hook com debounce
export function useTransactionFilters(filters: FilterInput)
```

**Query Key:**
```ts
// Muda com filtros diferentes
queryKey: queryKeys.transactions.filtered(filters)
```

---

#### ETAPA 4.9: Analytics Avançados

**Estimado:** 2 semanas

**Objetivos:**
- Gastos por categoria (pie chart)
- Tendência mensal
- Média de gastos
- Maiores gastos e receitas
- Percentual por categoria

**Implementação:**

```ts
// dashboard-service.ts
export async function getCategoryAnalytics()
export async function getTrendAnalysis()
export async function getTopTransactions()

// Novos query keys
queryKeys.dashboard.categoryBreakdown
queryKeys.dashboard.trends
queryKeys.dashboard.topTransactions
```

---

#### ETAPA 4.10: Relatórios & Exportação

**Estimado:** 1.5 semanas

**Objetivos:**
- Gerar relatório mensal/anual
- Exportar como PDF
- Exportar como CSV
- Visualizar relatórios na página dedicada

**Implementação:**

```ts
// Services
export async function generateReport(period: 'monthly' | 'annual')
export async function exportToPDF(data: ReportData)
export async function exportToCSV(transactions: Transaction[])
```

---

#### ETAPA 5: Metas Financeiras

**Estimado:** 2 semanas

**Objetivos:**
- Criar metas de poupança
- Acompanhamento de progresso
- Notificações de progresso
- Metas por categoria

**Implementação:**

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  target_amount NUMERIC(15, 2),
  current_amount NUMERIC(15, 2),
  category VARCHAR(100),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP
);
```

---

#### ETAPA 6: Sistema de Carteiras

**Estimado:** 2 semanas

**Objetivos:**
- Múltiplas contas/carteiras
- Transferências entre carteiras
- Saldo por carteira
- Agregação total

**Implementação:**

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  balance NUMERIC(15, 2),
  created_at TIMESTAMP
);

ALTER TABLE transactions ADD COLUMN wallet_id UUID REFERENCES wallets(id);
```

---

#### ETAPA 7: Mobile & Responsiveness

**Estimado:** 1.5 semanas

**Objetivos:**
- Design mobile-first
- Otimizar para telas pequenas
- Bottom navigation
- Toque/gestos otimizados

**Prioridades:**
- Manter API igual (só mudam componentes)
- Usar Tailwind responsive
- Testar em dispositivos reais

---

#### ETAPA 8: Performance & Otimizações

**Estimado:** 1 semana

**Objetivos:**
- Code splitting
- Lazy loading de componentes
- Optimistic updates
- Compressão de dados

**Implementação:**

```ts
// Lazy load pages
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'))
const ReportsPage = lazy(() => import('@/pages/reports/reports-page'))

// Optimistic updates em mutations
onSuccess (opcional): atualizar cache antes de confirmar
```

---

#### ETAPA 9: Deploy & Produção

**Estimado:** 1 semana

**Objetivos:**
- Build otimizado para produção
- Deployment automático (CI/CD)
- Monitoramento
- Backup de dados

**Plataformas recomendadas:**
- Frontend: Vercel, Netlify
- Backend: Supabase (já é cloud)
- Monitoramento: Sentry, LogRocket

---

### 📅 Timeline Resumida

```
AGORA        ETAPA 4.3 - Dashboard Dinâmico (em conclusão)
     │
  +1w └─ ETAPA 4.7 - CRUD Completo
     │
  +2.5w └─ ETAPA 4.8 - Filtros Reais
     │
  +4w └─ ETAPA 4.9 - Analytics Avançados
     │
  +6w └─ ETAPA 4.10 - Relatórios & Exportação
     │
  +8w └─ ETAPA 5 - Metas Financeiras
     │
 +10w └─ ETAPA 6 - Sistema de Carteiras
     │
 +12w └─ ETAPA 7 - Mobile & Responsiveness
     │
 +13w └─ ETAPA 8 - Performance & Otimizações
     │
 +14w └─ ETAPA 9 - Deploy & Produção
```

---

## 11. Padrões Obrigatórios

Estes padrões devem ser seguidos **em todo novo código**:

### ✅ Tipagem Forte

**❌ Proibido:**
```ts
const [data, setData] = useState(null)              // sem tipo
function transform(data: any) { }                  // any
const result: any = await fetch()                  // any
```

**✅ Correto:**
```ts
const [data, setData] = useState<Transaction[]>([])
function transform(data: Transaction[]) { }
const result: DashboardSummary = await getDashboardSummary()
```

### ✅ Query Keys Centralizadas

**❌ Proibido:**
```ts
// Repetir strings em vários arquivos
useQuery({ queryKey: ['transactions', 'list'] })
useQuery({ queryKey: ['transactions', 'list'] })  // duplicado!
```

**✅ Correto:**
```ts
// Definir uma vez em query-keys.ts
export const queryKeys = {
  transactions: {
    list: ['transactions', 'list'] as const,
  },
}

// Usar em qualquer lugar
useQuery({ queryKey: queryKeys.transactions.list })
```

### ✅ Services Layer Separado

**❌ Proibido:**
```tsx
// Lógica direta no componente
function Dashboard() {
  useEffect(() => {
    supabase.from('transactions').select()  // ❌
  }, [])
}
```

**✅ Correto:**
```ts
// Service
export async function getTransactions() {
  const { data } = await supabase.from('transactions').select()
  return data
}

// Hook
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.list,
    queryFn: getTransactions,
  })
}

// Componente limpo
function Dashboard() {
  const { data } = useTransactions()
}
```

### ✅ Hooks Especializados

**❌ Proibido:**
```ts
// Hook genérico demais
function useData(key: string, fn: Function) {
  return useQuery({ queryKey: [key], queryFn: fn })
}
```

**✅ Correto:**
```ts
// Hooks especializados e descritivos
export function useTransactions() { ... }
export function useDashboardSummary() { ... }
export function useCreateTransaction() { ... }
```

### ✅ Invalidação Explícita

**❌ Proibido:**
```ts
// Invalidar tudo (muito genérico)
queryClient.invalidateQueries()
```

**✅ Correto:**
```ts
// Invalidar especificamente o que mudou
await queryClient.invalidateQueries({
  queryKey: queryKeys.transactions.list,
})
await queryClient.invalidateQueries({
  queryKey: queryKeys.dashboard.summary,
})
```

### ✅ Sem Lógica Pesada na UI

**❌ Proibido:**
```tsx
// Cálculos na UI
function Dashboard() {
  const { data } = useTransactions()
  const sum = data?.reduce((acc, t) => acc + t.amount, 0)
  return <div>{sum}</div>
}
```

**✅ Correto:**
```ts
// Cálculos no service
export async function getDashboardSummary() {
  const data = await getTransactions()
  return {
    total: data.reduce((acc, t) => acc + t.amount, 0),
  }
}

// UI só renderiza
function Dashboard() {
  const { data } = useDashboardSummary()
  return <div>{data.total}</div>
}
```

### ✅ Tipos Centralizados

**❌ Proibido:**
```ts
// Tipos espalhados
// arquivo1.ts
type Transaction = { id: string; amount: number }

// arquivo2.ts
interface Transaction { id: string; amount: number }  // duplicado!
```

**✅ Correto:**
```ts
// types/dashboard.ts - único lugar
export interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  transaction_date: string
  user_id: string
  category: string
  created_at: string
}

// Importar onde usar
import type { Transaction } from '@/types/database.types'
```

### ✅ Payload Explícito

**❌ Proibido:**
```ts
// Passar objeto genérico
export function updateTransaction(data: any) {
  return supabase.from('transactions').update(data)
}

updateTransaction({ ...formData })  // o quê está sendo enviado?
```

**✅ Correto:**
```ts
// Interface explícita
interface UpdateTransactionInput {
  title?: string
  amount?: number
  category?: string
}

export function updateTransaction(id: string, input: UpdateTransactionInput) {
  return supabase.from('transactions').update(input).eq('id', id)
}

updateTransaction('123', { title: 'Novo título' })  // claro o que é enviado
```

### ✅ Error Handling Consistente

**❌ Proibido:**
```ts
// Silent errors
try {
  await createTransaction(input)
} catch (error) {
  // ignorar
}
```

**✅ Correto:**
```ts
// Error bem tratado
try {
  await createTransaction(input)
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to create transaction:', error.message)
    throw error  // ou retornar erro estruturado
  }
}
```

### ✅ Performance: Memoization

**❌ Proibido:**
```tsx
// Re-renderizar sem necessidade
const Dashboard = () => {
  const data = useTransactions()
  return <Chart data={data} />  // Chart re-renderiza sempre
}
```

**✅ Correto:**
```tsx
// Memoizar quando apropriado
export const Chart = memo(({ data }: Props) => {
  return <div>{data}</div>
}, (prev, next) => {
  return prev.data === next.data  // shallow compare
})
```

---

## 12. Fluxos Críticos

### Fluxo: Usuário Cria Transação

```
1. User abre dashboard
   ├── AuthProvider checa sessão
   ├── Session encontrada → loading=false
   └── ProtectedRoute renderiza DashboardPage

2. User clica "Nova Transação"
   ├── Modal abre
   └── Form mounted

3. User preenche formulário
   ├── title, amount, category, type, transaction_date
   └── React Hook Form gerencia estado

4. User clica "Criar"
   ├── Form validation (Zod schema)
   ├── Se válido → useCreateTransaction() dispara
   └── Se inválido → mensagem de erro

5. Mutation enviada
   ├── createTransaction(input) chamado
   ├── Supabase valida user_id (RLS)
   ├── INSERT na tabela transactions
   └── Retorna transaction criada

6. onSuccess dispara
   ├── queryClient.invalidateQueries(['transactions', 'list'])
   ├── queryClient.invalidateQueries(['dashboard', 'summary'])
   ├── queryClient.invalidateQueries(['dashboard', 'recent-transactions'])
   └── queryClient.invalidateQueries(['dashboard', 'expenses-chart'])

7. React Query refetch automático
   ├── Todas as queries marcadas como stale
   ├── Fetch novos dados do Supabase
   └── Cache atualizado

8. UI atualiza
   ├── Dashboard cards mostram novo saldo
   ├── Gráficos atualizam com nova transação
   ├── Tabela de recentes mostra transação nova
   ├── Modal fecha
   └── Toast de sucesso

9. Fim
   └── Estado consistente entre frontend e Supabase
```

**Pontos críticos:**
- ✅ user_id adicionado automaticamente (segurança RLS)
- ✅ Invalidação múltipla garante consistência
- ✅ Refetch automático = sem cache stale
- ✅ UI reativa atualiza simultaneamente

---

### Fluxo: Usuário Faz Login

```
1. User acessa /login
   ├── ProtectedRoute verifica session
   ├── Session não existe → renderiza LoginPage
   └── LoginPage monta

2. User preenche email/senha
   ├── React Hook Form gerencia estado
   └── Validação básica

3. User clica "Entrar"
   ├── signIn(email, password) chamado
   ├── Supabase.auth.signIn() executado
   └── Request enviado ao Supabase Auth

4. Supabase valida credenciais
   ├── Email + senha validados
   ├── Credenciais corretas → JWT gerado
   ├── Credenciais erradas → erro
   └── Session criada

5. Session retornada
   ├── authProvider recebe session
   ├── Contexto atualizado com user/session
   ├── localStorage atualizado (automático Supabase)
   └── loading = false

6. ProtectedRoute detecta mudança
   ├── User agora existe
   ├── Redirecionamento para / (dashboard)
   └── LoginPage desmount

7. DashboardPage renderiza
   ├── useTransactions() dispara
   ├── useDashboardSummary() dispara
   ├── useExpensesChart() dispara
   ├── useBalanceChart() dispara
   └── Todos retornam dados do Supabase (RLS aplicada)

8. Dashboard renderiza com dados reais
   ├── Cards mostram resumo financeiro
   ├── Gráficos mostram histórico
   ├── Tabela mostra transações recentes
   └── User logado e autenticado

9. Fim
   └── User em sessão persistente (localStorage)
```

**Pontos críticos:**
- ✅ Session persiste (reload não faz logout)
- ✅ RLS garante dados exclusivos do user
- ✅ AuthProvider sincroniza automaticamente
- ✅ ProtectedRoute impede acesso não-autenticado

---

### Fluxo: Page Reload Com Sessão Persistida

```
1. User em dashboard, faz refresh (F5)
   ├── Aplicação reinicia
   └── AuthProvider monta

2. AuthProvider.useEffect() dispara
   ├── supabase.auth.getSession() chamado
   ├── localStorage verificado
   └── Session encontrada

3. Session restaurada
   ├── User + session setado
   ├── loading = true → false
   └── useAuth() atualizado

4. ProtectedRoute verifica user
   ├── User existe → renderiza DashboardPage
   └── DashboardPage queries disparam novamente

5. Queries refetch
   ├── React Query observa mounting
   ├── Todas as queries marcadas como stale
   ├── Fetch novos dados do Supabase
   └── Cache preenchido com dados recentes

6. Dashboard renderiza
   ├── Dados reais do Supabase
   ├── Gráficos atualizados
   ├── User permanece autenticado
   └── Sem interrupção visual

7. Fim
   └── Sessão persiste transparentemente
```

**Pontos críticos:**
- ✅ localStorage garante persistência
- ✅ getSession() não requer login
- ✅ onAuthStateChange() sincroniza estado
- ✅ Queries refetch ao remount

---

## 13. Manutenção e Evolução

### Como Manter Este Arquivo

**Este arquivo DEVE ser atualizado após CADA etapa finalizada.**

#### Checklist ao Finalizar Etapa:

```md
- [ ] Feature implementada e testada
- [ ] Build limpo (sem erros)
- [ ] Lint limpo (sem warnings)
- [ ] Tests passando (se aplicável)
- [ ] ✅ ATUALIZAR ESTE ARQUIVO INSTRUCOES.md
  - [ ] Adicionar seção na ETAPA X
  - [ ] Documentar o que foi feito
  - [ ] Documentar problemas resolvidos
  - [ ] Documentar decisões arquiteturais
  - [ ] Atualizar "Estado Atual do Projeto"
  - [ ] Atualizar query keys se mudou
  - [ ] Atualizar padrões se aplicável
  - [ ] Atualizar roadmap
```

## Design System

Todo novo componente deve seguir obrigatoriamente:

- Não alterar a identidade visual existente.
- Utilizar Tailwind e shadcn/ui.
- Reutilizar componentes sempre que possível.
- Priorizar layouts limpos e minimalistas.
- Utilizar grids consistentes.
- Manter espaçamentos uniformes.
- Criar empty states, loading states e error states.
- Microinterações discretas.
- Responsividade obrigatória.
- Não criar novos estilos sem necessidade.

## AI Development

Este projeto utiliza AI Skills instaladas em `.agents/skills`.

Ao desenvolver novas funcionalidades:

- Leia primeiro o `INSTRUCOES.md`.
- Respeite o design system existente.
- Utilize as AI Skills apenas para melhorar UX, hierarquia visual, responsividade e qualidade da interface.
- Não altere a identidade visual nem os componentes-base sem necessidade.

#### Seções a Atualizar:

1. **ETAPA X**: Adicionar nova seção cronológica
2. **Estado Atual**: Atualizar tabelas de features
3. **Roadmap Futuro**: Remover etapa concluída, adicionar nova
4. **Query Keys** (se mudou)
5. **Padrões Obrigatórios** (se um novo padrão surgiu)
6. **Fluxos Críticos** (se um novo fluxo é criado)

### Como IAs Futuras Devem Usar Este Arquivo

1. **Leitura Inicial**: Ler este arquivo completo (primeira vez)
2. **Contexto de Projeto**: Antes de qualquer novo PR, revisar "Estado Atual"
3. **Decisões Arquiteturais**: Quando em dúvida, consultar seção correspondente
4. **Padrões**: NUNCA violar padrões em "Padrões Obrigatórios"
5. **Próximas Etapas**: Seguir ordem em "Roadmap Futuro"

### Evolução do Projeto

**Princípios imutáveis:**
- ✅ Tipagem forte (sem `any`)
- ✅ Query keys centralizadas
- ✅ Services separados de hooks
- ✅ Sem lógica pesada na UI
- ✅ Invalidação explícita
- ✅ RLS garantido

**O que pode evoluir:**
- 🔄 Estrutura de pastas (adicionar features)
- 🔄 Novas query keys (conforme crescer)
- 🔄 Novos hooks (sem quebrar existentes)
- 🔄 Stack tecnológico (atualizar dependências)

---

## Resumo Executivo

### Projeto: FinTrack - Dashboard Financeiro SaaS

**Estado:** Etapa 4.3 em conclusão (dashboard dinâmico funcional)

**Stack:** React 19 + TypeScript + Vite + Supabase + React Query + Tailwind

**Arquitetura:** Separação clara UI → Hooks → React Query → Services → Supabase → PostgreSQL

**O que funciona:**
- ✅ Autenticação real com Supabase
- ✅ CRUD de transações (create funcional, read completo)
- ✅ Dashboard com agregações reais
- ✅ Gráficos com histórico de 12 meses
- ✅ Cache inteligente com React Query
- ✅ RLS para segurança de dados
- ✅ Dark mode com next-themes
- ✅ Empty states profissionais

**Próximas prioridades:**
1. CRUD completo (editar/deletar)
2. Filtros reais e busca
3. Analytics avançados
4. Relatórios e exportação
5. Metas financeiras

**Qualidade de código:**
- ✅ TypeScript strict (sem `any`)
- ✅ Zero lint errors
- ✅ Build limpo
- ✅ Padrões arquiteturais definidos
- ✅ Documentação viva

---

**Este arquivo é a fonte única de verdade para o projeto FinTrack.**  
**Mantenha-o atualizado. Consulte-o frequentemente. Respeite os padrões.**

---

**Última atualização:** Junho 2026  
**Próxima revisão:** Após ETAPA 4.7 (CRUD Completo)  
**Responsável por manutenção:** IAs futuras + time de desenvolvimento
