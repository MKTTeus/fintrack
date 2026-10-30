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
      fii_positions: {
        Row: { id: string; user_id: string; ticker: string; name: string | null; opening_quantity: number; opening_cost: number | null; opening_date: string | null; market_price: number | null; price_updated_at: string | null; notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; ticker: string; name?: string | null; opening_quantity?: number; opening_cost?: number | null; opening_date?: string | null; market_price?: number | null; price_updated_at?: string | null; notes?: string | null }
        Update: { name?: string | null; market_price?: number | null; price_updated_at?: string | null; notes?: string | null; updated_at?: string }
        Relationships: []
      }
      fii_movements: {
        Row: { id: string; user_id: string; position_id: string; wallet_id: string; kind: 'buy' | 'sell' | 'dividend'; quantity: number | null; unit_price: number | null; fees: number; amount: number; movement_date: string; notes: string | null; created_at: string }
        Insert: { id?: string; user_id: string; position_id: string; wallet_id: string; kind: 'buy' | 'sell' | 'dividend'; quantity?: number | null; unit_price?: number | null; fees?: number; amount: number; movement_date?: string; notes?: string | null }
        Update: { kind?: 'buy' | 'sell' | 'dividend' }
        Relationships: []
      }
      wallet_balance_reconciliations: {
        Row: { id: string; user_id: string; wallet_id: string; estimated_before: number; actual_balance: number; adjustment: number; note: string | null; created_at: string }
        Insert: { id?: string; user_id: string; wallet_id: string; estimated_before: number; actual_balance: number; adjustment: number; note?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string; wallet_id?: string; estimated_before?: number; actual_balance?: number; adjustment?: number; note?: string | null; created_at?: string }
        Relationships: [{ foreignKeyName: 'wallet_balance_reconciliations_wallet_id_fkey'; columns: ['wallet_id']; referencedRelation: 'wallets'; referencedColumns: ['id'] }]
      }
      investment_positions: {
        Row: { id: string; user_id: string; name: string; kind: 'cdb' | 'rdb' | 'fixed_income_other'; institution: string | null; notes: string | null; opening_balance: number; opening_date: string | null; created_at: string }
        Insert: { id?: string; user_id: string; name: string; kind: 'cdb' | 'rdb' | 'fixed_income_other'; institution?: string | null; notes?: string | null; opening_balance?: number; opening_date?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string; name?: string; kind?: 'cdb' | 'rdb' | 'fixed_income_other'; institution?: string | null; notes?: string | null; opening_balance?: number; opening_date?: string | null; created_at?: string }
        Relationships: []
      }
      investment_movements: {
        Row: { id: string; user_id: string; position_id: string; wallet_id: string; kind: 'application' | 'redemption' | 'yield'; amount: number; movement_date: string; notes: string | null; created_at: string }
        Insert: { id?: string; user_id: string; position_id: string; wallet_id: string; kind: 'application' | 'redemption' | 'yield'; amount: number; movement_date?: string; notes?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string; position_id?: string; wallet_id?: string; kind?: 'application' | 'redemption' | 'yield'; amount?: number; movement_date?: string; notes?: string | null; created_at?: string }
        Relationships: [
          { foreignKeyName: 'investment_movements_position_user_fk'; columns: ['position_id', 'user_id']; referencedRelation: 'investment_positions'; referencedColumns: ['id', 'user_id'] },
          { foreignKeyName: 'investment_movements_wallet_fk'; columns: ['wallet_id']; referencedRelation: 'wallets'; referencedColumns: ['id'] },
        ]
      }
      wallet_transfers: {
        Row: {
          id: string
          user_id: string
          source_wallet_id: string
          destination_wallet_id: string
          amount: number
          transfer_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_wallet_id: string
          destination_wallet_id: string
          amount: number
          transfer_date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_wallet_id?: string
          destination_wallet_id?: string
          amount?: number
          transfer_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wallet_transfers_source_wallet_id_fkey'
            columns: ['source_wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'wallet_transfers_destination_wallet_id_fkey'
            columns: ['destination_wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
      credit_card_payments: {
        Row: {
          id: string
          user_id: string
          credit_card_id: string
          source_wallet_id: string
          amount: number
          payment_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credit_card_id: string
          source_wallet_id: string
          amount: number
          payment_date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credit_card_id?: string
          source_wallet_id?: string
          amount?: number
          payment_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'credit_card_payments_credit_card_id_fkey'
            columns: ['credit_card_id']
            referencedRelation: 'credit_cards'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'credit_card_payments_source_wallet_id_fkey'
            columns: ['source_wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
      transaction_categories: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transaction_categories_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
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
      goals: {
        Row: {
          id: string
          user_id: string
          wallet_id: string | null
          title: string
          description: string | null
          target_amount: number
          target_date: string | null
          monthly_target: number | null
          icon: string | null
          color: string | null
          status: 'active' | 'completed' | 'paused' | 'cancelled'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          wallet_id?: string | null
          title: string
          description?: string | null
          target_amount: number
          target_date?: string | null
          monthly_target?: number | null
          icon?: string | null
          color?: string | null
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          wallet_id?: string | null
          title?: string
          description?: string | null
          target_amount?: number
          target_date?: string | null
          monthly_target?: number | null
          icon?: string | null
          color?: string | null
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'goals_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'goals_wallet_id_fkey'
            columns: ['wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
      goal_deposits: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          wallet_id: string | null
          amount: number
          deposit_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          wallet_id?: string | null
          amount: number
          deposit_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          wallet_id?: string | null
          amount?: number
          deposit_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'goal_deposits_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'goal_deposits_goal_id_fkey'
            columns: ['goal_id']
            referencedRelation: 'goals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'goal_deposits_wallet_id_fkey'
            columns: ['wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          display_name: string
          currency: 'BRL' | 'USD' | 'EUR'
          show_cents: boolean
          date_format: 'dd/MM/yyyy' | 'MM/dd/yyyy'
          theme: 'light' | 'dark' | 'system'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          currency?: 'BRL' | 'USD' | 'EUR'
          show_cents?: boolean
          date_format?: 'dd/MM/yyyy' | 'MM/dd/yyyy'
          theme?: 'light' | 'dark' | 'system'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          currency?: 'BRL' | 'USD' | 'EUR'
          show_cents?: boolean
          date_format?: 'dd/MM/yyyy' | 'MM/dd/yyyy'
          theme?: 'light' | 'dark' | 'system'
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_settings_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      reconcile_wallet_balance: { Args: { p_wallet_id: string; p_actual_balance: number; p_note?: string | null }; Returns: Database['public']['Tables']['wallet_balance_reconciliations']['Row'] }
      create_credit_wallet_with_card: {
        Args: {
          p_name: string
          p_description: string | null
          p_bank_name: string
          p_card_name: string
          p_last_four_digits?: string | null
          p_credit_limit?: number | null
          p_closing_day?: number | null
          p_due_day?: number | null
        }
        Returns: { wallet_id: string; card_id: string }
      }
      mont_preview_transaction_reset: {
        Args: { p_user_id: string }
        Returns: {
          count: number
          income_count: number
          expense_count: number
          income_total: number
          expense_total: number
          snapshot_hash: string
        }
      }
      mont_execute_transaction_reset: {
        Args: { p_user_id: string; p_expected_hash: string }
        Returns: { deleted: number; backup_id: string | null }
      }
    }
    Enums: {
      goal_status: 'active' | 'completed' | 'paused' | 'cancelled'
    }
    CompositeTypes: Record<string, never>
  }
}
