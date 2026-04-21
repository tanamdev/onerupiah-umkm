# Setup SMTP Email — Notifikasi Langganan Picapik

Panduan ini menjelaskan cara mengkonfigurasi SMTP agar Picapik dapat mengirim
email notifikasi otomatis ketika langganan user akan segera berakhir.

---

## Daftar Isi

1. [Cara Kerja Sistem](#1-cara-kerja-sistem)
2. [Pilih Provider SMTP](#2-pilih-provider-smtp)
3. [Konfigurasi Gmail (Rekomendasi)](#3-konfigurasi-gmail-rekomendasi)
4. [Konfigurasi Brevo / SMTP lain](#4-konfigurasi-brevo--smtp-lain)
5. [Isi Environment Variables](#5-isi-environment-variables)
6. [Test Konfigurasi](#6-test-konfigurasi)
7. [Jadwalkan Cron Job](#7-jadwalkan-cron-job)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Cara Kerja Sistem

```
Cron Job (1×/hari)
      │
      ▼
GET /api/cron/subscription-reminder?secret=CRON_SECRET
      │
      ├─ Query langganan berakhir dalam 7 hari → kirim email "7 hari lagi"
      └─ Query langganan berakhir dalam 1 hari → kirim email "besok berakhir"
                          │
                          ▼
              emailService.ts (nodemailer + SMTP)
                          │
                          ▼
                    Inbox user 📧
```

**De-duplikasi:** Sebelum mengirim, sistem mengecek `ActivityLog` apakah reminder
yang sama sudah dikirim dalam 24 jam terakhir. Jika sudah, email dilewati (skipped).

**Plan yang mendapat notifikasi:** `PREMIUM_MONTHLY` dan `PREMIUM_YEARLY` saja.
Plan `FREE` tidak berakhir sehingga tidak mendapat email.

---

## 2. Pilih Provider SMTP

| Provider | Gratis | Batas/hari | Rekomendasi |
|---|---|---|---|
| **Gmail** | ✅ | 500 email | Development & production kecil |
| **Brevo (ex-Sendinblue)** | ✅ | 300 email | Production, lebih stabil |
| **Mailgun** | Berbayar | Tidak terbatas | Production skala besar |
| **SMTP server sendiri** | ✅ | Tidak terbatas | Jika punya server |

---

## 3. Konfigurasi Gmail (Rekomendasi)

Gmail mengharuskan penggunaan **App Password** — bukan password akun biasa —
karena autentikasi dua faktor (2FA) harus aktif terlebih dahulu.

### Langkah-langkah

**a. Aktifkan 2-Factor Authentication**

1. Buka [myaccount.google.com/security](https://myaccount.google.com/security)
2. Di bagian **"How you sign in to Google"**, klik **2-Step Verification**
3. Ikuti langkah aktivasi hingga selesai

**b. Buat App Password**

1. Buka [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   _(halaman ini hanya muncul jika 2FA sudah aktif)_
2. Pada kolom **"App name"**, ketik: `Picapik SMTP`
3. Klik **Create**
4. Salin **16-karakter password** yang muncul (contoh: `abcd efgh ijkl mnop`)
   — hapus spasi saat menyalin

**c. Konfigurasi `.env`**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=emailanda@gmail.com
SMTP_PASS=abcdefghijklmnop        # App Password tanpa spasi
SMTP_FROM_NAME=Picapik
SMTP_FROM_EMAIL=emailanda@gmail.com
```

> **Catatan:** `SMTP_FROM_EMAIL` bisa diisi alamat yang sama dengan `SMTP_USER`
> karena Gmail tidak mengizinkan `From` dari domain lain.

---

## 4. Konfigurasi Brevo / SMTP Lain

Brevo (sebelumnya Sendinblue) menyediakan 300 email/hari gratis tanpa batas
penerima — lebih cocok untuk production.

### Langkah-langkah Brevo

1. Daftar di [brevo.com](https://www.brevo.com)
2. Masuk ke **Settings → SMTP & API**
3. Di tab **SMTP**, catat:
   - **SMTP Server**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **Login**: email akun Brevo Anda
   - **Password**: SMTP key yang tersedia di halaman tersebut

**Konfigurasi `.env`:**

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=emailanda@domain.com     # Email login Brevo
SMTP_PASS=xsmtpsib-xxxxxxxxxxxx    # SMTP key dari Brevo
SMTP_FROM_NAME=Picapik
SMTP_FROM_EMAIL=noreply@picapik.com  # Domain yang sudah diverifikasi di Brevo
```

### Konfigurasi Umum (SMTP lain)

```env
SMTP_HOST=mail.domain.com     # Host SMTP provider
SMTP_PORT=587                 # 587 (STARTTLS) atau 465 (SSL)
SMTP_SECURE=false             # true jika port 465, false jika 587
SMTP_USER=user@domain.com
SMTP_PASS=password
SMTP_FROM_NAME=Picapik
SMTP_FROM_EMAIL=noreply@domain.com
```

---

## 5. Isi Environment Variables

Buka file `.env` di root project, isi bagian SMTP:

```env
# ─── SMTP Email ───────────────────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Picapik
SMTP_FROM_EMAIL=your@gmail.com

# Secret untuk endpoint cron (gunakan string acak yang panjang)
CRON_SECRET=isi-dengan-random-string-minimal-32-karakter
```

**Generate `CRON_SECRET` yang kuat:**

```bash
# Linux / macOS
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Test Konfigurasi

Setelah mengisi `.env`, verifikasi bahwa email benar-benar terkirim sebelum
mengaktifkan cron.

### Via API endpoint (direkomendasikan)

Endpoint ini hanya bisa diakses oleh akun dengan role `ADMIN` atau `SUPER_ADMIN`.

```bash
curl -X POST https://domain.com/api/cron/subscription-reminder/test \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=TOKEN_ADMIN_ANDA" \
  -d '{"email": "test@gmail.com"}'
```

**Response sukses:**
```json
{
  "ok": true,
  "message": "Email test berhasil dikirim ke test@gmail.com"
}
```

**Response gagal (SMTP tidak terkonfigurasi):**
```json
{
  "error": "Koneksi SMTP gagal",
  "detail": "Invalid login: 535-5.7.8 Username and Password not accepted"
}
```

### Via Node.js script (development)

```js
// test-smtp.mjs
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your@gmail.com',
    pass: 'your-app-password',
  },
});

await transporter.verify();
console.log('✅ Koneksi SMTP berhasil');

await transporter.sendMail({
  from: '"Picapik" <your@gmail.com>',
  to: 'target@gmail.com',
  subject: 'Test Email Picapik',
  text: 'Konfigurasi SMTP berhasil!',
});
console.log('✅ Email terkirim');
```

```bash
node test-smtp.mjs
```

---

## 7. Jadwalkan Cron Job

Endpoint cron dipanggil **sekali per hari**, direkomendasikan pagi hari
(contoh: 08.00 WIB = 01.00 UTC).

### Opsi A — cURL dari server/VPS

```bash
# Tambahkan ke crontab (jalankan: crontab -e)
0 1 * * * curl -s -H "Authorization: Bearer CRON_SECRET_ANDA" \
  https://domain.com/api/cron/subscription-reminder >> /var/log/picapik-cron.log 2>&1
```

### Opsi B — Vercel Cron Jobs

Buat file `vercel.json` di root project:

```json
{
  "crons": [
    {
      "path": "/api/cron/subscription-reminder",
      "schedule": "0 1 * * *"
    }
  ]
}
```

> **Perhatian Vercel:** Vercel Cron mengirim header `Authorization: Bearer VERCEL_CRON_SECRET`
> secara otomatis. Pastikan `CRON_SECRET` di Vercel Environment Variables sama persis.

### Opsi C — GitHub Actions

Buat `.github/workflows/subscription-reminder.yml`:

```yaml
name: Subscription Reminder

on:
  schedule:
    - cron: '0 1 * * *'   # 08.00 WIB = 01.00 UTC setiap hari
  workflow_dispatch:        # Bisa dipicu manual dari GitHub Actions tab

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Panggil endpoint reminder
        run: |
          curl -s -f \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            ${{ secrets.APP_URL }}/api/cron/subscription-reminder
```

Tambahkan secrets di repository: **Settings → Secrets → Actions**:
- `CRON_SECRET` — nilai yang sama dengan di `.env`
- `APP_URL` — URL production (contoh: `https://picapik.com`)

### Opsi D — Layanan eksternal (cron-job.org)

1. Daftar di [cron-job.org](https://cron-job.org) (gratis)
2. Buat cron job baru:
   - **URL**: `https://domain.com/api/cron/subscription-reminder?secret=CRON_SECRET_ANDA`
   - **Schedule**: setiap hari jam 01:00 UTC
   - **Method**: GET

---

## 8. Troubleshooting

### Error: "Username and Password not accepted"

**Penyebab:** Menggunakan password akun Gmail biasa, bukan App Password.

**Solusi:**
1. Pastikan 2FA sudah aktif di akun Google
2. Buat App Password baru di [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Salin password tanpa spasi ke `SMTP_PASS`

---

### Error: "Connection timeout" / "ECONNREFUSED"

**Penyebab:** Port 587 diblokir oleh hosting/firewall.

**Solusi:** Coba port 465 dengan `SMTP_SECURE=true`:

```env
SMTP_PORT=465
SMTP_SECURE=true
```

---

### Error: "SMTP tidak lengkap" saat build/start

**Penyebab:** Salah satu dari `SMTP_HOST`, `SMTP_USER`, atau `SMTP_PASS` kosong.

**Solusi:** Cek kembali isi `.env` — tidak boleh ada nilai yang masih berupa
placeholder seperti `your@gmail.com` atau `your-app-password`.

---

### Email masuk ke folder Spam

**Penyebab:** Domain pengirim belum terverifikasi, atau `SMTP_FROM_EMAIL` berbeda
domain dengan SMTP server.

**Solusi:**
- Gunakan `SMTP_FROM_EMAIL` yang sama dengan `SMTP_USER` (untuk Gmail)
- Untuk domain custom, tambahkan SPF/DKIM record di DNS
- Gunakan Brevo/Mailgun yang sudah memiliki reputasi domain baik

---

### Email reminder tidak terkirim meski cron berjalan

Cek response JSON dari endpoint cron:

```json
{
  "ok": true,
  "runAt": "2026-04-17T01:00:00.000Z",
  "results": {
    "reminder7d": { "sent": 0, "skipped": 2, "failed": 0 },
    "reminder1d": { "sent": 0, "skipped": 0, "failed": 0 }
  }
}
```

- **`sent: 0, skipped: 2`** → Email sudah dikirim hari ini (normal, de-duplikasi bekerja)
- **`sent: 0, failed: 1`** → Ada error SMTP, cek log server untuk detail
- **`sent: 0, skipped: 0, failed: 0`** → Tidak ada langganan yang akan berakhir dalam window yang dicek (normal jika tidak ada user premium)
