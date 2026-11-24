# Dokumentasi Alur Integrasi Webhook, API & Automasi n8n

## Tahap 4: Back-End Engine, Webhook & Automasi n8n

Dokumentasi ini merinci integrasi antara antarmuka [3DWebsite (NEXA Studio)](../3DWebsite), API backend [WebFunneling](../WebFunneling/backend), dan engine otomasi **n8n** secara *real-time*.

---

### Arsitektur Alur Data (End-to-End Flow)

```text
[Calon Klien via Iklan Instagram / Google Ads]
                     │
                     ▼ (?utm_source=Instagram_Ads)
      [Landing Page 3D Website (Port 3000)]
   - WebGL Three.js Hero Viewport
   - 3D Pricing Configurator
                     │
                     ├── POST /api/analytics/track ──▶ [WebFunneling Express Backend]
                     │   (Pageview & Calc Interaction)         │
                     │                                         ▼
                     ├── POST /api/leads (atau Webhook n8n) ───┤
                     │                                         ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                          n8n AUTOMATION ENGINE                                │
│                                                                               │
│  1. Webhook Node (POST /webhook/3d-lead):                                     │
│     Menerima payload JSON: client, configuration, tracking, total_estimate    │
│                                                                               │
│  2. Instant Auto-Response Node (WhatsApp Klien):                              │
│     Kirim rincian penawaran & jadwal technical meeting ke calon klien         │
│                                                                               │
│  3. Internal Alert Node (Telegram Studio Director):                           │
│     "🚨 Lead Proyek 3D Baru Masuk via Instagram Ads!                          │
│      Klien: Budi Santoso | Layanan: 3D Product Animation | Rp 5.200.000"       │
│                                                                               │
│  4. Data Sync Node:                                                           │
│     POST ke WebFunneling Backend API (POST /api/leads)                        │
│     -> Dashboard Alex Pratama otomatis bertambah & ter-update                 │
│                                                                               │
│  5. Anti-Leak Automation (Follow-up Diskon):                                  │
│     - Node Wait (24 Jam)                                                      │
│     - IF status masih "Request Brief" dan belum "Deal Project (DP 50%)"        │
│     - Kirim WA penawaran voucher first-order 15% secara personal otomatis     │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Spesifikasi Payload Webhook & API Leads

Ketika calon klien menekan tombol **"Kunci Harga & Konsultasi"** pada 3DWebsite:
* **HTTP Method:** `POST`
* **Endpoint:** `http://localhost:3001/api/leads` (atau `http://localhost:5678/webhook/3d-lead`)
* **Headers:** `Content-Type: application/json`
* **Contoh Payload:**
```json
{
  "event": "3D_LEAD_PRICE_LOCKED",
  "lead_id": "NEXA-ABC123",
  "client": {
    "name": "Budi Santoso",
    "whatsapp_full": "+6281234567890",
    "notes": "Botol skincare bercahaya minimalis"
  },
  "tracking": {
    "utm_source": "Instagram Ads (Reels Portfolio)",
    "utm_medium": "paid_social",
    "utm_campaign": "q4_launch"
  },
  "configuration": {
    "service_name": "3D Product Commercial & Animation",
    "visual_style_name": "Photorealistic High-End",
    "duration_value": 15,
    "duration_unit": "Detik",
    "addons": [{ "name": "Source File Blender (.blend)", "price": 500000 }],
    "total_estimate_raw": 5200000,
    "total_estimate_formatted": "Rp 5.200.000"
  }
}
```

---

### 2. Telemetri Kunjungan & Interaksi Kalkulator (Funnel Stage 2 & 3)

* **Pageview Event:**
  - `POST http://localhost:3001/api/analytics/track`
  - Payload: `{ "event": "pageview", "utm_source": "Instagram_Ads" }`
  - Efek: Menambah angka counter **Tahap 2 (Pengunjung Web 3D)**.
* **Calculator Interaction Event:**
  - `POST http://localhost:3001/api/analytics/track`
  - Payload: `{ "event": "calculator_interaction", "utm_source": "Instagram_Ads" }`
  - Efek: Menambah angka counter **Tahap 3 (Interaksi Kalkulator Harga)**.
