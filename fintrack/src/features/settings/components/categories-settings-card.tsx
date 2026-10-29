import { useState } from 'react'
import { FolderCog, Pencil, Plus, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTransactionCategories } from '@/features/transactions/hooks/use-transaction-categories'
import { SettingsSectionCard } from './settings-section-card'

function getMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível concluir a operação.'
}

export function CategoriesSettingsCard() {
  const { query, custom, create, modify, remove } = useTransactionCategories()
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function addCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    try {
      await create.mutateAsync(name)
      setName('')
    } catch (reason) {
      setError(getMessage(reason))
    }
  }

  async function saveEdit(id: string) {
    setError('')
    setBusyId(id)
    try {
      await modify.mutateAsync({ id, name: editingName })
      setEditingId(null)
      setEditingName('')
    } catch (reason) {
      setError(getMessage(reason))
    } finally {
      setBusyId(null)
    }
  }

  async function deleteCategory(id: string, categoryName: string) {
    if (!window.confirm(`Excluir a categoria "${categoryName}"? Esta ação não exclui transações.`)) return
    setError('')
    setBusyId(id)
    try {
      await remove.mutateAsync(id)
    } catch (reason) {
      setError(getMessage(reason))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <SettingsSectionCard icon={FolderCog} title="Categorias personalizadas"
      description="Organize seus gastos do seu jeito. Disponíveis também no Mont.">
      <div className="grid gap-4">
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={addCategory}>
          <Input value={name} onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Muay Thai, Academia, MOLS" maxLength={50}
            aria-label="Nome da nova categoria" className="h-10 rounded-xl" />
          <Button type="submit" disabled={create.isPending || !name.trim()}
            className="h-10 shrink-0 rounded-xl">
            <Plus className="mr-1 size-4" /> Adicionar
          </Button>
        </form>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {query.isLoading && <p className="text-sm text-muted-foreground">Carregando categorias...</p>}
        {query.isError && <p role="alert" className="text-sm text-destructive">Não foi possível carregar as categorias. Tente atualizar a página.</p>}

        {custom.length === 0 && !query.isLoading && !query.isError && (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            Nenhuma categoria personalizada ainda. As categorias padrão continuam disponíveis.
          </p>
        )}
        <div className="grid gap-2">
          {custom.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/40 px-3 py-2">
              {editingId === item.id ? (
                <>
                  <Input value={editingName} maxLength={50} className="min-w-0 flex-1"
                    onChange={(event) => setEditingName(event.target.value)}
                    aria-label={`Renomear ${item.name}`} />
                  <Button aria-label="Salvar nome" variant="outline" size="icon"
                    disabled={busyId === item.id}
                    onClick={() => saveEdit(item.id)}><Check className="size-4" /></Button>
                  <Button aria-label="Cancelar edição" variant="ghost" size="icon"
                    onClick={() => setEditingId(null)}><X className="size-4" /></Button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span>
                  <Button aria-label={`Editar ${item.name}`} variant="ghost" size="icon"
                    onClick={() => { setEditingId(item.id); setEditingName(item.name); setError('') }}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button aria-label={`Excluir ${item.name}`} variant="ghost" size="icon"
                    disabled={busyId === item.id}
                    onClick={() => deleteCategory(item.id, item.name)}>
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Categorias padrão não podem ser excluídas. Para editar ou remover uma categoria em uso,
          primeiro altere as transações vinculadas a ela.
        </p>
      </div>
    </SettingsSectionCard>
  )
}
