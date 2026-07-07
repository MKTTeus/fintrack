export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          wallet_id: string | null
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
          wallet_id?: string | null
          title: string
          amount: number
          type: 'income' | 'expense'
          category: string
          transaction_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet_id?: string | null
          title?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          transaction_date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_wallet_id_fkey'
            columns: ['wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'pix' | 'credit_card' | 'debit_card' | 'cash'
          description: string | null
          current_balance: number
          color: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'pix' | 'credit_card' | 'debit_card' | 'cash'
          description?: string | null
          current_balance?: number
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'pix' | 'credit_card' | 'debit_card' | 'cash'
          description?: string | null
          current_balance?: number
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'wallets_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      credit_cards: {
        Row: {
          id: string
          user_id: string
          wallet_id: string
          bank_name: string | null
          card_name: string
          last_four_digits: string | null
          credit_limit: number | null
          closing_day: number | null
          due_day: number | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          wallet_id: string
          bank_name?: string | null
          card_name: string
          last_four_digits?: string | null
          credit_limit?: number | null
          closing_day?: number | null
          due_day?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          wallet_id?: string
          bank_name?: string | null
          card_name?: string
          last_four_digits?: string | null
          credit_limit?: number | null
          closing_day?: number | null
          due_day?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'credit_cards_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'credit_cards_wallet_id_fkey'
            columns: ['wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
