import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  vatNumber: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().default("United Kingdom")
  }),
  notes: z.string().optional()
})

type CustomerFormData = z.infer<typeof customerSchema>

interface CustomerFormDialogProps {
  customer?: CustomerFormData & { _id?: string }
  onSubmit: (data: CustomerFormData) => void
  trigger?: React.ReactNode
}

export function CustomerFormDialog({ customer, onSubmit, trigger }: CustomerFormDialogProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      name: "",
      email: "",
      vatNumber: "",
      phone: "",
      address: {
        street: "",
        city: "",
        postcode: "",
        country: "United Kingdom"
      },
      notes: ""
    }
  })

  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input {...register("email")} type="email" />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>VAT Number</Label>
                  <Input {...register("vatNumber")} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register("phone")} />
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
                  <Input {...register("address.street")} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input {...register("address.city")} />
                </div>
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input {...register("address.postcode")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input {...register("notes")} />
          </div>

          <div className="flex justify-end space-x-2">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button type="submit">
              {customer ? "Update Customer" : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}