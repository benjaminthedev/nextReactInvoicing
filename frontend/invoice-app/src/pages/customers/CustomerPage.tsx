import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { CustomerFormDialog } from './CustomerFormDialog'
import type { Customer } from './types'

function customerAddress(customer: Customer) {
  const { street, city, postcode } = customer.address
  return [street, city, postcode].filter(Boolean).join(', ')
}

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.email}`.toLowerCase()
    return haystack.includes(searchTerm.trim().toLowerCase())
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <CustomerFormDialog
          onSubmit={addCustomer}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          }
        />
      </div>

      <Input
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="max-w-sm"
        aria-label="Search customers"
      />

      {customers.length === 0 ? (
        <p className="text-sm text-gray-500">No customers yet. Add one to use them on invoices.</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="text-sm text-gray-500">No customers match your search.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => {
            const address = customerAddress(customer)
            return (
              <Card key={customer.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <CustomerFormDialog
                      customer={customer}
                      onSubmit={(data) => updateCustomer(customer.id, data)}
                      trigger={<Button variant="outline" size="sm">Edit</Button>}
                    />
                  </div>
                  {customer.phone && (
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  )}
                  {customer.vatNumber && (
                    <p className="text-sm text-gray-600">VAT: {customer.vatNumber}</p>
                  )}
                  {address && (
                    <p className="text-sm text-gray-600">{address}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
