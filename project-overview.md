# Invoice Application Overview

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Vercel Serverless Functions
- Database: MongoDB
- Authentication: Clerk.dev
- Styling: Tailwind CSS + shadcn/ui
- Deployment: Vercel

## Backend Architecture

### API Routes (/api)
- `/auth` - Authentication endpoints
- `/invoices` - Invoice CRUD operations
- `/customers` - Customer management
- `/uploads` - File upload handling (logos)
- `/pdf` - PDF generation endpoints

### Database Schema (MongoDB)
- Users Collection
  - Personal details
  - Preferences
  - Subscription status

- Companies Collection
  - Business details
  - VAT information
  - Bank details
  - Logo
  
- Customers Collection
  - Contact information
  - Billing details
  - Invoice history

- Invoices Collection
  - Invoice details
  - Items
  - Payment status
  - PDF version
  - History/revisions

## Frontend Structure

### Core Pages
1. Dashboard (`/`)
   - Overview of recent invoices
   - Quick actions
   - Financial summaries

2. Invoices
   - List view (`/invoices`)
   - Create new (`/invoices/new`)
   - Edit existing (`/invoices/[id]`)
   - Preview (`/invoices/[id]/preview`)

3. Customers
   - List view (`/customers`)
   - Customer details (`/customers/[id]`)
   - Add new (`/customers/new`)

4. Settings (`/settings`)
   - Company details
   - Invoice templates
   - Tax settings
   - Bank details

### Key Components
- InvoiceForm
- InvoicePreview
- CustomerForm
- CompanySettings
- LogoUploader
- PDFViewer
- DataTable
- FilterBar
- SearchComponent

## Styling System

### Theme Structure
- Base styles (Tailwind)
- Component library (shadcn/ui)
- Custom components
- Print styles
- PDF templates

### Design Tokens
- Colors
- Typography
- Spacing
- Breakpoints
- Shadows
- Animations

## Authentication Flow

### User Journey
1. Sign up/Login
   - Social providers
   - Email/password
   - Magic links

2. Profile Setup
   - Company details
   - Initial settings
   - Logo upload

3. Access Control
   - Route protection
   - API authentication
   - Resource permissions

## Development Workflow

### Setup Instructions
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
# Authentication
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
MONGODB_URI=

# Storage (for logos)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# API
VITE_API_URL=
```

## Deployment

### Vercel Configuration
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Environment Variables: Copy from `.env`

### Production Checks
- TypeScript compilation
- Linting rules
- Build optimization
- Environment variables
- Database connection
- Storage connection

## Future Enhancements
- Multiple invoice templates
- Recurring invoices
- Payment integration
- Multiple currencies
- Export/Import functionality
- Client portal
- Email notifications
- Teams/collaboration
- API access for clients

## Project Dependencies
```json
{
  "dependencies": {
    "@clerk/clerk-react": "latest",
    "@tanstack/react-query": "latest",
    "react-hook-form": "latest",
    "react-pdf": "latest",
    "zod": "latest",
    "@radix-ui/react-*": "latest",
    "axios": "latest",
    "date-fns": "latest",
    "tailwindcss": "latest",
    "@shadcn/ui": "latest"
  }
}
```
