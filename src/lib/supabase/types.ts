/**
 * Shared Database shape for @supabase/supabase-js.
 * Columns match docs/data-model/property-listings-schema.md
 * and supabase/migrations/20250321000000_property_listings.sql.
 */
import type { ListingStatus } from '../../types/listing-status'
import type { PropertyType } from '../../types/property-type'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PropertyListingRow = {
  id: string
  owner_id: string
  title: string
  description: string | null
  property_type: PropertyType
  status: ListingStatus
  address_line1: string
  address_line2: string | null
  city: string
  region: string
  postal_code: string
  country: string
  price: number
  currency: string
  closed_at: string | null
  created_at: string
  updated_at: string
}

export type PropertyListingInsert = {
  id?: string
  owner_id: string
  title: string
  description?: string | null
  property_type: PropertyType
  status?: ListingStatus
  address_line1: string
  address_line2?: string | null
  city: string
  region: string
  postal_code: string
  country?: string
  price?: number
  currency?: string
  closed_at?: string | null
  created_at?: string
  updated_at?: string
}

export type PropertyListingUpdate = {
  id?: string
  owner_id?: string
  title?: string
  description?: string | null
  property_type?: PropertyType
  status?: ListingStatus
  address_line1?: string
  address_line2?: string | null
  city?: string
  region?: string
  postal_code?: string
  country?: string
  price?: number
  currency?: string
  closed_at?: string | null
  created_at?: string
  updated_at?: string
}

export type Database = {
  public: {
    Tables: {
      property_listings: {
        Row: PropertyListingRow
        Insert: PropertyListingInsert
        Update: PropertyListingUpdate
        Relationships: [
          {
            foreignKeyName: 'property_listings_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedSchema: 'auth'
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
