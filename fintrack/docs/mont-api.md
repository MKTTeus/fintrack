# FinTrack API — Integração Mont (MVP)

Este é um endpoint **privado de integração entre servidores**, não uma API pública. O Mont usa sua própria chave para chamar funções serverless do FinTrack; a chave de administração do Supabase permanece **somente na Vercel do FinTrack**.

## Arquitetura

`Telegram → Mont (Render) → HTTPS + Bearer secret → FinTrack (Vercel Functions) → Supabase`

As funções ficam em `fintrack/api/mont` (a pasta raiz do projeto Vite no Vercel deve ser `fintrack`).

## Variáveis secretas no projeto FinTrack da Vercel

- `MONT_FINTRACK_API_KEY`: chave aleatória com pelo menos 32 caracteres, exclusiva do Mont; gere pelo gerenciador de segredos da sua preferência.
- `SUPABASE_URL`: URL do projeto Supabase usado pelo FinTrack.
- `SUPABASE_SECRET_KEY`: chave secreta `sb_secret_...` do Supabase (**nunca** uma publishable/anon key). Use somente no servidor.
- `FINTRACK_MONT_USER_ID`: UUID do usuário de destino, disponível no Supabase Authentication → Users.

Configure somente no ambiente em que a API será testada. Para testar o preview, use variáveis de Preview; para produção, inclua Production.

## Mont no Render

- `FINTRACK_API_BASE_URL`: URL HTTPS de implantação do FinTrack, como `https://seu-projeto.vercel.app` (sem `/api` no final).
- `FINTRACK_API_KEY`: a **mesma** chave configurada como `MONT_FINTRACK_API_KEY` na Vercel.

Não envie segredos pelo Telegram, por chats ou para o GitHub.

## Rotas

### GET /api/mont/wallets

`Authorization: Bearer <MONT_FINTRACK_API_KEY>`

Resposta de sucesso:

```json
{ "wallets": [{ "id": "uuid", "name": "Nubank", "type": "pix", "is_active": true }] }
```

Somente carteiras ativas do usuário fixado no servidor são devolvidas. Sem dados bancários sensíveis.

### POST /api/mont/transactions

`Authorization: Bearer <MONT_FINTRACK_API_KEY>`
`Content-Type: application/json`

```json
{
  "title": "Conta de luz",
  "amount": 134.00,
  "type": "expense",
  "category": "Contas e Serviços",
  "transaction_date": "2026-10-28",
  "wallet_id": "UUID-da-carteira",
  "request_id": "mont-confirmation-uuid-20261028"
}
```

- `wallet_id` é obrigatório, deve existir, estar ativo e pertencer ao usuário autorizado.
- `request_id` identifica uma operação única. Repetir o mesmo pedido com esse identificador retorna a transação anterior (`created: false`) sem duplicar o registro.
- `type` aceita `expense` e `income`; no MVP do Mont habilitaremos apenas despesas.
- Data em ISO `YYYY-MM-DD`; valor positivo com até duas casas decimais; categorias correspondem ao frontend.
- `201` criado, `200` repetido, `401` sem autorização, `422` inválido, `503` configuração ausente.

**Segurança:** funções com segredo server-side, chave exclusiva, validação de carteira/usuário e idempotência. O frontend existente não usa esses endpoints nem recebe a chave privilegiada.

Antes de integrar ações reais, peça ao Mont para apresentar um resumo da despesa e exigir confirmação humana. Não faça testes de criação com dados fictícios na base de produção sem autorização.

## Vercel / SPA

O `vercel.json` precisa preservar o prefixo `/api`; caso contrário, a regra de SPA pode fazer a função responder HTML do React. A configuração da branch já exclui `/api` do fallback.


### GET /api/mont/spending

Resumo **somente de leitura** de despesas por categoria e período, sempre restrito ao usuário do Mont no servidor.

`Authorization: Bearer <MONT_FINTRACK_API_KEY>`

Exemplos de parâmetros:

- `?period=this_month&category=Alimentação`
- `?period=last_month`
- `?period=this_year`
- `?period=last_30_days`
- `?period=custom&from=2026-10-01&to=2026-10-31&category=Transporte`

Resposta de exemplo (valores ilustrativos):

```json
{
  "period": "this_month",
  "from": "2026-10-01",
  "to": "2026-10-29",
  "currency": "BRL",
  "category": "Alimentação",
  "total": 120.50,
  "transaction_count": 4,
  "categories": [{"name":"Alimentação","total":120.50,"count":4}]
}
```

Os valores são somados em centavos, agrupados por categoria e calculados a partir de transações reais de tipo `expense`. A busca pagina explicitamente para não omitir registros quando houver mais de mil lançamentos. O período relativo usa o fuso `America/Sao_Paulo`, e o intervalo personalizado é limitado a cinco anos.


### GET /api/mont/transactions-manage

Consulta somente de leitura, restrita ao usuário de `FINTRACK_MONT_USER_ID`. Aceita parâmetros `id`, `search` (parte do título), `type` (`expense` ou `income`), `category`, `wallet_id`, `from`, `to` (datas AAAA-MM-DD) e `limit` (1 a 30, padrão 15). Retorna `{"transactions":[...]}`. A busca é ordenada pela data da transação e criação, decrescente. Não faz busca em contas de outros usuários.

### PATCH /api/mont/transactions-manage

Edição com JSON `{"id":"uuid","expected":{"title":"...","amount":1,"type":"expense","category":"...","transaction_date":"AAAA-MM-DD","wallet_id":"uuid"},"changes":{"category":"Transporte"}}`.

O campo `expected` deve conter o registro exato recuperado por GET, excluindo `id`; `changes` permite apenas título, valor, tipo, categoria, data e carteira, com validação estrita. O servidor valida o proprietário, confere o estado anterior e atualiza somente se os valores ainda coincidirem. Em conflito, devolve 409. Carteiras novas devem pertencer ao usuário e estar ativas.

### DELETE /api/mont/transactions-manage

Exclusão com JSON `{"id":"uuid","expected":{"title":"...","amount":1,"type":"expense","category":"...","transaction_date":"AAAA-MM-DD","wallet_id":"uuid"}}`. O servidor verifica propriedade e snapshot antes de executar. Responde `{"deleted":true,"id":"uuid"}` somente após a exclusão ser confirmada.

**Política Mont:** a API de gravação, edição e exclusão só é chamada a partir do handler de confirmação; o modelo possui somente ferramentas de *preparo* e consulta. A nova rota não deve ser exposta por uma chave no frontend (`VITE_*`). Mantém-se autenticação Bearer e identificação fixa do usuário, como nas rotas anteriores.

`POST /api/mont/transactions` já aceita tanto `income` quanto `expense`; o Mont passa a preparar receitas com confirmação, reutilizando essa rota.

