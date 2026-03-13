/*
  # Create Clients Table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `barbershop_id` (uuid, references barbershops)
      - `name` (text)
      - `email` (text, optional)
      - `phone` (text, optional)
      - `notes` (text, optional)
      - `visit_count` (integer, default 0)
      - `last_visit` (timestamp, optional)
      - `total_spent` (decimal, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on clients table
    - Users can only access clients from their own barbershop
    - Authenticated users can view and manage clients
    - All operations restricted by barbershop membership

  3. Indexes
    - barbershop_id for faster queries
    - name for search functionality
    - phone and email for lookups
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  notes text,
  visit_count integer DEFAULT 0,
  last_visit timestamptz,
  total_spent decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clients in their barbershop"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = clients.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create clients in their barbershop"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = clients.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update clients in their barbershop"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = clients.barbershop_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = clients.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete clients in their barbershop"
  ON clients FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = clients.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_clients_barbershop_id ON clients(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_last_visit ON clients(last_visit);
