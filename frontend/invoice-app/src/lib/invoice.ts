import type { Invoice, InvoiceFormData, InvoiceStatus } from '@/components/invoices/types'

export function lineNet(item: InvoiceFormData['items'][number]) {
  const quantity = Number(item.quantity)
  const price = Number(item.price)
  if (!Number.isFinite(quantity) || !Number.isFinite(price)) return 0
  return quantity * price
}

export function invoiceSubtotal(data: Pick<InvoiceFormData, 'items'>) {
  return data.items.reduce((sum, item) => sum + lineNet(item), 0)
}

export function invoiceVat(data: Pick<InvoiceFormData, 'items' | 'includeVat'>) {
  if (!data.includeVat) return 0
  return data.items.reduce((sum, item) => {
    const rate = Number(item.vatRate)
    const vatRate = Number.isFinite(rate) ? rate : 0
    return sum + lineNet(item) * (vatRate / 100)
  }, 0)
}

export function invoiceTotal(data: Pick<InvoiceFormData, 'items' | 'includeVat'>) {
  return invoiceSubtotal(data) + invoiceVat(data)
}

export function formatGBP(amount: number) {
  const value = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value)
}

export function displayStatus(invoice: Invoice, now = new Date()): InvoiceStatus {
  if (invoice.paidAt) return 'Paid'
  const due = new Date(`${invoice.dueDate}T00:00:00`)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (Number.isNaN(due.getTime())) return 'Pending'
  if (due < today) return 'Overdue'
  return 'Pending'
}

export function statusClass(status: InvoiceStatus) {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Overdue':
      return 'bg-red-100 text-red-800'
  }
}

export function averagePaymentDays(invoices: Invoice[]) {
  const paid = invoices.filter((invoice) => invoice.paidAt)
  if (paid.length === 0) return null

  const totalDays = paid.reduce((sum, invoice) => {
    const issued = new Date(`${invoice.issueDate}T00:00:00`)
    const paidAt = new Date(invoice.paidAt as string)
    const days = Math.round((paidAt.getTime() - issued.getTime()) / 86400000)
    return sum + Math.max(0, days)
  }, 0)

  return Math.round(totalDays / paid.length)
}

export function nextInvoiceNumber(invoices: Invoice[]) {
  const highest = invoices.reduce((max, invoice) => {
    const match = invoice.invoiceNumber.match(/(\d+)\s*$/)
    const value = match ? Number(match[1]) : 0
    return Math.max(max, value)
  }, 0)
  return `INV-${String(highest + 1).padStart(3, '0')}`
}
