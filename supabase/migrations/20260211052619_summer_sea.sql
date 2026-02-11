/*
  # Farm Management System Database Schema

  1. New Tables
    - `fields` - Farm field/orchard block information
    - `trees` - Tree block management with variety and health tracking
    - `harvest_records` - Apple harvest tracking with quality grading
    - `pest_treatments` - Integrated pest management records
    - `financial_entries` - Income and expense tracking
    - `inventory` - Fertilizer and pesticide inventory management
    - `equipment` - Farm equipment registry and maintenance
    - `users` - Team member management with role-based access
    - `fertilizer_applications` - Field fertilizer application history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Implement proper access controls for different user types

  3. Features
    - Apple-specific variety tracking
    - Pest management with treatment protocols
    - Financial ledger with categorization
    - Equipment maintenance scheduling
    - User role management (owner, editor, viewer)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fields table for orchard blocks
CREATE TABLE IF NOT EXISTS fields (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  area decimal(10,2) NOT NULL,
  crop text NOT NULL,
  planting_date date NOT NULL,
  growth_stage text CHECK (growth_stage IN ('seeding', 'vegetative', 'flowering', 'fruiting', 'harvesting')) DEFAULT 'seeding',
  weed_state text CHECK (weed_state IN ('low', 'medium', 'high')) DEFAULT 'low',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Trees table for tree block management
CREATE TABLE IF NOT EXISTS trees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
  variety text NOT NULL,
  row_number integer NOT NULL,
  tree_count integer NOT NULL DEFAULT 0,
  status text CHECK (status IN ('healthy', 'diseased', 'pruned', 'dormant')) DEFAULT 'healthy',
  planting_year integer NOT NULL,
  last_pruned date,
  yield_estimate integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Fertilizer applications table
CREATE TABLE IF NOT EXISTS fertilizer_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  application_date date NOT NULL,
  cost decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Harvest records table
CREATE TABLE IF NOT EXISTS harvest_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id uuid REFERENCES trees(id) ON DELETE CASCADE,
  variety text NOT NULL,
  bin_count integer NOT NULL DEFAULT 0,
  lug_count integer NOT NULL DEFAULT 0,
  quality_grade text CHECK (quality_grade IN ('premium', 'standard', 'processing')) DEFAULT 'standard',
  harvest_date date NOT NULL,
  price_per_bin decimal(10,2) NOT NULL DEFAULT 0,
  total_revenue decimal(10,2) NOT NULL DEFAULT 0,
  picker text NOT NULL,
  storage_location text,
  starch_index decimal(3,1),
  shelf_life_days integer,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Pest treatments table
CREATE TABLE IF NOT EXISTS pest_treatments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id uuid REFERENCES trees(id) ON DELETE CASCADE,
  pest_type text CHECK (pest_type IN ('woolly_aphid', 'codling_moth', 'scale_insects', 'mites', 'leaf_roller')) NOT NULL,
  treatment_step integer NOT NULL DEFAULT 1,
  chemical text NOT NULL,
  dosage text NOT NULL,
  application_date date NOT NULL,
  completed boolean DEFAULT false,
  next_treatment_due date,
  cost decimal(10,2) NOT NULL DEFAULT 0,
  effectiveness text CHECK (effectiveness IN ('excellent', 'good', 'fair', 'poor')),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Financial entries table
CREATE TABLE IF NOT EXISTS financial_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_date date NOT NULL,
  description text NOT NULL,
  category text CHECK (category IN ('sales', 'purchases', 'equipment', 'fertilizer', 'pesticide', 'labor', 'other')) NOT NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0,
  entry_type text CHECK (entry_type IN ('income', 'expense')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  item_type text CHECK (item_type IN ('fertilizer', 'pesticide')) NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 0,
  unit text NOT NULL,
  price_per_unit decimal(10,2) NOT NULL DEFAULT 0,
  supplier text NOT NULL,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  equipment_type text NOT NULL,
  ownership text CHECK (ownership IN ('owned', 'leased')) DEFAULT 'owned',
  daily_cost decimal(10,2) NOT NULL DEFAULT 0,
  condition text CHECK (condition IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  last_maintenance date,
  next_service date,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'viewer',
  status text CHECK (status IN ('active', 'pending')) DEFAULT 'pending',
  join_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertilizer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fields
CREATE POLICY "Users can view fields they have access to"
  ON fields
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own fields"
  ON fields
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update fields they own or have editor access"
  ON fields
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

-- RLS Policies for trees
CREATE POLICY "Users can view trees they have access to"
  ON trees
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own trees"
  ON trees
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update trees they own or have editor access"
  ON trees
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

-- RLS Policies for fertilizer_applications
CREATE POLICY "Users can view fertilizer applications they have access to"
  ON fertilizer_applications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own fertilizer applications"
  ON fertilizer_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for harvest_records
CREATE POLICY "Users can view harvest records they have access to"
  ON harvest_records
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own harvest records"
  ON harvest_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for pest_treatments
CREATE POLICY "Users can view pest treatments they have access to"
  ON pest_treatments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own pest treatments"
  ON pest_treatments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for financial_entries
CREATE POLICY "Users can view financial entries they have access to"
  ON financial_entries
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Users can insert their own financial entries"
  ON financial_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory they have access to"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update inventory they own or have editor access"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

-- RLS Policies for equipment
CREATE POLICY "Users can view equipment they have access to"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
    )
  );

CREATE POLICY "Users can insert their own equipment"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update equipment they own or have editor access"
  ON equipment
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Owners can manage all user profiles
CREATE POLICY "Owners can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_trees_field_id ON trees(field_id);
CREATE INDEX IF NOT EXISTS idx_trees_user_id ON trees(user_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_applications_field_id ON fertilizer_applications(field_id);
CREATE INDEX IF NOT EXISTS idx_harvest_records_tree_id ON harvest_records(tree_id);
CREATE INDEX IF NOT EXISTS idx_pest_treatments_tree_id ON pest_treatments(tree_id);
CREATE INDEX IF NOT EXISTS idx_financial_entries_user_id ON financial_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role, status)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email), 'viewer', 'active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();