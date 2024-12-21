import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Customer {
  _id: string
  name: string
  email: string
  vatNumber?: string
  address?: {
    street?: string
    city?: string
    postcode?: string
    country?: string
  }
  phone?: string
  notes?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer._id}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                )}
                {customer.vatNumber && (
                  <p className="text-sm text-gray-600">VAT: {customer.vatNumber}</p>
                )}
                {customer.address && (
                  <p className="text-sm text-gray-600">
                    {customer.address.street}, {customer.address.city}, {customer.address.postcode}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}