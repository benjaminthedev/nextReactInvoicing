// src/components/invoices/types.ts
import { z } from 'zod'

export const invoiceSchema = z.object({
  companyDetails: z.object({
    name: z.string().min(1, 'Company name is required'),
    address: z.string().min(1, 'Address is required'),
    vatNumber: z.string().regex(/^GB\d{9}$/, 'Invalid UK VAT number format'),
    companyNumber: z.string().min(8, 'Company number is required'),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientVatNumber: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
    vatRate: z.number(),
  })).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  includeVat: z.boolean(),
  paymentTerms: z.string(),
  bankDetails: z.string().min(1, 'Bank details are required'),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>