// src/components/invoices/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { InvoiceFormData } from './types'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
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
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  }
})

export const InvoicePDF = ({ data }: { data: InvoiceFormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text>Invoice Number: {data.invoiceNumber}</Text>
        <Text>Date: {data.issueDate}</Text>
        <Text>Due Date: {data.dueDate}</Text>
      </View>

      <View style={styles.companyDetails}>
        <Text style={styles.bold}>{data.companyDetails.name}</Text>
        <Text>{data.companyDetails.address}</Text>
        <Text>VAT: {data.companyDetails.vatNumber}</Text>
        <Text>Company No: {data.companyDetails.companyNumber}</Text>
      </View>

      <View style={styles.clientDetails}>
        <Text style={styles.bold}>Bill To:</Text>
        <Text>{data.clientName}</Text>
        {data.clientVatNumber && <Text>VAT: {data.clientVatNumber}</Text>}
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
            <Text style={{ flex: 1 }}>£{item.price.toFixed(2)}</Text>
            <Text style={{ flex: 1 }}>{item.vatRate}%</Text>
            <Text style={{ flex: 1 }}>£{(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <Text>Subtotal: £{data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</Text>
        {data.includeVat && (
          <Text>VAT: £{data.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.vatRate / 100)), 0).toFixed(2)}</Text>
        )}
        <Text style={styles.bold}>Total: £{data.items.reduce((sum, item) => {
          const itemTotal = item.quantity * item.price
          const vat = data.includeVat ? itemTotal * (item.vatRate / 100) : 0
          return sum + itemTotal + vat
        }, 0).toFixed(2)}</Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={styles.bold}>Payment Details:</Text>
        <Text>{data.bankDetails}</Text>
        <Text>Payment Terms: {data.paymentTerms}</Text>
      </View>
    </Page>
  </Document>
)