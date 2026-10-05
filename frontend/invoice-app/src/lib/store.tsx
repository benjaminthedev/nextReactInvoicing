import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  emptyCompanyProfile,
  type CompanyProfile,
  type Invoice,
  type InvoiceFormData,
} from '@/components/invoices/types'
import type { Customer, CustomerFormData } from '@/pages/customers/types'

const STORAGE_KEY = 'invoice-app-data'

type StoreData = {
  invoices: Invoice[]
  customers: Customer[]
  company: CompanyProfile
}

type StoreContextValue = StoreData & {
  addInvoice: (data: InvoiceFormData) => Invoice
  setInvoicePaid: (id: string, paid: boolean) => void
  addCustomer: (data: CustomerFormData) => Customer
  updateCustomer: (id: string, data: CustomerFormData) => void
  saveCompany: (company: CompanyProfile) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function emptyStore(): StoreData {
  return {
    invoices: [],
    customers: [],
    company: emptyCompanyProfile,
  }
}

function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as Partial<StoreData>
    return {
      invoices: Array.isArray(parsed.invoices) ? parsed.invoices : [],
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      company: {
        companyDetails: {
          ...emptyCompanyProfile.companyDetails,
          ...parsed.company?.companyDetails,
        },
        bankDetails: parsed.company?.bankDetails ?? '',
      },
    }
  } catch {
    return emptyStore()
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(loadStore)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const value = useMemo<StoreContextValue>(() => ({
    ...data,
    addInvoice: (invoiceData) => {
      const invoice: Invoice = {
        ...invoiceData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setData((current) => ({
        ...current,
        invoices: [invoice, ...current.invoices],
      }))
      return invoice
    },
    setInvoicePaid: (id, paid) => {
      setData((current) => ({
        ...current,
        invoices: current.invoices.map((invoice) => (
          invoice.id === id
            ? { ...invoice, paidAt: paid ? new Date().toISOString() : undefined }
            : invoice
        )),
      }))
    },
    addCustomer: (customerData) => {
      const customer: Customer = {
        ...customerData,
        id: crypto.randomUUID(),
      }
      setData((current) => ({
        ...current,
        customers: [customer, ...current.customers],
      }))
      return customer
    },
    updateCustomer: (id, customerData) => {
      setData((current) => ({
        ...current,
        customers: current.customers.map((customer) => (
          customer.id === id ? { ...customerData, id } : customer
        )),
      }))
    },
    saveCompany: (company) => {
      setData((current) => ({ ...current, company }))
    },
  }), [data])

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useAppStore() {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }
  return store
}
