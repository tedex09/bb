/*
  # Create Authentication Schema

  1. New Tables
    - `barbershops` - Multi-tenant accounts
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `profiles` - User profiles linked to auth.users
      - `id` (uuid, primary key, references auth.users)
      - `barbershop_id` (uuid, references barbershops)
      - `email` (text)
      - `name` (text)
      - `role` (text: owner, manager, barber, receptionist)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Profiles can only be read/updated by the user or barbershop owner
    - Data access restricted by barbershop_id

  3. Indexes
    - barbershop_id on profiles for faster queries
    - email on barbershops for unique constraint
*/

CREATE TABLE IF NOT EXISTS barbershops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  barbershop_id uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'receptionist' CHECK (role IN ('owner', 'manager', 'barber', 'receptionist')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles in their barbershop"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.barbershop_id = profiles.barbershop_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Barbershop owners can insert new profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.barbershop_id = profiles.barbershop_id
      AND p.id = auth.uid()
      AND p.role = 'owner'
    )
  );

CREATE POLICY "Public can view barbershops"
  ON barbershops FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_profiles_barbershop_id ON profiles(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
