# TikTok Downloader Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web TikTok Downloader berbasis Next.js dengan tampilan Clean Light Mode (100% bebas iklan) yang dapat mengunduh video tanpa watermark, slide gambar langsung ke galeri HP tanpa zip, dan audio MP3, dilengkapi tab riwayat unduhan lokal.

**Architecture:** Next.js App Router (React client components) dengan styling Vanilla CSS modern, route handler backend `/api/extract` untuk parsing metadata via TikWM, route handler streaming `/api/download` untuk download langsung bebas CORS, dan penyimpanan riwayat berbasis `localStorage`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS (CSS Variables), Lucide Icons (`lucide-react`).

**Spec:** [docs/superpowers/specs/2026-10-12-tiktok-downloader-design.md](file:///d:/Projek%20Aksa/tiktok-downloader/docs/superpowers/specs/2026-10-12-tiktok-downloader-design.md)

## Global Constraints

- Tema visual: Clean Light Mode (latar `#F8F9FA`, kartu `#FFFFFF`, aksen merah/pink TikTok `#FE2C55`, teks `#161823`).
- 100% Bebas Iklan (tidak ada AdMob, banner, pop-up, atau script tracker).
- Input tata letak: Text input di atas full-width (dengan tombol Paste), dan tombol Download merah berada persis di bawahnya.
- Unduhan slide gambar: Disediakan tombol unduh bertahap otomatis (sequential download) langsung ke memori/galeri HP tanpa harus mengekstrak dari file ZIP.
- Tanpa autentikasi/login; riwayat tersimpan di `localStorage` per browser.

---

### Task 1: Scaffolding Proyek Next.js & Dependensi

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Produces: Fondasi proyek Next.js dengan App Router, TypeScript, dan dependency `lucide-react`.

- [ ] **Step 1: Cek opsi CLI create-next-app**
Run: `npx -y create-next-app@latest --help`

- [ ] **Step 2: Inisialisasi proyek Next.js di direktori aktif**
Run: `npx -y create-next-app@latest . --typescript --eslint --no-tailwind --app --src-dir --import-alias "@/*" --use-npm --yes`

- [ ] **Step 3: Pasang paket lucide-react**
Run: `npm install lucide-react`

- [ ] **Step 4: Verifikasi build dev awal**
Run: `npm run build`
Expected: Build sukses menghasilkan `.next` bundle.

- [ ] **Step 5: Commit**
```bash
git add package.json tsconfig.json next.config.ts src/
git commit -m "chore: scaffold next.js app router with typescript and lucide-react"
```

---

### Task 2: Design System & Styling CSS Global

**Files:**
- Create/Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Google Fonts (Inter / Outfit / Plus Jakarta Sans) via Next.js Font Optimization.
- Produces: CSS design tokens (CSS variables: `--bg-body`, `--card-bg`, `--accent-primary`, `--accent-hover`, `--text-main`, `--text-muted`, `--border-color`, `--shadow-sm`, `--shadow-md`, `--radius-lg`).

- [ ] **Step 1: Definisikan CSS Tokens dan Utilitas di `src/app/globals.css`**
Tulis design tokens Clean Light Mode, reset box-sizing, typography styling, animasi spinner, dan media queries responsive.

- [ ] **Step 2: Update `src/app/layout.tsx` dengan metadata SEO & viewport**
Konfigurasi Title: "TikTok Downloader - Download Video Tanpa Watermark & Musik MP3", meta description, favicon, dan viewport mobile friendly.

- [ ] **Step 3: Uji visualisasi dasar di browser**
Run: `npm run build`
Expected: Tidak ada lint error dan CSS terkompilasi bersih.

- [ ] **Step 4: Commit**
```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "style: implement clean light mode design system tokens"
```

---

### Task 3: Backend API `/api/extract` (Metadata Parser)

**Files:**
- Create: `src/types/tiktok.ts`
- Create: `src/app/api/extract/route.ts`
- Create: `src/app/api/extract/__tests__/extract.test.ts` (atau scratch validation test)

**Interfaces:**
- Produces: `POST /api/extract` -> `{ success: boolean, data?: TikTokMediaData, error?: string }`
- Definisi tipe:
```typescript
export interface TikTokAuthor {
  id: string;
  unique_id: string;
  nickname: string;
  avatar: string;
}

export interface TikTokMediaData {
  id: string;
  title: string;
  cover: string;
  duration?: number;
  author: TikTokAuthor;
  type: 'video' | 'image';
  video?: {
    play: string;
    hdplay?: string;
    wmplay?: string;
  };
  images?: string[];
  music?: {
    title: string;
    author: string;
    play: string;
    cover?: string;
  };
}
```

- [ ] **Step 1: Buat file definisi tipe `src/types/tiktok.ts`**
- [ ] **Step 2: Buat route handler `src/app/api/extract/route.ts`**
Implementasikan validasi regex tautan TikTok (domain `tiktok.com`), fetch ke endpoint `https://www.tikwm.com/api/?url=...`, normalisasi data ke `TikTokMediaData`, dan error handling status 400/500.
- [ ] **Step 3: Uji endpoint `/api/extract` secara lokal dengan skrip uji node**
Run: `node -e "fetch('http://localhost:3000/api/extract', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({url: 'https://www.tiktokv.com/share/video/7461819411524078879'})}).then(r => r.json()).then(console.log)"`
Expected: `{ success: true, data: { id: '7461819411524078879', type: 'video', ... } }`
- [ ] **Step 4: Commit**
```bash
git add src/types/tiktok.ts src/app/api/extract/route.ts
git commit -m "feat: implement /api/extract endpoint for tiktok metadata extraction"
```

---

### Task 4: Backend API `/api/download` (Streaming Proxy)

**Files:**
- Create: `src/app/api/download/route.ts`

**Interfaces:**
- Produces: `GET /api/download?url=<target_url>&filename=<name>&type=video|audio|image` -> Response stream dengan header:
  - `Content-Disposition: attachment; filename="<name>"`
  - `Content-Type: <mime>`
  - `Cache-Control: no-cache`

- [ ] **Step 1: Buat route handler streaming proxy di `src/app/api/download/route.ts`**
Validasi query parameter `url`, jalankan `fetch(url, { headers: { 'User-Agent': ... } })`, salin status dan content-type, lalu kembalikan readable stream dengan `Content-Disposition: attachment`.
- [ ] **Step 2: Uji stream proxy**
Run: `node -e "fetch('http://localhost:3000/api/download?url=https://sf16-va.tiktokcdn.com/...&filename=test.mp4&type=video').then(r => console.log(r.status, r.headers.get('content-disposition')))"`
Expected: Status 200 dan attachment header valid.
- [ ] **Step 3: Commit**
```bash
git add src/app/api/download/route.ts
git commit -m "feat: implement /api/download streaming proxy route for direct downloads"
```

---

### Task 5: Helper & Utility Client (`storage.ts` & `downloadHelper.ts`)

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/utils/downloadHelper.ts`

**Interfaces:**
- `storage.ts`:
  - `saveToHistory(item: HistoryItem): void`
  - `getHistory(): HistoryItem[]`
  - `removeFromHistory(id: string): void`
  - `clearHistory(): void`
- `downloadHelper.ts`:
  - `triggerDownload(url: string, filename: string, type: 'video' | 'audio' | 'image'): void`
  - `downloadSequentialImages(images: string[], baseTitle: string, onProgress: (index: number, total: number) => void): Promise<void>`

- [ ] **Step 1: Buat `src/utils/storage.ts` dengan perlindungan SSR**
Pastikan aman dari error `typeof window === 'undefined'` dan batasi maksimal 30 item riwayat.
- [ ] **Step 2: Buat `src/utils/downloadHelper.ts`**
Implementasikan pemanggilan `/api/download` via pembuatan elemen anchor sementara (`<a>`), serta fungsi sequential download dengan `setTimeout` 350ms antar file agar galeri HP menerima semua foto secara bertahap tanpa diblokir browser.
- [ ] **Step 3: Commit**
```bash
git add src/utils/storage.ts src/utils/downloadHelper.ts
git commit -m "feat: add storage and sequential download client helpers"
```

---

### Task 6: Komponen UI Utama (Header, InputSection, TutorialCard, BottomNav)

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/InputSection.tsx`
- Create: `src/components/TutorialCard.tsx`
- Create: `src/components/BottomNav.tsx`

**Interfaces:**
- `Header`: Presentational component dengan status badge.
- `InputSection`:
  - Props: `{ onExtract: (url: string) => Promise<void>, isLoading: boolean }`
  - Fitur: Input text di atas dengan tombol Paste clipboard dan tombol Clear, serta tombol Download merah besar berada tepat di bawah input.
- `TutorialCard`: 3 langkah visual (Buka TikTok -> Copy Link -> Download).
- `BottomNav`:
  - Props: `{ activeTab: 'home' | 'history', onTabChange: (tab: 'home' | 'history') => void, historyCount: number }`

- [ ] **Step 1: Buat `src/components/Header.tsx`**
- [ ] **Step 2: Buat `src/components/InputSection.tsx`** dengan Clipboard API paste & keyboard submit `Enter`.
- [ ] **Step 3: Buat `src/components/TutorialCard.tsx`**
- [ ] **Step 4: Buat `src/components/BottomNav.tsx`** dengan ikon tab Home dan History.
- [ ] **Step 5: Commit**
```bash
git add src/components/Header.tsx src/components/InputSection.tsx src/components/TutorialCard.tsx src/components/BottomNav.tsx
git commit -m "feat: create header, input section with below-placed button, tutorial, and bottom nav components"
```

---

### Task 7: Komponen Hasil Unduhan (VideoTab, ImageTab, MusicTab, ResultCard)

**Files:**
- Create: `src/components/VideoTab.tsx`
- Create: `src/components/ImageTab.tsx`
- Create: `src/components/MusicTab.tsx`
- Create: `src/components/ResultCard.tsx`

**Interfaces:**
- `VideoTab`: Props `{ video: TikTokMediaData['video'], title: string, id: string }`
  - Tombol unduh: SD (No Watermark) dan HD (jika ada).
- `ImageTab`: Props `{ images: string[], title: string, id: string }`
  - Tombol aksi: "Unduh Semua Foto Langsung (Untuk Galeri HP)" dengan indikator progress + tombol unduh per foto.
- `MusicTab`: Props `{ music: TikTokMediaData['music'], id: string }`
  - Mini audio player + tombol download MP3.
- `ResultCard`: Props `{ data: TikTokMediaData, onReset: () => void }`
  - Menyatukan informasi kreator, sub-tab media, dan tombol reset "Unduh Video Lain".

- [ ] **Step 1: Buat `src/components/VideoTab.tsx`**
- [ ] **Step 2: Buat `src/components/ImageTab.tsx`**
- [ ] **Step 3: Buat `src/components/MusicTab.tsx`**
- [ ] **Step 4: Buat `src/components/ResultCard.tsx`**
- [ ] **Step 5: Commit**
```bash
git add src/components/VideoTab.tsx src/components/ImageTab.tsx src/components/MusicTab.tsx src/components/ResultCard.tsx
git commit -m "feat: create media result sub-tabs and result card component"
```

---

### Task 8: Komponen Riwayat Unduhan (`HistoryView.tsx`)

**Files:**
- Create: `src/components/HistoryView.tsx`

**Interfaces:**
- `HistoryView`:
  - Props: `{ onSelectMedia: (item: HistoryItem) => void }`
  - Tampilan: Daftar unduhan sebelumnya, thumbnail, judul, tombol download ulang langsung, tombol hapus per item, dan tombol bersihkan seluruh riwayat.

- [ ] **Step 1: Buat `src/components/HistoryView.tsx`**
Tampilkan empty state yang cantik saat belum ada riwayat ("Belum ada riwayat unduhan"), dan kartu list item saat riwayat tersedia.
- [ ] **Step 2: Commit**
```bash
git add src/components/HistoryView.tsx
git commit -m "feat: create history view component with localStorage synchronization"
```

---

### Task 9: Integrasi Halaman Utama (`src/app/page.tsx`) & End-to-End Test

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Client Component utama mengelola state:
  - `activeNav`: `'home' | 'history'`
  - `mediaData`: `TikTokMediaData | null`
  - `isLoading`: `boolean`
  - `errorMessage`: `string | null`
  - `toast`: `{ message: string, type: 'success' | 'error' } | null`

- [ ] **Step 1: Susun alur state dan rendering di `src/app/page.tsx`**
- [ ] **Step 2: Jalankan dev server Next.js**
Run: `npm run dev`
- [ ] **Step 3: Uji fungsionalitas dengan browser subagent / curl**
  - Uji link video TikTok (7461819411524078879) -> verifikasi hasil video muncul & tombol unduh berfungsi.
  - Uji link gallery TikTok (7452619935160782123) -> verifikasi slide gambar muncul.
  - Uji tab riwayat -> verifikasi item tersimpan dan dapat diakses.
- [ ] **Step 4: Build produksi untuk memastikan 0 type/lint error**
Run: `npm run build`
Expected: Build selesai tanpa error.
- [ ] **Step 5: Commit final**
```bash
git add src/app/page.tsx
git commit -m "feat: complete tiktok downloader app integration and responsive polish"
```
