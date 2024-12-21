import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoicePDF } from './InvoicePDF'
import { invoiceSchema, type InvoiceFormData } from './types'

const VAT_RATES = [
  { label: 'Standard Rate (20%)', value: 20 },
  { label: 'Reduced Rate (5%)', value: 5 },
  { label: 'Zero Rate (0%)', value: 0 },
]

const PAYMENT_TERMS = [
  { label: 'Due on Receipt', value: 'due_on_receipt' },
  { label: 'Net 7', value: 'net_7' },
  { label: 'Net 14', value: 'net_14' },
  { label: 'Net 30', value: 'net_30' },
  { label: 'Net 60', value: 'net_60' },
]

const defaultValues: InvoiceFormData = {
  companyDetails: {
    name: '',
    address: '',
    vatNumber: '',
    companyNumber: '',
    phone: '',
    email: ''
  },
  clientName: '',
  clientEmail: '',
  clientVatNumber: '',
  invoiceNumber: '',
  issueDate: format(new Date(), 'yyyy-MM-dd'),
  dueDate: '',
  items: [{ description: '', quantity: 1, price: 0, vatRate: 20 }],
  notes: '',
  includeVat: true,
  paymentTerms: 'net_30',
  bankDetails: ''
}

export function NewInvoiceDialog() {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues
  })

  const { register, control, watch, setValue, formState: { errors } } = form

  const calculateDueDate = (issueDate: string, terms: string) => {
    if (!issueDate) return ''
    const date = new Date(issueDate)
    switch (terms) {
      case 'due_on_receipt':
        return format(date, 'yyyy-MM-dd')
      case 'net_7':
        return format(addDays(date, 7), 'yyyy-MM-dd')
      case 'net_14':
        return format(addDays(date, 14), 'yyyy-MM-dd')
      case 'net_30':
        return format(addDays(date, 30), 'yyyy-MM-dd')
      case 'net_60':
        return format(addDays(date, 60), 'yyyy-MM-dd')
      default:
        return format(addDays(date, 30), 'yyyy-MM-dd')
    }
  }

  const watchIssueDate = watch('issueDate')
  const watchPaymentTerms = watch('paymentTerms')
  const watchItems = watch('items')
  const watchIncludeVat = watch('includeVat')

  React.useEffect(() => {
    if (watchIssueDate && watchPaymentTerms) {
      const newDueDate = calculateDueDate(watchIssueDate, watchPaymentTerms)
      setValue('dueDate', newDueDate)
    }
  }, [watchIssueDate, watchPaymentTerms, setValue])

  const addItem = () => {
    const currentItems = watch('items')
    setValue('items', [...currentItems, { description: '', quantity: 1, price: 0, vatRate: 20 }])
  }

  const removeItem = (index: number) => {
    const currentItems = watch('items')
    setValue('items', currentItems.filter((_, i) => i !== index))
  }

  const calculateSubtotal = () => {
    return watchItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const calculateVat = () => {
    if (!watchIncludeVat) return 0
    return watchItems.reduce((sum, item) => {
      return sum + (item.quantity * item.price * (item.vatRate / 100))
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVat()
  }

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      console.log('Form submitted:', data)
      // Here you would typically send the data to your backend
      // and generate the PDF
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Company Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input {...register('companyDetails.name')} />
                  {errors.companyDetails?.name && (
                    <p className="text-sm text-red-500">{errors.companyDetails.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>VAT Number</Label>
                  <Input {...register('companyDetails.vatNumber')} />
                  {errors.companyDetails?.vatNumber && (
                    <p className="text-sm text-red-500">{errors.companyDetails.vatNumber.message}</p>
                  )}
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Address</Label>
                  <Input {...register('companyDetails.address')} />
                  {errors.companyDetails?.address && (
                    <p className="text-sm text-red-500">{errors.companyDetails.address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Company Number</Label>
                  <Input {...register('companyDetails.companyNumber')} />
                  {errors.companyDetails?.companyNumber && (
                    <p className="text-sm text-red-500">{errors.companyDetails.companyNumber.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register('companyDetails.phone')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Client Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input {...register('clientName')} />
                  {errors.clientName && (
                    <p className="text-sm text-red-500">{errors.clientName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Client Email</Label>
                  <Input type="email" {...register('clientEmail')} />
                  {errors.clientEmail && (
                    <p className="text-sm text-red-500">{errors.clientEmail.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Client VAT Number (B2B)</Label>
                  <Input {...register('clientVatNumber')} />
                  {errors.clientVatNumber && (
                    <p className="text-sm text-red-500">{errors.clientVatNumber.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input {...register('invoiceNumber')} />
                  {errors.invoiceNumber && (
                    <p className="text-sm text-red-500">{errors.invoiceNumber.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input type="date" {...register('issueDate')} />
                  {errors.issueDate && (
                    <p className="text-sm text-red-500">{errors.issueDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Controller
                    name="paymentTerms"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_TERMS.map(term => (
                            <SelectItem key={term.value} value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
              {watchItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-4">
                    <Input
                      placeholder="Description"
                      {...register(`items.${index}.description`)}
                    />
                    {errors.items?.[index]?.description && (
                      <p className="text-sm text-red-500">{errors.items[index]?.description?.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-sm text-red-500">{errors.items[index]?.quantity?.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      {...register(`items.${index}.price`, { valueAsNumber: true })}
                    />
                    {errors.items?.[index]?.price && (
                      <p className="text-sm text-red-500">{errors.items[index]?.price?.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Controller
                      name={`items.${index}.vatRate`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="VAT Rate" />
                          </SelectTrigger>
                          <SelectContent>
                            {VAT_RATES.map(rate => (
                              <SelectItem key={rate.value} value={rate.value.toString()}>
                                {rate.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    £{(item.quantity * item.price).toFixed(2)}
                  </div>
                  <div className="col-span-1">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={watchItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <Label>Bank Details</Label>
                <Input {...register('bankDetails')} />
                {errors.bankDetails && (
                  <p className="text-sm text-red-500">{errors.bankDetails.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="includeVat"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label>Include VAT</Label>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="text-sm text-gray-600">
                    Subtotal: £{calculateSubtotal().toFixed(2)}
                  </div>
                  {watchIncludeVat && (
                    <div className="text-sm text-gray-600">
                      VAT: £{calculateVat().toFixed(2)}
                      </div>
                  )}
                  <div className="text-lg font-semibold">
                    Total: £{calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              {...register('notes')}
              placeholder="Additional notes..."
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button type="submit">Generate Invoice</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewInvoiceDialog