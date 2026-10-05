import { BlobProvider, PDFViewer } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { buttonVariants } from '@/components/ui/button'
import { InvoicePDF } from './InvoicePDF'
import type { InvoiceFormData } from './types'

export function InvoicePdfDownload({
  data,
  label = 'Download',
}: {
  data: InvoiceFormData
  label?: string
}) {
  const fileName = `${data.invoiceNumber || 'invoice'}.pdf`

  return (
    <BlobProvider document={<InvoicePDF data={data} />}>
      {({ url, loading }) => (
        <a
          href={url ?? undefined}
          download={fileName}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
          onClick={(event) => {
            if (!url) event.preventDefault()
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            {loading || !url ? 'Preparing…' : label}
          </span>
        </a>
      )}
    </BlobProvider>
  )
}

export function InvoicePreviewDialog({
  data,
  open,
  onOpenChange,
}: {
  data: InvoiceFormData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {data ? `Preview ${data.invoiceNumber}` : 'Invoice preview'}
          </DialogTitle>
        </DialogHeader>
        {data && (
          <div className="space-y-4">
            <div className="h-[70vh] overflow-hidden rounded border">
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                <InvoicePDF data={data} />
              </PDFViewer>
            </div>
            <div className="flex justify-end">
              <InvoicePdfDownload data={data} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
