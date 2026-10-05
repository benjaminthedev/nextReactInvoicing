import { useState } from 'react'
import { readLogoFile } from '@/lib/logo'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function LogoUpload({
  id,
  logo,
  onChange,
}: {
  id: string
  logo?: string
  onChange: (logo: string) => void
}) {
  const [error, setError] = useState('')

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError('')
    try {
      onChange(await readLogoFile(file))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not read that image.')
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Logo</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded border bg-gray-50">
          {logo ? (
            <img src={logo} alt="Company logo" className="max-h-14 max-w-24 object-contain" />
          ) : (
            <span className="text-xs text-gray-400">No logo</span>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input
            id={id}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="text-sm"
            onChange={(event) => {
              void onFile(event.target.files?.[0])
              event.target.value = ''
            }}
          />
          {logo && (
            <Button type="button" variant="outline" size="sm" onClick={() => onChange('')}>
              Remove logo
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500">Shown at the top of the invoice PDF. PNG or JPEG.</p>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
