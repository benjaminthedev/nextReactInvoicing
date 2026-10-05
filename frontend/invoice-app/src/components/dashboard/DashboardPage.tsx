import { Link } from 'react-router-dom'
import { PoundSterling, Clock, TrendingDown } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  averagePaymentDays,
  displayStatus,
  formatGBP,
  invoiceTotal,
  statusClass,
} from '@/lib/invoice'

const DashboardPage = () => {
  const { invoices } = useAppStore()

  const totals = invoices.reduce((summary, invoice) => {
    const amount = invoiceTotal(invoice)
    const status = displayStatus(invoice)
    summary.total += amount
    if (status === 'Pending') {
      summary.outstanding += amount
      summary.pendingCount += 1
    }
    if (status === 'Overdue') {
      summary.overdue += amount
      summary.overdueCount += 1
    }
    return summary
  }, { total: 0, outstanding: 0, overdue: 0, pendingCount: 0, overdueCount: 0 })

  const averageDays = averagePaymentDays(invoices)
  const recentInvoices = [...invoices]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Invoiced</h3>
            <PoundSterling className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{formatGBP(totals.total)}</div>
          <p className="text-sm text-gray-500 mt-2">
            {invoices.length === 0
              ? 'No invoices yet'
              : `${invoices.length} ${invoices.length === 1 ? 'invoice' : 'invoices'}`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{formatGBP(totals.outstanding)}</div>
          <p className="text-sm text-gray-500 mt-2">
            {`${totals.pendingCount} ${totals.pendingCount === 1 ? 'invoice' : 'invoices'} pending`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold">{formatGBP(totals.overdue)}</div>
          <p className="text-sm text-gray-500 mt-2">
            {`${totals.overdueCount} ${totals.overdueCount === 1 ? 'invoice' : 'invoices'} overdue`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Average Payment Time</h3>
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            {averageDays === null ? '—' : `${averageDays} ${averageDays === 1 ? 'day' : 'days'}`}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {averageDays === null ? 'No paid invoices yet' : 'From issue date to payment'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        {recentInvoices.length === 0 ? (
          <p className="text-sm text-gray-500">
            No invoices yet. Create one from the <Link to="/invoices" className="underline">Invoices</Link> page.
          </p>
        ) : (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => {
              const status = displayStatus(invoice)
              return (
                <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{invoice.clientName}</p>
                    <p className="text-sm text-gray-500">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{formatGBP(invoiceTotal(invoice))}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusClass(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
