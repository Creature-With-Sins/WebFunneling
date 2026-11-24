# Dokumentasi Desain Interaksi Pengguna (DIP) - Wireframe & Alur Interaksi

## Tahap 3: Front-End Interaction Architecture

Dokumen ini menjelaskan rancangan tata letak (*wireframe layout*), hierarki visual, dan alur interaksi pengguna untuk dua sisi antarmuka:
1. **Sisi Calon Klien (Landing Page NEXA 3D Studio)**
2. **Sisi Studio Director / Alex (Dashboard Funnel Analytics Dimension3D - Core DIP)**

---

### A. Sisi Calon Klien — Landing Page NEXA 3D Studio
Landing page dirancang dengan estetika studio kreatif gelap (*dark/sleek*) dan Three.js WebGL viewport untuk menangkap calon klien dari iklan Instagram Reels dan Google Ads.

#### 1. Wireframe Layout
```text
+--------------------------------------------------------------+
| [Logo NEXA 3D]    [Nav: Layanan | Kalkulator | Portfolio]    |
+--------------------------------------------------------------+
|                                                              |
|   HERO SECTION                                               |
|   "Visualisasi 3D Sinematik & Animasi Produk Berkualitas"    |
|   [Badge: ?utm_source=Instagram_Ads Promo Active]            |
|                                                              |
|   +-----------------------+      +-------------------------+ |
|   | 3D WEBGL VIEWPORT     |      | 3D PRICING CONFIGURATOR | |
|   | (Three.js Interactive |      | 1. Pilih Layanan 3D     | |
|   |  Rotatable Model)     |      | 2. Style Visual         | |
|   |                       |      | 3. Slider Durasi/Skala  | |
|   |                       |      | 4. Checkbox Add-on      | |
|   |                       |      | Total: Rp 5.200.000     | |
|   |                       |      | [FORM: KUNCI HARGA]     | |
|   +-----------------------+      +-------------------------+ |
|                                                              |
+--------------------------------------------------------------+
| [Success Modal + Deep-link WhatsApp + Webhook Dispatcher]    |
+--------------------------------------------------------------+
```

#### 2. Elemen Interaksi:
* **Interactive 3D WebGL Viewport:** Calon klien dapat merotasi dan memperbesar model produk 3D Three.js.
* **Pricing Configurator Engine:** Pilihan kartu layanan, toggle gaya visual photorealistic vs stylized, slider durasi animasi (5-30 detik), dan add-on render. Angka total harga ter-update secara real-time dengan animasi counter.
* **Instant Submission Feedback (Modal Sukses):** Menyajikan rincian konfigurasi, status webhook (200 OK / direct API), tombol salin penawaran, dan tautan langsung ke WhatsApp Studio.

---

### B. Sisi Studio Director (Alex) — Dashboard Funnel Analytics (Core DIP)

Dashboard dirancang untuk memberikan visibilitas kebocoran konversi iklan (*Drop-off Leak Detection*) dalam 5 detik pertama.

#### 1. Wireframe Layout
```text
+-------------------------------------------------------------------------+
| [Dimension3D Logo] | Studio Internal Analytics    [User: Alex Pratama ▼] |
+------------------+------------------------------------------------------+
| [Overview]       | HEADER CONTROLS:                                     |
| [Channel Compare]| Channel: [Semua Saluran | IG | Google ▼]  Range: [7D ▼]|
| [Funnel Depth]   +------------------------------------------------------+
| [Leads Table]    | METRIC CARDS:                                        |
|                  | [ Impresi ] [ Pengunjung ] [ Kalkulator ] [ Deal DP ]|
|                  +------------------------------------------------------+
|                  | 🚨 ALERT BOCOR PARAH:                                |
|                  | "Drop-off 88.3% terdeteksi dari Kalkulator ke Deal!" |
|                  | Rekomendasi: Pasang WhatsApp instan & voucher 15%    |
|                  +------------------------------------------------------+
|                  | 4-STAGE INTERACTIVE FUNNEL VISUALIZATION             |
|                  | 1. Impresi Iklan (190.000)                           |
|                  | 2. Pengunjung Web 3D (24.200)       [-87.3% Drop]    |
|                  | 3. Interaksi Kalkulator (4.780)     [-80.2% Drop]    |
|                  | 4. Request Brief / Deal (560)       [-88.3% BOCOR!]  |
+------------------+------------------------------------------------------+
| [TABEL LOG INTERAKSI UX & LEADS KALKULATOR 3D (Live Real-time)]         |
+-------------------------------------------------------------------------+
```

#### 2. Elemen Interaksi:
* **Interactive Dropdown & Date Range:** Mengubah visualisasi corong secara instan berdasarkan saluran iklan (Google Ads vs Instagram Ads).
* **Smart Alert Banner (Bocor Parah):** Otomatis mendeteksi tahap dengan penurunan (*attrition*) tertinggi dan menyajikan kartu merah menyala beserta rekomendasi taktis bisnis 3D.
* **Real-time Live Leads Sync:** Tabel leads terhubung dengan API backend `GET /api/leads` dan form `3DWebsite`.
