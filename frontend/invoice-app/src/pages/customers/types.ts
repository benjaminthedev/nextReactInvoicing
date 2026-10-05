import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  vatNumber: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().default('United Kingdom'),
  }),
  notes: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export type Customer = CustomerFormData & {
  id: string
}

export const emptyCustomer: CustomerFormData = {
  name: '',
  email: '',
  vatNumber: '',
  phone: '',
  address: {
    street: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  },
  notes: '',
}
