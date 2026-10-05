import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { customerSchema, emptyCustomer, type Customer, type CustomerFormData } from './types'

interface CustomerFormDialogProps {
  customer?: Customer
  onSubmit: (data: CustomerFormData) => void
  trigger: ReactNode
}

export function CustomerFormDialog({ customer, onSubmit, trigger }: CustomerFormDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer ?? emptyCustomer,
  })

  const { register, handleSubmit, reset, formState: { errors } } = form

  const submit = (data: CustomerFormData) => {
    onSubmit(data)
    setOpen(false)
    if (!customer) reset(emptyCustomer)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) reset(customer ?? emptyCustomer)
      }}
    >
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...register('name')} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input {...register('email')} type="email" />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>VAT Number</Label>
                  <Input {...register('vatNumber')} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register('phone')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Street</Label>
                  <Input {...register('address.street')} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input {...register('address.city')} />
                </div>
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input {...register('address.postcode')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input {...register('notes')} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {customer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
