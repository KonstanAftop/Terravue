import { Transaction } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'

/**
 * Mock Email Service - Logs emails to console instead of sending
 * In production, this would integrate with SendGrid, AWS SES, or similar
 */
class MockEmailService {
  /**
   * Send transaction confirmation email
   */
  async sendTransactionConfirmation(transaction: Transaction): Promise<void> {
    const buyer = inMemoryStore.getUser(transaction.buyerId)
    const seller = inMemoryStore.getUser(transaction.sellerId)
    const credit = inMemoryStore.getCredit(transaction.carbonCreditId)

    const emailContent = `
=== EMAIL NOTIFICATION ===
To: ${buyer?.email || 'buyer@example.com'}
Subject: Konfirmasi Transaksi - ${transaction.id}

Yth. ${buyer?.fullName},

Terima kasih telah membeli kredit karbon melalui TerraVue!

Detail Transaksi:
- ID Transaksi: ${transaction.id}
- Jumlah Kredit: ${transaction.quantity} kredit
- Harga per Kredit: IDR ${transaction.pricePerCredit.toLocaleString('id-ID')}
- Total Pembayaran: IDR ${transaction.totalAmount.toLocaleString('id-ID')}
- Status: ${this.translateStatus(transaction.status)}
- Tanggal: ${transaction.createdAt.toLocaleString('id-ID')}

${transaction.paymentDetails ? `
Detail Pembayaran:
- Metode: ${this.translatePaymentMethod(transaction.paymentDetails.method)}
- Provider: ${transaction.paymentDetails.provider}
- ID Pembayaran: ${transaction.paymentDetails.transactionId}
- Biaya Platform: IDR ${transaction.paymentDetails.fees.platformFee.toLocaleString('id-ID')}
- Biaya Pembayaran: IDR ${transaction.paymentDetails.fees.paymentFee.toLocaleString('id-ID')}
- Pajak (PPN 11%): IDR ${transaction.paymentDetails.fees.tax.toLocaleString('id-ID')}
` : ''}

Kredit karbon Anda akan ditransfer ke portofolio dalam 24 jam.

Terima kasih telah mendukung konservasi hutan berkelanjutan di Indonesia!

Salam,
Tim TerraVue

========================
    `

    console.log(emailContent)

    // Also notify seller
    const sellerEmail = `
=== EMAIL NOTIFICATION ===
To: ${seller?.email || 'seller@example.com'}
Subject: Penjualan Kredit Karbon - ${transaction.id}

Yth. ${seller?.fullName},

Kredit karbon Anda telah terjual!

Detail Penjualan:
- ID Transaksi: ${transaction.id}
- Jumlah Kredit: ${transaction.quantity} kredit
- Harga per Kredit: IDR ${transaction.pricePerCredit.toLocaleString('id-ID')}
- Total Penerimaan: IDR ${(transaction.totalAmount * 0.95).toLocaleString('id-ID')} (setelah biaya platform)
- Pembeli: ${buyer?.fullName}
- Tanggal: ${transaction.createdAt.toLocaleString('id-ID')}

Dana akan ditransfer ke rekening Anda dalam 3-5 hari kerja.

Salam,
Tim TerraVue

========================
    `

    console.log(sellerEmail)
  }

  /**
   * Send status update email
   */
  async sendStatusUpdate(transaction: Transaction): Promise<void> {
    const buyer = inMemoryStore.getUser(transaction.buyerId)

    const emailContent = `
=== EMAIL NOTIFICATION ===
To: ${buyer?.email || 'buyer@example.com'}
Subject: Update Status Transaksi - ${transaction.id}

Yth. ${buyer?.fullName},

Status transaksi Anda telah diperbarui:

- ID Transaksi: ${transaction.id}
- Status Baru: ${this.translateStatus(transaction.status)}
- Waktu Update: ${new Date().toLocaleString('id-ID')}

${this.getStatusMessage(transaction.status)}

Salam,
Tim TerraVue

========================
    `

    console.log(emailContent)
  }

  /**
   * Send receipt email
   */
  async sendReceipt(transaction: Transaction): Promise<void> {
    const buyer = inMemoryStore.getUser(transaction.buyerId)
    const credit = inMemoryStore.getCredit(transaction.carbonCreditId)
    const land = credit ? inMemoryStore.getLand(credit.landParcelId) : null

    const emailContent = `
=== EMAIL NOTIFICATION ===
To: ${buyer?.email || 'buyer@example.com'}
Subject: Bukti Transaksi - ${transaction.id}

Yth. ${buyer?.fullName},

Berikut adalah bukti transaksi Anda:

===================================
         BUKTI PEMBAYARAN
         TerraVue Platform
===================================

ID Transaksi: ${transaction.id}
Tanggal: ${transaction.createdAt.toLocaleString('id-ID')}

PEMBELI:
${buyer?.fullName}
${buyer?.email}

DETAIL KREDIT KARBON:
- Nama Lahan: ${land?.name || 'N/A'}
- Jenis Lahan: ${land?.landType || 'N/A'}
- Jumlah Kredit: ${transaction.quantity} ton CO2e
- Harga per Kredit: IDR ${transaction.pricePerCredit.toLocaleString('id-ID')}

RINCIAN BIAYA:
- Subtotal: IDR ${(transaction.quantity * transaction.pricePerCredit).toLocaleString('id-ID')}
${transaction.paymentDetails ? `- Biaya Platform: IDR ${transaction.paymentDetails.fees.platformFee.toLocaleString('id-ID')}
- Biaya Pembayaran: IDR ${transaction.paymentDetails.fees.paymentFee.toLocaleString('id-ID')}
- Pajak (PPN 11%): IDR ${transaction.paymentDetails.fees.tax.toLocaleString('id-ID')}` : ''}
-----------------------------------
TOTAL: IDR ${transaction.totalAmount.toLocaleString('id-ID')}

Metode Pembayaran: ${transaction.paymentDetails ? this.translatePaymentMethod(transaction.paymentDetails.method) : 'N/A'}
Status: ${this.translateStatus(transaction.status)}

===================================

Dokumen ini adalah bukti pembayaran yang sah.

Terima kasih!
Tim TerraVue

========================
    `

    console.log(emailContent)
  }

  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      initiated: 'Diinisiasi',
      payment_pending: 'Menunggu Pembayaran',
      payment_processing: 'Memproses Pembayaran',
      payment_confirmed: 'Pembayaran Dikonfirmasi',
      completed: 'Selesai',
      failed: 'Gagal',
      refunded: 'Dikembalikan',
    }
    return translations[status] || status
  }

  private translatePaymentMethod(method: string): string {
    const translations: Record<string, string> = {
      bank_transfer: 'Transfer Bank',
      ewallet: 'E-Wallet',
      credit_card: 'Kartu Kredit',
    }
    return translations[method] || method
  }

  private getStatusMessage(status: string): string {
    const messages: Record<string, string> = {
      initiated: 'Transaksi Anda telah diinisiasi. Silakan lanjutkan dengan pembayaran.',
      payment_pending: 'Menunggu konfirmasi pembayaran Anda.',
      payment_processing: 'Pembayaran Anda sedang diproses.',
      payment_confirmed: 'Pembayaran berhasil dikonfirmasi!',
      completed: 'Transaksi selesai. Kredit karbon telah ditransfer ke portofolio Anda.',
      failed: 'Transaksi gagal. Silakan hubungi customer service jika ada pertanyaan.',
      refunded: 'Dana Anda telah dikembalikan.',
    }
    return messages[status] || 'Status transaksi telah diperbarui.'
  }
}

export const mockEmailService = new MockEmailService()


