/*
  # Create Services and Appointments Tables

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `barbershop_id` (uuid, references barbershops)
      - `name` (text)
      - `description` (text, optional)
      - `duration` (integer, minutes)
      - `price` (decimal)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `barbers`
      - `id` (uuid, primary key)
      - `barbershop_id` (uuid, references barbershops)
      - `name` (text)
      - `email` (text, optional)
      - `phone` (text, optional)
      - `specialties` (text, optional)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `appointments`
      - `id` (uuid, primary key)
      - `barbershop_id` (uuid, references barbershops)
      - `client_id` (uuid, references clients)
      - `barber_id` (uuid, references barbers)
      - `service_id` (uuid, references services)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `status` (text: scheduled, completed, cancelled, no_show)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `payments`
      - `id` (uuid, primary key)
      - `barbershop_id` (uuid, references barbershops)
      - `appointment_id` (uuid, references appointments)
      - `amount` (decimal)
      - `method` (text: cash, card, digital)
      - `status` (text: pending, completed, refunded)
      - `paid_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access data from their own barbershop
    - All operations restricted by barbershop membership

  3. Indexes
    - Foreign keys for faster joins
    - Start time for appointment queries
    - Status fields for filtering
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration integer NOT NULL,
  price decimal(10, 2) NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  specialties text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE RESTRICT,
  amount decimal(10, 2) NOT NULL,
  method text NOT NULL CHECK (method IN ('cash', 'card', 'digital')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view services in their barbershop"
  ON services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = services.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage services in their barbershop"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = services.barbershop_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = services.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can view barbers in their barbershop"
  ON barbers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = barbers.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage barbers in their barbershop"
  ON barbers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = barbers.barbershop_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = barbers.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can view appointments in their barbershop"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = appointments.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage appointments in their barbershop"
  ON appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = appointments.barbershop_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = appointments.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can view payments in their barbershop"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = payments.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage payments in their barbershop"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = payments.barbershop_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.barbershop_id = payments.barbershop_id
      AND profiles.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_services_barbershop_id ON services(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_barbers_barbershop_id ON barbers(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_barbershop_id ON appointments(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_barber_id ON appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_payments_barbershop_id ON payments(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON payments(appointment_id);
