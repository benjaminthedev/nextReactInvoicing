import { z } from 'zod'

export const PAYMENT_TERMS = [
  { label: 'Due on Receipt', value: 'due_on_receipt' },
  { label: 'Net 7', value: 'net_7' },
  { label: 'Net 14', value: 'net_14' },
  { label: 'Net 30', value: 'net_30' },
  { label: 'Net 60', value: 'net_60' },
] as const

export const VAT_RATES = [
  { label: 'Standard Rate (20%)', value: 20 },
  { label: 'Reduced Rate (5%)', value: 5 },
  { label: 'Zero Rate (0%)', value: 0 },
] as const

const optionalEmail = z.union([
  z.literal(''),
  z.string().email('Invalid email address'),
])

export const companyDetailsSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  vatNumber: z.string().regex(/^GB\d{9}$/, 'Invalid UK VAT number format'),
  companyNumber: z.string().min(8, 'Company number is required'),
  phone: z.string().optional(),
  email: optionalEmail.optional(),
  logo: z.string().optional(),
})

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
  vatRate: z.number(),
})

export const invoiceSchema = z.object({
  companyDetails: companyDetailsSchema,
  customerId: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientVatNumber: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  includeVat: z.boolean(),
  paymentTerms: z.string(),
  bankDetails: z.string().min(1, 'Bank details are required'),
})

export const companyProfileSchema = z.object({
  companyDetails: companyDetailsSchema,
  bankDetails: z.string().min(1, 'Bank details are required'),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type CompanyProfile = z.infer<typeof companyProfileSchema>
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export type Invoice = InvoiceFormData & {
  id: string
  createdAt: string
  paidAt?: string
}

export const emptyCompanyProfile: CompanyProfile = {
  companyDetails: {
    name: '',
    address: '',
    vatNumber: '',
    companyNumber: '',
    phone: '',
    email: '',
    logo: '',
  },
  bankDetails: '',
}

export function paymentTermLabel(value: string) {
  return PAYMENT_TERMS.find((term) => term.value === value)?.label ?? value
}
