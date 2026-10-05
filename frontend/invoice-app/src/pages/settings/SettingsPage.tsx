import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { companyProfileSchema, type CompanyProfile } from '@/components/invoices/types'
import { LogoUpload } from '@/components/invoices/LogoUpload'
import { useAppStore } from '@/lib/store'

export default function SettingsPage() {
  const { company, saveCompany } = useAppStore()
  const [saved, setSaved] = useState(false)
  const form = useForm<CompanyProfile>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: company,
  })

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form
  const logo = watch('companyDetails.logo')

  const onSubmit = (data: CompanyProfile) => {
    saveCompany(data)
    setSaved(true)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 mt-2">
          These details are filled in on every new invoice.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Company</h2>
            <div className="mb-6">
              <LogoUpload
                id="settings-logo"
                logo={logo}
                onChange={(value) => {
                  setValue('companyDetails.logo', value, { shouldDirty: true })
                  setSaved(false)
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
                <Input {...register('companyDetails.vatNumber')} placeholder="GB123456789" />
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
              <div className="space-y-2 col-span-2">
                <Label>Email</Label>
                <Input type="email" {...register('companyDetails.email')} />
                {errors.companyDetails?.email && (
                  <p className="text-sm text-red-500">{errors.companyDetails.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-2">
            <h2 className="text-lg font-semibold mb-4">Bank details</h2>
            <Label>Account details shown on the invoice</Label>
            <Input {...register('bankDetails')} placeholder="Sort code and account number" />
            {errors.bankDetails && (
              <p className="text-sm text-red-500">{errors.bankDetails.message}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && <p className="text-sm text-green-700">Saved</p>}
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  )
}
