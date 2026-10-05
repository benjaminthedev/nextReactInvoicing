import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { paymentTermLabel, type InvoiceFormData } from './types'
import { invoiceSubtotal, invoiceTotal, invoiceVat } from '@/lib/invoice'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 88,
    height: 48,
    objectFit: 'contain',
  },
  headerMeta: {
    alignItems: 'flex-end',
  },
  companyDetails: {
    marginBottom: 30,
  },
  clientDetails: {
    marginBottom: 30,
  },
  items: {
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 5,
  },
  totals: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
})

const money = (amount: number) => `£${amount.toFixed(2)}`

export const InvoicePDF = ({ data }: { data: InvoiceFormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          {data.companyDetails.logo ? (
            <Image src={data.companyDetails.logo} style={styles.logo} />
          ) : null}
        </View>
        <View style={styles.headerMeta}>
          <Text style={styles.title}>INVOICE</Text>
          <Text>Invoice Number: {data.invoiceNumber}</Text>
          <Text>Date: {data.issueDate}</Text>
          <Text>Due Date: {data.dueDate}</Text>
        </View>
      </View>

      <View style={styles.companyDetails}>
        <Text style={styles.bold}>{data.companyDetails.name}</Text>
        <Text>{data.companyDetails.address}</Text>
        <Text>VAT: {data.companyDetails.vatNumber}</Text>
        <Text>Company No: {data.companyDetails.companyNumber}</Text>
        {data.companyDetails.email ? <Text>{data.companyDetails.email}</Text> : null}
      </View>

      <View style={styles.clientDetails}>
        <Text style={styles.bold}>Bill To:</Text>
        <Text>{data.clientName}</Text>
        <Text>{data.clientEmail}</Text>
        {data.clientVatNumber ? <Text>VAT: {data.clientVatNumber}</Text> : null}
      </View>

      <View style={styles.items}>
        <View style={[styles.item, styles.bold]}>
          <Text style={{ flex: 4 }}>Description</Text>
          <Text style={{ flex: 1 }}>Qty</Text>
          <Text style={{ flex: 1 }}>Price</Text>
          <Text style={{ flex: 1 }}>VAT</Text>
          <Text style={{ flex: 1 }}>Total</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={{ flex: 4 }}>{item.description}</Text>
            <Text style={{ flex: 1 }}>{item.quantity}</Text>
            <Text style={{ flex: 1 }}>{money(item.price || 0)}</Text>
            <Text style={{ flex: 1 }}>{data.includeVat ? `${item.vatRate}%` : '—'}</Text>
            <Text style={{ flex: 1 }}>{money((item.quantity || 0) * (item.price || 0))}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <Text>Subtotal: {money(invoiceSubtotal(data))}</Text>
        {data.includeVat && <Text>VAT: {money(invoiceVat(data))}</Text>}
        <Text style={styles.bold}>Total: {money(invoiceTotal(data))}</Text>
      </View>

      {data.notes ? (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.bold}>Notes</Text>
          <Text>{data.notes}</Text>
        </View>
      ) : null}

      <View style={{ marginTop: 40 }}>
        <Text style={styles.bold}>Payment Details</Text>
        <Text>{data.bankDetails}</Text>
        <Text>Payment Terms: {paymentTermLabel(data.paymentTerms)}</Text>
      </View>
    </Page>
  </Document>
)
