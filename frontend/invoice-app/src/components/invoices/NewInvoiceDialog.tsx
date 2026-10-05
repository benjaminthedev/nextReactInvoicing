import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { formatGBP, invoiceSubtotal, invoiceTotal, invoiceVat, nextInvoiceNumber } from '@/lib/invoice'
import { InvoicePreviewDialog } from './InvoicePreviewDialog'
import { LogoUpload } from './LogoUpload'
import {
  invoiceSchema,
  PAYMENT_TERMS,
  VAT_RATES,
  type InvoiceFormData,
} from './types'

const defaultValues: InvoiceFormData = {
  companyDetails: {
    name: '',
    address: '',
    vatNumber: '',
    companyNumber: '',
    phone: '',
    email: '',
    logo: '',
  },
  customerId: '',
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
  bankDetails: '',
}

function dueDateFor(issueDate: string, terms: string) {
  if (!issueDate) return ''
  const date = new Date(issueDate)
  const days = {
    due_on_receipt: 0,
    net_7: 7,
    net_14: 14,
    net_30: 30,
    net_60: 60,
  }[terms] ?? 30
  return format(addDays(date, days), 'yyyy-MM-dd')
}

export function NewInvoiceDialog() {
  const { company, customers, invoices, addInvoice, saveCompany } = useAppStore()
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<InvoiceFormData | null>(null)
  const wasOpen = useRef(false)

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  })

  const { register, control, watch, setValue, formState: { errors } } = form
  const watchIssueDate = watch('issueDate')
  const watchPaymentTerms = watch('paymentTerms')
  const watchItems = watch('items')
  const watchIncludeVat = watch('includeVat')
  const watchCustomerId = watch('customerId')

  useEffect(() => {
    if (open && !wasOpen.current) {
      const issueDate = format(new Date(), 'yyyy-MM-dd')
      form.reset({
        ...defaultValues,
        companyDetails: { ...company.companyDetails },
        bankDetails: company.bankDetails,
        invoiceNumber: nextInvoiceNumber(invoices),
        issueDate,
        paymentTerms: 'net_30',
        dueDate: dueDateFor(issueDate, 'net_30'),
      })
    }
    wasOpen.current = open
  }, [open, company, invoices, form])

  useEffect(() => {
    if (watchIssueDate && watchPaymentTerms) {
      setValue('dueDate', dueDateFor(watchIssueDate, watchPaymentTerms))
    }
  }, [watchIssueDate, watchPaymentTerms, setValue])

  const applyCustomer = (customerId: string) => {
    setValue('customerId', customerId)
    const customer = customers.find((item) => item.id === customerId)
    if (!customer) return
    setValue('clientName', customer.name, { shouldValidate: true })
    setValue('clientEmail', customer.email, { shouldValidate: true })
    setValue('clientVatNumber', customer.vatNumber ?? '')
  }

  const addItem = () => {
    setValue('items', [
      ...watch('items'),
      { description: '', quantity: 1, price: 0, vatRate: 20 },
    ])
  }

  const removeItem = (index: number) => {
    setValue('items', watch('items').filter((_, itemIndex) => itemIndex !== index))
  }

  const onSubmit = (data: InvoiceFormData) => {
    addInvoice(data)
    setPreview(null)
    setOpen(false)
  }

  const onPreview = form.handleSubmit((data) => setPreview(data))

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
                <p className="text-sm text-gray-500 mb-4">
                  Taken from Settings. Change them there to update the next invoice.
                </p>
                <div className="mb-6">
                  <LogoUpload
                    id="invoice-logo"
                    logo={watch('companyDetails.logo')}
                    onChange={(value) => {
                      setValue('companyDetails.logo', value)
                      saveCompany({
                        ...company,
                        companyDetails: { ...company.companyDetails, logo: value },
                      })
                    }}
                  />
                </div>
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
                  <div className="space-y-2 col-span-2">
                    <Label>Saved customer</Label>
                    {customers.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No saved customers yet. Type the client below, or add one on the Customers page.
                      </p>
                    ) : (
                      <Select
                        value={watchCustomerId || undefined}
                        onValueChange={applyCustomer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label>Due Date</Label>
                    <Input type="date" readOnly {...register('dueDate')} />
                    {errors.dueDate && (
                      <p className="text-sm text-red-500">{errors.dueDate.message}</p>
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
                            {PAYMENT_TERMS.map((term) => (
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
                        step="0.01"
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
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={String(field.value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="VAT Rate" />
                            </SelectTrigger>
                            <SelectContent>
                              {VAT_RATES.map((rate) => (
                                <SelectItem key={rate.value} value={String(rate.value)}>
                                  {rate.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-1 text-sm pt-2">
                      {formatGBP((Number(item.quantity) || 0) * (Number(item.price) || 0))}
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
                <Button type="button" variant="outline" onClick={addItem} className="mt-2">
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
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="includeVat"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label>Include VAT</Label>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-gray-600">
                      Subtotal: {formatGBP(invoiceSubtotal({ items: watchItems }))}
                    </div>
                    {watchIncludeVat && (
                      <div className="text-sm text-gray-600">
                        VAT: {formatGBP(invoiceVat({ items: watchItems, includeVat: true }))}
                      </div>
                    )}
                    <div className="text-lg font-semibold">
                      Total: {formatGBP(invoiceTotal({ items: watchItems, includeVat: watchIncludeVat }))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register('notes')} placeholder="Additional notes..." />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={onPreview}>
                Preview
              </Button>
              <Button type="submit">Save invoice</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <InvoicePreviewDialog
        data={preview}
        open={preview !== null}
        onOpenChange={(next) => {
          if (!next) setPreview(null)
        }}
      />
    </>
  )
}

export default NewInvoiceDialog
