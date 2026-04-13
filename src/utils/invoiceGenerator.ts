export const downloadInvoice = (transaction: any, packageData: any) => {
  if (!transaction) return

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Tolong izinkan popup untuk mengunduh invoice.')
    return
  }

  const formatCurrency = (amount: number, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const htmlString = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${transaction.id}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            color: #374151;
            max-width: 800px;
            margin: 0 auto;
          }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #2563eb; font-size: 28px; }
          .header p { margin: 5px 0 0; color: #6b7280; font-size: 14px; }
          
          .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .info-block h3 { margin: 0 0 10px; font-size: 14px; color: #9ca3af; text-transform: uppercase; }
          .info-block p { margin: 0 0 5px; font-weight: 500; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: #f9fafb; padding: 12px; text-align: left; font-size: 14px; color: #4b5563; border-bottom: 1px solid #e5e7eb; }
          td { padding: 16px 12px; border-bottom: 1px solid #e5e7eb; }
          .item-name { font-weight: bold; color: #111827; }
          .item-desc { font-size: 12px; color: #6b7280; margin-top: 4px; }
          
          .summary { width: 300px; margin-left: auto; }
          . summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .total-row { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #111827; font-size: 18px; font-weight: bold; margin-top: 10px; color: #111827; }
          
          .footer { margin-top: 60px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ONE RUPIAH UMKM</h1>
          <p>Bukti Pembayaran Langganan (Invoice)</p>
        </div>
        
        <div class="info-section">
          <div class="info-block">
            <h3>Diterbitkan Kepada</h3>
            <p>Pelanggan OneRupiah UMKM</p>
            <p style="font-size: 13px; color: #6b7280;">Sistem Pembayaran: ${transaction.paymentGateway || 'N/A'}</p>
          </div>
          <div class="info-block" style="text-align: right;">
            <h3>Detail Invoice</h3>
            <p>No: INV-${transaction.id.substring(0, 8).toUpperCase()}</p>
            <p>Tanggal: ${formatDate(transaction.createdAt)}</p>
            <p>Status: <span style="color: #059669; font-weight: bold;">LUNAS (PAID)</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Deskripsi Paket</th>
              <th>Periode</th>
              <th style="text-align: right;">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-name">${packageData?.name || 'Paket Langganan'}</div>
                <div class="item-desc">Tipe Akses: ${transaction.type}</div>
              </td>
              <td>${transaction.period}</td>
              <td style="text-align: right; font-weight: 500;">${formatCurrency(transaction.amount, transaction.currency)}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary">
          <div class="total-row">
            <span>Total Pembayaran</span>
            <span>${formatCurrency(transaction.amount, transaction.currency)}</span>
          </div>
          <div style="text-align: right; margin-top: 5px; font-size: 13px; color: #6b7280;">
            Metode: ${transaction.paymentMethod || 'Otomatis'}
          </div>
        </div>
        
        <div class="footer">
          <p>Terima kasih telah menggunakan solusi AI dari OneRupiah UMKM.</p>
          <p>Invoice ini adalah bukti pembayaran yang sah dan dibuat secara otomatis oleh sistem.</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `
  
  printWindow.document.write(htmlString)
  printWindow.document.close()
}
