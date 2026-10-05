import { useMemo, useState } from 'react'
import { Download, Eye } from 'lucide-react'
import { NewInvoiceDialog } from '@/components/invoices/NewInvoiceDialog'
import { InvoicePdfDownload, InvoicePreviewDialog } from '@/components/invoices/InvoicePreviewDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Invoice, InvoiceStatus } from '@/components/invoices/types'
import { useAppStore } from '@/lib/store'
import { displayStatus, formatGBP, invoiceTotal, statusClass } from '@/lib/invoice'

type StatusFilter = 'all' | InvoiceStatus

function matchesSearch(invoice: Invoice, search: string) {
  const haystack = [
    invoice.invoiceNumber,
    invoice.clientName,
    invoice.clientEmail,
  ].join(' ').toLowerCase()
  return haystack.includes(search.trim().toLowerCase())
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function exportInvoices(invoices: Invoice[]) {
  const header = ['Invoice', 'Client', 'Email', 'Amount', 'Issue date', 'Due date', 'Status']
  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.clientName,
    invoice.clientEmail,
    invoiceTotal(invoice).toFixed(2),
    invoice.issueDate,
    invoice.dueDate,
    displayStatus(invoice),
  ].map((value) => csvCell(String(value))).join(','))
  const csv = [header.join(','), ...rows].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'invoices.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const InvoicesPage = () => {
  const { invoices, setInvoicePaid } = useAppStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [preview, setPreview] = useState<Invoice | null>(null)

  const visibleInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const status = displayStatus(invoice)
      const statusMatches = statusFilter === 'all' || status === statusFilter
      return statusMatches && matchesSearch(invoice, search)
    })
  }, [invoices, search, statusFilter])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <NewInvoiceDialog />
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search invoices"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-[180px]" aria-label="Filter by status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={() => exportInvoices(visibleInvoices)}
          disabled={visibleInvoices.length === 0}
        >
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-gray-500">No invoices yet. Create one to see it here.</p>
          ) : visibleInvoices.length === 0 ? (
            <p className="text-sm text-gray-500">No invoices match your search.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleInvoices.map((invoice) => {
                  const status = displayStatus(invoice)
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{formatGBP(invoiceTotal(invoice))}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${statusClass(status)}`}>
                          {status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreview(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <InvoicePdfDownload data={invoice} />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setInvoicePaid(invoice.id, status !== 'Paid')}
                          >
                            {status === 'Paid' ? 'Mark unpaid' : 'Mark paid'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InvoicePreviewDialog
        data={preview}
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) setPreview(null)
        }}
      />
    </div>
  )
}

export default InvoicesPage
