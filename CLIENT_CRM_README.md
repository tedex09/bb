# Client CRM Module

A comprehensive client relationship management system built with Next.js 13, Supabase, and shadcn/ui components.

## Features

### Client Management
- Create new clients with contact information
- Edit existing client details
- Delete clients (with confirmation dialog)
- Search clients by name, phone, or email
- Real-time search with debouncing

### Client Profile
- Comprehensive client information display
- Contact details (phone, email)
- Client statistics (visit count, total spent)
- Custom notes for each client
- Last visit tracking

### Appointment History
- Complete appointment timeline
- Appointment status tracking (scheduled, completed, cancelled, no_show)
- Service and barber information
- Payment status and method
- Appointment notes

## Database Schema

### Clients Table
```sql
- id (uuid, primary key)
- barbershop_id (uuid, foreign key)
- name (text)
- email (text, optional)
- phone (text, optional)
- notes (text, optional)
- visit_count (integer, default 0)
- last_visit (timestamp, optional)
- total_spent (decimal, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### Related Tables
- services: Service catalog with pricing
- barbers: Staff members
- appointments: Appointment records with client, barber, and service
- payments: Payment tracking for appointments

## Components

### Client List (`components/clients/client-list.tsx`)
- Mobile-first card layout
- Click to navigate to client profile
- Displays key client information
- Shows visit count and total spent badges

### Client Search (`components/clients/client-search.tsx`)
- Real-time search functionality
- Searches across name, phone, and email
- 300ms debounce for performance
- Updates URL search parameters

### Client Form Dialog (`components/clients/client-form-dialog.tsx`)
- Modal form for creating/editing clients
- Form validation with zod
- React Hook Form integration
- Toast notifications for success/error

### Client Profile Header (`components/clients/client-profile-header.tsx`)
- Client information display
- Edit and delete actions
- Contact information with clickable links
- Notes section

### Appointment History (`components/clients/appointment-history.tsx`)
- Chronological appointment list
- Status badges with color coding
- Service, barber, and payment details
- Formatted dates and times

## Server Actions

### `createClient(userId, input)`
Creates a new client for the user's barbershop.

### `updateClient(userId, input)`
Updates an existing client's information.

### `deleteClient(userId, clientId)`
Deletes a client from the database.

### `getClients(userId, searchQuery?)`
Retrieves all clients with optional search filtering.

### `getClient(userId, clientId)`
Retrieves a single client by ID.

### `getClientAppointments(userId, clientId)`
Retrieves all appointments for a specific client with related data.

## Routes

### `/clients`
- Client list page
- Search functionality
- Add new client button
- Server-side rendering with search params

### `/clients/[id]`
- Individual client profile
- Client information card
- Appointment history
- Edit and delete actions

## Security

All data access is protected by Row Level Security (RLS) policies:
- Users can only access clients from their own barbershop
- All operations require authentication
- Data isolation by barbershop_id

## Mobile-First Design

- Responsive layouts for all screen sizes
- Touch-friendly buttons and cards
- Bottom navigation for mobile
- Optimized for small screens

## Usage

1. Navigate to the Clients page from the navigation menu
2. Use the search bar to find specific clients
3. Click "Add Client" to create a new client profile
4. Click on any client card to view their full profile
5. View appointment history on the client profile page
6. Edit or delete clients using the action buttons

## Dependencies

- Next.js 13 (App Router)
- Supabase (Database & Auth)
- shadcn/ui (UI Components)
- React Hook Form (Form Management)
- Zod (Schema Validation)
- date-fns (Date Formatting)
- Lucide React (Icons)
