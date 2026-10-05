import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

const points = [
  {
    title: 'VAT already worked out',
    body: 'Standard 20%, reduced 5%, or zero. The subtotal, VAT, and total update as you type.',
  },
  {
    title: 'A PDF you can send',
    body: 'Preview the invoice before you save it, then download a copy from the list.',
  },
  {
    title: 'Customers, once',
    body: 'Save a customer and your company details. The next invoice starts filled in.',
  },
]

function EmailForm({ id }: { id: string }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      const data = await response.json().catch(() => ({})) as { error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Could not save that address.')
      }
      setStatus('done')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Could not save that address.')
    }
  }

  if (status === 'done') {
    return (
      <p className="text-base text-[#1f6b4a]" role="status">
        Saved. You are on the list.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor={id} className="block text-sm font-medium text-[#3d3832]">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.co.uk"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-md border border-[#cfc6b8] bg-white px-3 text-[#1c1915] outline-none focus:border-[#1c1915]"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-12 shrink-0 rounded-md bg-[#1c1915] px-5 text-sm font-medium text-[#f3efe6] disabled:opacity-60"
        >
          {status === 'sending' ? 'Saving…' : 'Keep me posted'}
        </button>
      </div>
      <label className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          name="website"
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>
      {status === 'error' && (
        <p className="text-sm text-red-700" role="alert">{message}</p>
      )}
      <p className="text-sm text-[#6b645c]">
        Notes about the app, nothing else. The invoice maker stays free either way.
      </p>
    </form>
  )
}

function ExampleInvoice() {
  return (
    <figure className="mx-auto w-full max-w-lg">
      <figcaption className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-[#6b645c]">
        Example invoice
      </figcaption>
      <div className="rounded-sm bg-white p-6 shadow-[0_20px_50px_rgba(28,25,21,0.08)] sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#ece7df] pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#1c1915] font-serif text-xl text-[#f3efe6]">
            N
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl">Invoice</p>
            <p className="mt-1 text-sm text-[#6b645c]">INV-014</p>
            <p className="text-sm text-[#6b645c]">Issued 1 Oct 2026</p>
            <p className="text-sm text-[#6b645c]">Due 31 Oct 2026</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#6b645c]">From</p>
            <p className="font-medium">Northwind Ltd</p>
            <p className="text-[#6b645c]">1 High Street, London</p>
            <p className="text-[#6b645c]">VAT GB123456789</p>
          </div>
          <div>
            <p className="text-[#6b645c]">Bill to</p>
            <p className="font-medium">Acme Corp</p>
            <p className="text-[#6b645c]">billing@acme.test</p>
            <p className="text-[#6b645c]">2 Market Road, Manchester</p>
          </div>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-b border-[#ece7df] text-[#6b645c]">
            <tr>
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#f3efe6]">
              <td className="py-2">Consulting</td>
              <td className="py-2 text-right">2</td>
              <td className="py-2 text-right">£150.00</td>
              <td className="py-2 text-right">£300.00</td>
            </tr>
            <tr className="border-b border-[#f3efe6]">
              <td className="py-2">Design review</td>
              <td className="py-2 text-right">1</td>
              <td className="py-2 text-right">£80.00</td>
              <td className="py-2 text-right">£80.00</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 space-y-1 text-right text-sm">
          <p className="text-[#6b645c]">Subtotal £380.00</p>
          <p className="text-[#6b645c]">VAT 20% £76.00</p>
          <p className="font-serif text-2xl">£456.00</p>
        </div>

        <div className="mt-6 border-t border-[#ece7df] pt-4 text-sm">
          <p className="font-medium">Payment</p>
          <p className="text-[#6b645c]">Net 30 · 12-34-56 · 12345678</p>
        </div>
      </div>
    </figure>
  )
}

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-[#f3efe6] text-[#1c1915]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <p className="text-sm font-semibold tracking-wide">Easy Invoice Maker</p>
        <Link
          to="/dashboard"
          className="rounded-md border border-[#1c1915] px-4 py-2 text-sm font-medium"
        >
          Use it free
        </Link>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-10">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#1f6b4a]">
              Free to use
            </p>
            <h1 className="max-w-xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Invoices, written properly.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#3d3832]">
              A straightforward invoice maker for UK businesses. Add the lines, keep the VAT honest, and download a PDF. No subscription.
            </p>
            <div className="mt-8 max-w-lg">
              <EmailForm id="hero-email" />
            </div>
          </div>

          <ExampleInvoice />
        </section>

        <section className="border-y border-[#e4dcd0] bg-[#ebe6dc]">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-3">
            {points.map((point) => (
              <div key={point.title}>
                <h2 className="font-serif text-2xl">{point.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#3d3832]">{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-4xl">Three steps, then the PDF.</h2>
            <ol className="mt-6 space-y-4 text-[#3d3832]">
              <li><span className="font-medium text-[#1c1915]">1. Company.</span> Name, logo, address, VAT number, and bank details, saved once.</li>
              <li><span className="font-medium text-[#1c1915]">2. The job.</span> Pick a customer, add the lines, and choose the payment terms.</li>
              <li><span className="font-medium text-[#1c1915]">3. Send it.</span> Preview the page, save the invoice, download the PDF.</li>
            </ol>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex h-12 items-center rounded-md bg-[#1c1915] px-5 text-sm font-medium text-[#f3efe6]"
            >
              Open the app
            </Link>
          </div>
          <div className="rounded-sm border border-[#e4dcd0] bg-white p-8">
            <h2 className="font-serif text-3xl">Want a note when it changes?</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3d3832]">
              Leave an address. The app does not need one.
            </p>
            <div className="mt-6">
              <EmailForm id="footer-email" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
