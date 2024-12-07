import React from 'react'
import { Plus, X } from 'lucide-react'

interface InvoiceFormData {
  clientName: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  items: {
    description: string
    quantity: number
    price: number
  }[]
  notes?: string
}

const NewInvoiceForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = React.useState<InvoiceFormData>({
    clientName: '',
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: ''
  })

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Invoice</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.clientName}
                  onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.invoiceNumber}
                  onChange={e => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.issueDate}
                  onChange={e => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.dueDate}
                  onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-full rounded-md border-gray-300 shadow-sm"
                      value={item.description}
                      onChange={e => {
                        const newItems = [...formData.items]
                        newItems[index].description = e.target.value
                        setFormData(prev => ({ ...prev, items: newItems }))
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full rounded-md border-gray-300 shadow-sm"
                      value={item.quantity}
                      onChange={e => {
                        const newItems = [...formData.items]
                        newItems[index].quantity = Number(e.target.value)
                        setFormData(prev => ({ ...prev, items: newItems }))
                      }}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full rounded-md border-gray-300 shadow-sm"
                      value={item.price}
                      onChange={e => {
                        const newItems = [...formData.items]
                        newItems[index].price = Number(e.target.value)
                        setFormData(prev => ({ ...prev, items: newItems }))
                      }}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewInvoiceForm;