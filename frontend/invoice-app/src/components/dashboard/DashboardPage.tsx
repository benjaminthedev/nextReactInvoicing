
import { PoundSterling, Clock, TrendingDown, TrendingUp } from 'lucide-react'

const DashboardPage = () => {
  // Sample data - will be replaced with real data later
  const stats = {
    totalInvoiced: "£24,400",
    outstanding: "£5,200",
    overdue: "£1,200",
    averagePaymentTime: "8 days"
  }

  const recentInvoices = [
    { id: 'INV-001', client: 'Acme Corp', amount: '£1,200', status: 'Paid', date: '2024-12-01' },
    { id: 'INV-002', client: 'Stark Industries', amount: '£2,400', status: 'Pending', date: '2024-12-02' },
    { id: 'INV-003', client: 'Wayne Enterprises', amount: '£800', status: 'Overdue', date: '2024-12-03' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Invoiced */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Invoiced</h3>
            <PoundSterling className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stats.totalInvoiced}</div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">20.1%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stats.outstanding}</div>
          <p className="text-sm text-gray-500 mt-2">5 invoices pending</p>
        </div>

        {/* Overdue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold">{stats.overdue}</div>
          <p className="text-sm text-gray-500 mt-2">2 invoices overdue</p>
        </div>

        {/* Average Payment Time */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Average Payment Time</h3>
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.averagePaymentTime}</div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">2 days</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        <div className="space-y-4">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div>
                <p className="font-medium">{invoice.client}</p>
                <p className="text-sm text-gray-500">{invoice.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{invoice.amount}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage