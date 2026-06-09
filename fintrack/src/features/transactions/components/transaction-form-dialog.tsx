import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  transactionCategories,
} from "../constants/transaction-categories"

import {
  transactionSchema,
  type TransactionFormData,
  type TransactionFormInput,
} from "../schemas/transaction.schema"

import { useCreateTransaction } from "../hooks/use-create-transaction"

export function TransactionFormDialog() {
  const { mutateAsync } =
    useCreateTransaction()

  const form =
    useForm<
      TransactionFormInput,
      undefined,
      TransactionFormData
    >({
      resolver:
        zodResolver(transactionSchema),

      defaultValues: {
        title: "",
        amount: 0,
        category: "",
        type: "expense",
        transaction_date: new Date()
          .toLocaleDateString("en-CA"),
      },
    })

  async function onSubmit(
    data: TransactionFormData,
  ) {
    await mutateAsync(data)

    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="h-10 rounded-2xl px-4 font-semibold gap-2 transition-transform duration-150 hover:scale-[1.02]">
          <Plus className="size-4" />
          Nova transação
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl border border-border bg-card p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium tracking-tight">
            Nova transação
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Adicione uma nova movimentação financeira
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Título
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Ex: Mercado"
                      {...field}
                      className="h-10 rounded-2xl px-3 transition-colors"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">
                      Valor
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0,00"
                        value={String(field.value ?? "")}
                        onChange={field.onChange}
                        className="h-10 rounded-2xl px-3 transition-colors"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">
                      Tipo
                    </FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-10 rounded-2xl px-3">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">
                      Categoria
                    </FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-10 rounded-2xl px-3">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>

                        <SelectContent>
                          {transactionCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">
                      Data
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-10 rounded-2xl px-3 transition-colors"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-2 flex w-full items-center justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button" className="h-9 rounded-2xl px-3 transition-colors hover:bg-muted/6">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="h-10 rounded-2xl px-4 font-semibold transition-colors duration-150"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Salvando..." : "Salvar transação"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
