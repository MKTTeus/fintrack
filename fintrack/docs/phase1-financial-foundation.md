# FinTrack — Fase 1: regras de saldos e carteiras

## Fonte de verdade

- `wallets.current_balance` é a **base / saldo inicial** de uma conta com dinheiro; não é um saldo bancário recebido em tempo real.
- Saldo estimado de cada conta de dinheiro: **saldo inicial + receitas - despesas + transferências recebidas - transferências enviadas - pagamentos de cartão**.
- Total disponível: soma apenas das contas **ativas** com dinheiro (`pix`, `debit_card`, `cash`). Cartões de crédito não são dinheiro disponível e não entram nessa soma.
- **Uma carteira deve representar um saldo distinto.** Se Pix e débito se referem à *mesma conta bancária*, cadastre somente uma carteira para evitar contar o dinheiro duas vezes.
- Os números do FinTrack permanecem estimativas dos registros inseridos, nunca saldo bancário ao vivo. Até a conferência com o extrato, podem divergir.

## Contas existentes

Nenhum saldo ou lançamento antigo foi alterado automaticamente durante a migração.
A partir desta versão, o valor antes armazenado em `current_balance` passa a ser considerado **saldo inicial** do histórico. Quem o cadastrou como saldo *atual* precisa revisar esse campo nas carteiras para evitar duplicação com receitas/despesas já lançadas. Não deduza o saldo inicial sozinho quando há histórico antigo.

## Transferências

Uma transferência entre contas do mesmo usuário fica em `wallet_transfers`, sem criar receitas/despesas artificiais. A operação é uma linha única (origem, destino, data, valor). Excluir uma transferência desfaz seus efeitos no cálculo de ambas as contas. Cartões de crédito não são destinos nem fontes válidos para transferências.

## Crédito

Compras lançadas em carteiras do tipo `credit_card` contam como **despesa no período da compra**, mas não subtraem o dinheiro das contas de pagamento no mesmo instante.
A dívida estimada do cartão é a soma de compras menos estornos/receitas no cartão menos pagamentos registrados em `credit_card_payments`.
Um pagamento de cartão subtrai dinheiro da carteira pagadora e reduz a dívida, **sem gerar uma segunda despesa**.

O resumo "fatura do ciclo (estimada)" considera apenas as compras da janela de fechamento do mês. Ele é uma *prévia* baseada na data de fechamento cadastrada, **não uma fatura oficial do banco**, não incorpora parcelamentos, juros, IOF nem outros ajustes não lançados. Os pagamentos são registrados como abatimento geral da dívida, não conciliados com uma fatura bancária específica. Será necessário conciliar pagamentos antigos já feitos para evitar que compras históricas pareçam dívidas atuais.

Ao cadastrar cartão, a carteira e o registro do cartão são inseridos numa única transação de banco (RPC invoker + RLS). Se qualquer etapa falhar, nenhuma carteira parcial é criada.

## Segurança e consistência

- `wallet_transfers` e `credit_card_payments` usam RLS e permissões apenas para o proprietário autenticado; usuários anônimos não podem ler esses dados.
- O cache de consultas financeiras é limpo ao trocar de usuário e ao sair da conta.
- Dados existentes não foram removidos. Alterações em massa de saldos ou lançamentos nunca são executadas na inicialização.
- Consultas de transações, transferências e pagamentos têm paginação de 500 registros por vez e falham explicitamente ao alcançar o limite de 100.000, evitando exibir saldos silenciosamente truncados.
- **Limitação preexistente:** a exclusão da conta pelo frontend remove várias tabelas, mas a remoção de `auth.users` ainda precisa de implementação administrativa segura e verificação separada; não tratar essa ação como exclusão completa da identidade.

## Cenários de validação

Os testes em `tests/wallet-ledger.test.mts` cobrem saldo inicial, transferências sem receita/despesa fictícia, pagamentos que abatem caixa e dívida, a virada da data de fechamento do cartão e o saldo acumulado após mais de 12 meses de histórico.

Para executar: `npm run test:ledger`, `npm run build`, `npm run lint`.
