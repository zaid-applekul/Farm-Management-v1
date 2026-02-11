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
      equipment: {
        Row: {
          condition: string | null
          created_at: string | null
          daily_cost: number
          equipment_type: string
          id: string
          last_maintenance: string | null
          name: string
          next_service: string | null
          ownership: string | null
          user_id: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          daily_cost?: number
          equipment_type: string
          id?: string
          last_maintenance?: string | null
          name: string
          next_service?: string | null
          ownership?: string | null
          user_id?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          daily_cost?: number
          equipment_type?: string
          id?: string
          last_maintenance?: string | null
          name?: string
          next_service?: string | null
          ownership?: string | null
          user_id?: string | null
        }
      }
      fertilizer_applications: {
        Row: {
          amount: number
          application_date: string
          cost: number
          created_at: string | null
          field_id: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          application_date: string
          cost?: number
          created_at?: string | null
          field_id?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          application_date?: string
          cost?: number
          created_at?: string | null
          field_id?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
      }
      fields: {
        Row: {
          area: number
          created_at: string | null
          crop: string
          growth_stage: string | null
          id: string
          last_updated: string | null
          name: string
          planting_date: string
          user_id: string | null
          weed_state: string | null
        }
        Insert: {
          area: number
          created_at?: string | null
          crop: string
          growth_stage?: string | null
          id?: string
          last_updated?: string | null
          name: string
          planting_date: string
          user_id?: string | null
          weed_state?: string | null
        }
        Update: {
          area?: number
          created_at?: string | null
          crop?: string
          growth_stage?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          planting_date?: string
          user_id?: string | null
          weed_state?: string | null
        }
      }
      financial_entries: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          entry_date: string
          entry_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string | null
          description: string
          entry_date: string
          entry_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          entry_date?: string
          entry_type?: string
          id?: string
          user_id?: string | null
        }
      }
      harvest_records: {
        Row: {
          bin_count: number
          created_at: string | null
          harvest_date: string
          id: string
          lug_count: number
          picker: string
          price_per_bin: number
          quality_grade: string | null
          shelf_life_days: number | null
          starch_index: number | null
          storage_location: string | null
          total_revenue: number
          tree_id: string | null
          user_id: string | null
          variety: string
        }
        Insert: {
          bin_count?: number
          created_at?: string | null
          harvest_date: string
          id?: string
          lug_count?: number
          picker: string
          price_per_bin?: number
          quality_grade?: string | null
          shelf_life_days?: number | null
          starch_index?: number | null
          storage_location?: string | null
          total_revenue?: number
          tree_id?: string | null
          user_id?: string | null
          variety: string
        }
        Update: {
          bin_count?: number
          created_at?: string | null
          harvest_date?: string
          id?: string
          lug_count?: number
          picker?: string
          price_per_bin?: number
          quality_grade?: string | null
          shelf_life_days?: number | null
          starch_index?: number | null
          storage_location?: string | null
          total_revenue?: number
          tree_id?: string | null
          user_id?: string | null
          variety?: string
        }
      }
      inventory: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          item_type: string
          name: string
          price_per_unit: number
          quantity: number
          supplier: string
          unit: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          item_type: string
          name: string
          price_per_unit?: number
          quantity?: number
          supplier: string
          unit: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          item_type?: string
          name?: string
          price_per_unit?: number
          quantity?: number
          supplier?: string
          unit?: string
          updated_at?: string | null
          user_id?: string | null
        }
      }
      pest_treatments: {
        Row: {
          application_date: string
          chemical: string
          completed: boolean | null
          cost: number
          created_at: string | null
          dosage: string
          effectiveness: string | null
          id: string
          next_treatment_due: string | null
          pest_type: string
          treatment_step: number
          tree_id: string | null
          user_id: string | null
        }
        Insert: {
          application_date: string
          chemical: string
          completed?: boolean | null
          cost?: number
          created_at?: string | null
          dosage: string
          effectiveness?: string | null
          id?: string
          next_treatment_due?: string | null
          pest_type: string
          treatment_step?: number
          tree_id?: string | null
          user_id?: string | null
        }
        Update: {
          application_date?: string
          chemical?: string
          completed?: boolean | null
          cost?: number
          created_at?: string | null
          dosage?: string
          effectiveness?: string | null
          id?: string
          next_treatment_due?: string | null
          pest_type?: string
          treatment_step?: number
          tree_id?: string | null
          user_id?: string | null
        }
      }
      trees: {
        Row: {
          created_at: string | null
          field_id: string | null
          id: string
          last_pruned: string | null
          planting_year: number
          row_number: number
          status: string | null
          tree_count: number
          user_id: string | null
          variety: string
          yield_estimate: number | null
        }
        Insert: {
          created_at?: string | null
          field_id?: string | null
          id?: string
          last_pruned?: string | null
          planting_year: number
          row_number: number
          status?: string | null
          tree_count?: number
          user_id?: string | null
          variety: string
          yield_estimate?: number | null
        }
        Update: {
          created_at?: string | null
          field_id?: string | null
          id?: string
          last_pruned?: string | null
          planting_year?: number
          row_number?: number
          status?: string | null
          tree_count?: number
          user_id?: string | null
          variety?: string
          yield_estimate?: number | null
        }
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          join_date: string | null
          name: string
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          join_date?: string | null
          name: string
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          join_date?: string | null
          name?: string
          role?: string | null
          status?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}