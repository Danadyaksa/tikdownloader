# TikTok Downloader Web App — Design Specification

- **Tanggal**: 12 Oktober 2026
- **Status**: Approved by User
- **Platform**: Web (Mobile-First Responsive, Next.js App Router)
- **Desain UI**: Clean Light Mode (terinspirasi dari antarmuka AhaTik, 100% bebas iklan)

---

## 1. Latar Belakang & Tujuan

Aplikasi unduhan TikTok yang ada di Google Play Store (seperti *AhaTik*) memiliki fungsi yang bermanfaat untuk mengunduh video tanpa watermark, slide gambar, dan audio MP3. Namun, aplikasi-aplikasi tersebut dipenuhi oleh iklan agresif (banner judi, pop-up video interstitial) yang mengganggu kenyamanan pengguna.

Tujuan proyek ini adalah membangun aplikasi web **TikTok Downloader** berbasis **Next.js** yang:
1. **100% Bebas Iklan**: Bersih, cepat, tanpa pop-up atau banner yang mengganggu.
2. **Gratis & Tanpa Login**: Memanfaatkan endpoint ekstraksi tanpa watermark yang stabil dan gratis.
3. **Multi-Media Support**: Mendukung unduhan Video (No Watermark SD & HD), Slide Foto/Gallery (unduh satu per satu atau otomatis seluruh foto langsung ke galeri HP), serta Audio MP3.
4. **Mobile-First Ergonomic**: Antarmuka bersih (Clean Light Mode) yang sangat nyaman digunakan di smartphone maupun komputer.
5. **Fitur Riwayat (History)**: Menyimpan riwayat unduhan secara lokal di browser (`localStorage`) tanpa membutuhkan akun atau database eksternal.

---

## 2. Desain Antarmuka & Tata Letak (UI/UX)

### 2.1 Palet Warna & Tipografi
* **Background Utama**: Abu-abu sangat lembut (`#F8F9FA` / `#F3F4F6`).
* **Background Kartu**: Putih bersih (`#FFFFFF`) dengan border halus (`#E5E7EB`) dan bayangan lembut (*soft elevation* `0 4px 20px rgba(0, 0, 0, 0.05)`).
* **Warna Aksen Utama**: TikTok Pink/Red (`#FE2C55`, hover: `#E01E46`, active: `#D0143C`).
* **Warna Aksen Sekunder**: TikTok Cyan (`#25F4EE` untuk aksen highlight) & Dark Charcoal (`#161823` untuk teks utama).
* **Warna Teks Redup**: `#6B7280` / `#9CA3AF`.
* **Border Radius**: Sudut membulat modern (`16px` – `24px`).

### 2.2 Struktur Halaman & Komponen

#### A. Header
* Logo modern: Icon play/glitch + teks brand `"TikDown"`.
* Status badge: `"100% Free · No Watermark · Unlimited"`.

#### B. Input & Action Box (Sesuai Permintaan Revisi User)
* **Text Input (Atas)**:
  * Full-width input box dengan placeholder `"Paste TikTok link here..."`.
  * Tombol pembantu di dalam input: Tombol **"Paste"** (mengakses Clipboard API browser untuk menempelkan tautan secara instan) dan tombol **"Clear"** (icon silang saat ada teks).
* **Tombol Download (Bawah Tepat)**:
  * Berada persis di bawah text input.
  * Tombol berukuran besar, full-width, warna merah TikTok (`#FE2C55`) dengan teks `"Download"`.
  * Menampilkan spinner animasi dan teks status saat proses pengambilan data berlangsung.

#### C. Kartu Panduan (Tutorial Card)
* Menampilkan 3 langkah mudah bergambar ikon seperti pada referensi `img1.png`:
  1. Buka aplikasi TikTok & klik tombol **Share (Bagikan)**.
  2. Pilih menu **Copy Link (Salin Tautan)**.
  3. Buka aplikasi ini, tempel tautan, lalu klik **Download**.

#### D. Kartu Hasil Unduhan (Result View)
Muncul secara otomatis setelah proses ekstraksi tautan berhasil:
* **Header Konten**: Foto profil kreator, nama/username (`@kreator`), judul/caption lengkap postingan.
* **Sub-Tab Navigasi Media**:
  1. **Tab Video** (Jika post adalah video):
     * Video player mini untuk preview.
     * Tombol aksi unduh:
       * **"Download Video (No Watermark)"** (SD MP4)
       * **"Download HD Video"** (HD MP4 jika tersedia)
  2. **Tab Image / Foto Slide** (Jika post adalah slide galeri foto):
     * Tampilan galeri foto rapi dari seluruh slide foto.
     * Tombol aksi unduh massal: **"Unduh Semua Foto Langsung"** — men-trigger unduhan semua foto satu per satu secara berurutan sehingga langsung tersimpan ke Galeri Foto HP tanpa perlu diekstrak dari format ZIP.
     * Tombol unduh individual di setiap foto bagi user yang hanya ingin mengunduh foto tertentu.
  3. **Tab Music (Audio MP3)**:
     * Pemutar audio mini dengan kontrol play/pause untuk mendengarkan suara langsung di web.
     * Judul lagu dan nama artis pembuat lagu.
     * Tombol **"Download Audio (MP3)"**.
* **Tombol "Unduh Video Lain"**: Mereset tampilan untuk menginput tautan baru tanpa perlu refresh halaman.

#### E. Navigasi Bawah (Bottom Navigation Bar)
* Bar navigasi tetap di bagian bawah layar:
  * 🏠 **Home**: Halaman unduhan utama.
  * 🕒 **History**: Halaman riwayat unduhan tersimpan.

#### F. Halaman Riwayat (History Tab)
* Menampilkan daftar postingan yang pernah diunduh sebelumnya dari `localStorage`.
* Setiap item menampilkan: Thumbnail cover, judul/caption, nama kreator, tanggal unduh, dan tombol **"Download Ulang"** instan.
* Tombol untuk menghapus satu item tertentu dan tombol **"Hapus Semua Riwayat"**.

---

## 3. Arsitektur Teknis & Alur Data

### 3.1 Next.js App Router Structure
```
src/
├── app/
│   ├── api/
│   │   ├── extract/
│   │   │   └── route.ts     # Endpoint POST untuk ekstraksi metadata TikTok
│   │   └── download/
│   │       └── route.ts     # Endpoint GET streaming proxy unduhan file
│   ├── globals.css          # CSS Tokens & Styling Dasar
│   ├── layout.tsx           # Layout root & viewport configuration
│   └── page.tsx             # Main client container (Home, Result, History)
├── components/
│   ├── Header.tsx           # Logo & status badge
│   ├── InputSection.tsx     # Input URL + Tombol Paste + Tombol Download di bawah
│   ├── TutorialCard.tsx     # Panduan 3 langkah
│   ├── ResultCard.tsx       # Tampilan detail video, slide foto, dan musik
│   ├── VideoTab.tsx         # Preview & tombol unduh video
│   ├── ImageTab.tsx         # Galeri foto & tombol unduh massal non-zip
│   ├── MusicTab.tsx         # Audio preview & tombol unduh audio
│   ├── HistoryView.tsx      # Daftar riwayat unduhan lokal
│   └── BottomNav.tsx        # Navigasi bawah (Home vs History)
├── types/
│   └── tiktok.ts            # Definisi TypeScript untuk response TikTok & item riwayat
└── utils/
    ├── storage.ts           # Helper CRUD localStorage untuk riwayat unduhan
    └── downloadHelper.ts    # Helper sequential download untuk foto HP
```

### 3.2 Endpoint API Internal
1. **`POST /api/extract`**:
   * Request Payload: `{ url: string }`
   * Validasi: Memeriksa apakah URL valid (domain `tiktok.com`, `vt.tiktok.com`, dll).
   * Upstream Call: Menghubungi `https://www.tikwm.com/api/?url=...`.
   * Response:
     ```json
     {
       "success": true,
       "data": {
         "id": "7461819411524078879",
         "title": "Caption postingan",
         "cover": "https://...",
         "author": { "nickname": "...", "unique_id": "...", "avatar": "..." },
         "type": "video" | "image",
         "video": { "play": "https://...", "hdplay": "https://..." },
         "images": ["https://...", "https://..."],
         "music": { "title": "...", "author": "...", "play": "https://..." }
       }
     }
     ```
2. **`GET /api/download`**:
   * Query Parameters: `?url=<media_url>&filename=<desired_filename>&type=video|audio|image`
   * Response: Mengalirkan stream binary media dari CDN TikTok dengan header `Content-Disposition: attachment; filename="..."` dan `Content-Type: video/mp4 | audio/mpeg | image/jpeg`.
   * Tujuan: Mengatasi pemblokiran Cross-Origin pada atribut `download` di browser HP Android & iPhone.

### 3.3 Mekanisme Unduhan Massal Foto Tanpa ZIP
Untuk memudahkan pengguna HP:
* Fungsi `downloadMultipleImagesSequentially(images, baseTitle)`:
  * Mengiterasi daftar URL gambar satu per satu.
  * Memicu pengunduhan file melalui `/api/download` dengan jeda waktu pendek (~350ms) per file.
  * Setiap gambar otomatis masuk sebagai file terpisah langsung ke Galeri Foto perangkat.

---

## 4. Penanganan Kasus Khusus & Error Handling

1. **Format Tautan Pendek (`vt.tiktok.com` / `vm.tiktok.com`)**:
   * Server secara otomatis mengikuti *HTTP redirect* ke URL kanonikal postingan sebelum parsing.
2. **Postingan Privat atau Dihapus**:
   * Menampilkan pesan ramah: *"Video tidak ditemukan atau bersifat privat. Pastikan tautan masih aktif."*
3. **Tautan Bukan dari TikTok**:
   * Menampilkan pesan validasi: *"Harap masukkan tautan video TikTok yang valid."*
4. **Masalah Izin Clipboard di Browser**:
   * Jika izin `navigator.clipboard.readText()` ditolak oleh browser HP, tampilkan instruksi kecil untuk menempelkan secara manual tanpa menyebabkan error crash.

---

## 5. Rencana Pengujian (Testing Plan)

1. **Uji Ekstraksi Video**: Menguji link video standar TikTok, memastikan URL No-Watermark dan HD dapat diunduh.
2. **Uji Ekstraksi Slide Foto**: Menguji link postingan album foto (foto mode), memastikan seluruh gambar terdeteksi dan fungsi unduh satu-satu maupun beruntun berfungsi.
3. **Uji Ekstraksi Audio**: Menguji sound/musik TikTok, memastikan preview audio berbunyi dan file MP3 terunduh.
4. **Uji Tab Riwayat**: Memastikan postingan yang diunduh tercatat di `localStorage`, dapat diunduh ulang, dan dapat dihapus.
5. **Uji Responsivitas**: Memverifikasi tampilan mobile bersih dan tombol download di bawah input teks mudah ditekan.
