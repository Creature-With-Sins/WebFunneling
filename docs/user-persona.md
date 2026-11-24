# Dokumentasi Desain Interaksi Pengguna (DIP) - User Persona

## Tahap 1: User Persona (Target Klien Studio Jasa 3D Desain & Animasi)

Dokumentasi ini mendefinisikan persona utama dari pengguna dashboard internal **Dimension3D Studio & Funnel Intelligence Suite**.

---

### Profil User
* **Nama Lengkap:** Alex Hendra Pratama, S.Sn. (Alex)
* **Jabatan / Role:** *Lead 3D Artist & Studio Director*
* **Institusi / Bisnis:** Dimension3D & NEXA 3D Studio
* **Karakteristik:** Visioner dalam visual & seni 3D (CGI, Three.js, Blender, Unreal Engine), berorientasi pada profitabilitas studio dan ROI iklan, memiliki waktu terbatas di depan spreadsheet karena fokus memimpin produksi animasi, serta memerlukan visibilitas cepat atas konversi calon klien dari iklan media sosial.

---

### Skenario Penggunaan
Alex mengelola alokasi anggaran iklan berbayar di **Google Ads (Search B2B)** dan **Instagram Ads (Reels 3D Portfolio)** untuk mendatangkan calon klien ke landing page interaktif 3D studio.

Setiap pagi dan sebelum weekly production meeting, Alex membuka dashboard Dimension3D untuk:
1. Memantau performa harian dari kedua channel iklan utama (Google Ads vs Instagram Ads).
2. Melihat secara transparan di mana calon klien berhenti atau keluar (*drop-off*) di 4 tahap corong:
   - **Impresi Iklan** $\rightarrow$ **Pengunjung Web 3D** $\rightarrow$ **Interaksi Kalkulator Harga** $\rightarrow$ **Request Brief / Deal DP 50%**.
3. Mengetahui apakah harga simulasi di kalkulator 3D terlalu mahal atau tombol submit brief kurang menarik (terdeteksi sebagai *Bocor Parah*).
4. Meninjau riwayat *leads* terbaru yang mengunci estimasi harga untuk segera di-follow up via WhatsApp.

---

### Pain Points & Tantangan Alex
1. **Kebocoran Iklan Visual:** Iklan Instagram Reels portofolio 3D mendapat banyak impresi dan klik, namun banyak calon klien keluar saat melihat estimasi harga kalkulator tanpa sempat mengirimkan brief proyek.
2. **Data Tersebar:** Sebelumnya interaksi kalkulator di website dan chat WhatsApp masuk secara terpisah tanpa metrik persentase konversi yang terukur.
3. **Respon Lambat ke Calon Klien:** Klien korporat (agency, developer properti, brand kecantikan) yang butuh jasa 3D cepat sering beralih ke vendor lain jika penawaran harga tidak segera direspon.

---

### Kebutuhan Desain Interaksi Pengguna (DIP)
1. **Tampilan Visual Instan & Interaktif:**
   * Visualisasi corong 4-tahap vertikal/horizontal dengan persentase penurunan (*drop-off rate*) real-time.
2. **Indicator & Leak Alert Otomatis (BOCOR PARAH):**
   * Tahap dengan kebocoran tertinggi otomatis diberi aksen visual **badge merah menyala** (`🚨 BOCOR PARAH TERDETEKSI`) lengkap dengan rekomendasi taktis bisnis 3D.
3. **Filter Komparasi Iklan Interaktif:**
   * Dropdown cepat untuk membandingkan efektivitas **Google Ads (High Intent B2B)** vs **Instagram Ads (Reels Visual Portfolio)**.
4. **Log Interaksi UX & Lead Tracking:**
   * Tabel interaktif yang mencatat spesifikasi render 3D, durasi animasi, add-on, estimasi harga, dan status konversi klien.
