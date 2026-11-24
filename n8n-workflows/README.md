# n8n Workflows - 3D Studio Lead Automation & Anti-Leak

Direktori ini berisi file konfigurasi workflow ekspor dari **n8n** untuk mendukung proses otomasi pada bisnis **Dimension3D Studio & NEXA 3D Studio**.

---

## File Workflow
* `pmb-lead-automation.json`: Workflow lengkap untuk penerimaan lead brief 3D dari Webhook Landing Page (`/webhook/3d-lead`), pengiriman respon otomatis konfirmasi estimasi harga WhatsApp ke klien, notifikasi kilat ke Studio Director via Telegram, sinkronisasi ke WebFunneling Backend API (`POST /api/leads`), dan automasi *follow-up* voucher 15% setelah 24 jam untuk mengatasi kebocoran corong (*Anti-Leak Automation*).

---

## Catatan Khusus untuk Docker (Sangat Penting):
Jika Anda menjalankan n8n di dalam **Docker container**:
* Untuk memanggil WebFunneling backend di host dari dalam container Docker, gunakan:  
  `http://host.docker.internal:3001/api/leads` (Node 5 di workflow JSON sudah otomatis diset ke URL ini).
* Jangan gunakan `http://localhost:3001` di dalam n8n Docker, karena `localhost` di dalam container menunjuk ke container itu sendiri, bukan ke laptop/host Anda.

---

## Cara Import ke n8n
1. Buka instance **n8n** Anda (bisa via n8n Cloud atau local self-hosted di `http://localhost:5678`).
2. Masuk ke menu **Workflows**.
3. Klik tombol **Add Workflow** / icon titik tiga di pojok kanan atas, lalu pilih **Import from File**.
4. Pilih file `pmb-lead-automation.json`.
5. Sesuaikan credentials node:
   * **Webhook URL**: Gunakan path `3d-lead`. Salin URL webhook n8n (`http://localhost:5678/webhook/3d-lead`) ke form kalkulator di 3DWebsite jika ingin memicu alur n8n.
   * **WhatsApp / Telegram Credential**: Masukkan bot token & chat ID untuk pengiriman pesan.
6. Klik **Activate** di pojok kanan atas n8n.
