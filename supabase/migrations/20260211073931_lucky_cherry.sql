/*
  # Farm Management System Database Schema

  1. New Tables
    - `user_profiles` - Extended user information
    - `fields` - Farm field/orchard block management
    - `trees` - Tree block management with varieties
    - `harvest_records` - Apple harvest tracking
    - `pest_treatments` - Integrated pest management
    - `financial_entries` - Income and expense tracking
    - `inventory` - Fertilizer and pesticide inventory
    - `equipment` - Farm equipment registry
    - `fertilizer_applications` - Field fertilizer application history

  2. Security
    - Enable RLS on all tables
    - Add policies for user-specific data access
    - Ensure users can only access their own data

  3. Features
    - User-specific data isolation
    - Apple variety tracking
    - Quality grading system
    - Financial management
    - Equipment maintenance tracking
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  area DECIMAL(10,2) NOT NULL,
  crop TEXT NOT NULL DEFAULT 'Apple Trees',
  planting_date DATE NOT NULL,
  growth_stage TEXT DEFAULT 'vegetative' CHECK (growth_stage IN ('seeding', 'vegetative', 'flowering', 'fruiting', 'harvesting')),
  weed_state TEXT DEFAULT 'low' CHECK (weed_state IN ('low', 'medium', 'high')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trees table
CREATE TABLE IF NOT EXISTS trees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  variety TEXT NOT NULL CHECK (variety IN ('Ambri', 'Royal Delicious', 'Red Delicious', 'Golden Delicious', 'Gala', 'Fuji')),
  row_number INTEGER NOT NULL,
  tree_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'diseased', 'pruned', 'dormant')),
  planting_year INTEGER NOT NULL,
  last_pruned DATE,
  yield_estimate INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Harvest records table
CREATE TABLE IF NOT EXISTS harvest_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
  variety TEXT NOT NULL,
  bin_count INTEGER DEFAULT 0,
  lug_count INTEGER DEFAULT 0,
  quality_grade TEXT DEFAULT 'standard' CHECK (quality_grade IN ('premium', 'standard', 'processing')),
  harvest_date DATE NOT NULL,
  price_per_bin DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  picker TEXT NOT NULL,
  storage_location TEXT,
  starch_index DECIMAL(3,1),
  shelf_life_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pest treatments table
CREATE TABLE IF NOT EXISTS pest_treatments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
  pest_type TEXT NOT NULL CHECK (pest_type IN ('woolly_aphid', 'codling_moth', 'scale_insects', 'mites', 'leaf_roller')),
  treatment_step INTEGER DEFAULT 1,
  chemical TEXT NOT NULL,
  dosage TEXT NOT NULL,
  application_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  next_treatment_due DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  effectiveness TEXT CHECK (effectiveness IN ('excellent', 'good', 'fair', 'poor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial entries table
CREATE TABLE IF NOT EXISTS financial_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sales', 'purchases', 'equipment', 'fertilizer', 'pesticide', 'labor', 'other')),
  amount DECIMAL(12,2) DEFAULT 0,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('income', 'expense')),
  entry_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('fertilizer', 'pesticide')),
  quantity DECIMAL(10,2) DEFAULT 0,
  unit TEXT NOT NULL,
  price_per_unit DECIMAL(10,2) DEFAULT 0,
  supplier TEXT NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  ownership TEXT DEFAULT 'owned' CHECK (ownership IN ('owned', 'leased')),
  daily_cost DECIMAL(10,2) DEFAULT 0,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  last_maintenance DATE,
  next_service DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fertilizer applications table
CREATE TABLE IF NOT EXISTS fertilizer_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  application_date DATE NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertilizer_applications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Fields policies
CREATE POLICY "Users can read own fields"
  ON fields
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fields"
  ON fields
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fields"
  ON fields
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fields"
  ON fields
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trees policies
CREATE POLICY "Users can read own trees"
  ON trees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trees"
  ON trees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trees"
  ON trees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trees"
  ON trees
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Harvest records policies
CREATE POLICY "Users can read own harvest records"
  ON harvest_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own harvest records"
  ON harvest_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own harvest records"
  ON harvest_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own harvest records"
  ON harvest_records
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Pest treatments policies
CREATE POLICY "Users can read own pest treatments"
  ON pest_treatments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pest treatments"
  ON pest_treatments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pest treatments"
  ON pest_treatments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pest treatments"
  ON pest_treatments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Financial entries policies
CREATE POLICY "Users can read own financial entries"
  ON financial_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial entries"
  ON financial_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial entries"
  ON financial_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial entries"
  ON financial_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Inventory policies
CREATE POLICY "Users can read own inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Equipment policies
CREATE POLICY "Users can read own equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment"
  ON equipment
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment"
  ON equipment
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fertilizer applications policies
CREATE POLICY "Users can read own fertilizer applications"
  ON fertilizer_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilizer applications"
  ON fertilizer_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fertilizer applications"
  ON fertilizer_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertilizer applications"
  ON fertilizer_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_trees_user_id ON trees(user_id);
CREATE INDEX IF NOT EXISTS idx_trees_field_id ON trees(field_id);
CREATE INDEX IF NOT EXISTS idx_harvest_records_user_id ON harvest_records(user_id);
CREATE INDEX IF NOT EXISTS idx_harvest_records_tree_id ON harvest_records(tree_id);
CREATE INDEX IF NOT EXISTS idx_pest_treatments_user_id ON pest_treatments(user_id);
CREATE INDEX IF NOT EXISTS idx_pest_treatments_tree_id ON pest_treatments(tree_id);
CREATE INDEX IF NOT EXISTS idx_financial_entries_user_id ON financial_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_applications_user_id ON fertilizer_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_applications_field_id ON fertilizer_applications(field_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    'owner',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to inventory table
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();