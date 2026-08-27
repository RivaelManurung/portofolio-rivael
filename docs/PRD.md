# PRD — Personal Portfolio Website "D.Nova"

**Versi:** 1.0
**Tanggal:** 27 Agustus 2026
**Owner:** info@kreasinusantara.id
**Status:** Draft — siap untuk implementasi

---

## 1. Ringkasan Produk

Website portfolio personal untuk seorang **Product/UIUX Designer** dengan positioning premium-editorial. Tujuannya bukan sekadar memajang karya, tapi **mengubah pengunjung menjadi booked call**. Setiap section punya satu tugas: membangun kredibilitas (angka, pengalaman), membuktikan kemampuan (karya), lalu menutup dengan CTA.

Gaya visual: **Swiss/editorial minimalis** — banyak white space, tipografi besar sebagai elemen utama, foto hitam-putih, aksen produk berwarna muted (beige, sage, lilac). Gerakan halus tapi terasa mahal.

### 1.1 Tujuan

| Tujuan | Metrik Sukses |
|---|---|
| Konversi ke konsultasi | ≥ 5% visitor klik "Book A Call" |
| Kredibilitas instan | Bounce rate < 45%, avg. time on page > 90s |
| Performa | Lighthouse ≥ 95 (semua kategori), LCP < 1.8s, CLS < 0.05 |
| SEO | Terindeks penuh, skor SEO 100, OG image dinamis |
| Aksesibilitas | WCAG 2.1 AA, keyboard-navigable penuh |

### 1.2 Target Pengguna

1. **Founder startup / product manager** — cari designer untuk produk baru. Butuh bukti hasil (angka, klien, proses).
2. **Agency / recruiter** — scanning cepat. Butuh CV visual, tech stack, pengalaman.
3. **Sesama designer** — inspirasi & networking. Menilai kualitas eksekusi detail.

### 1.3 Non-Goals (v1)

- Tidak ada e-commerce / paid product
- Tidak ada multi-bahasa (struktur i18n disiapkan, konten hanya EN)
- Tidak ada dashboard admin custom
- Tidak ada dark mode — desain sengaja commit ke satu look terang (lihat §3.1)

---

## 2. Tech Stack

Prinsip pemilihan: **modern, stabil, cepat di Vercel, tidak over-engineered.**

### 2.1 Core

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 15** (App Router, RSC) | Server Components = HTML kecil, streaming, `next/image` & `next/font` built-in |
| Runtime UI | **React 19** | Actions, `useOptimistic`, ref-as-prop, siap React Compiler |
| Bahasa | **TypeScript 5.7+** (`strict: true`) | Type-safety untuk konten & props animasi |
| Styling | **Tailwind CSS v4** | Config CSS-first via `@theme`, engine Oxide, native cascade layers |
| Package manager | **pnpm** | Disk-efficient, strict node_modules |
| Lint & format | **Biome 2** | Satu tool, jauh lebih cepat dari ESLint+Prettier |
| Deploy | **Vercel** | Edge network, ISR, Image Optimization, Analytics |

### 2.2 Animasi & Interaksi

| Kebutuhan | Library | Catatan |
|---|---|---|
| Animasi komponen & scroll reveal | **Motion for React** (`motion` v12, penerus framer-motion) | `whileInView`, `useScroll`, `useTransform`, layout animation |
| Smooth scroll | **Lenis** v1 | Inertia scroll — pondasi feel "mahal". Wajib disinkronkan dengan `useScroll` Motion |
| Timeline kompleks / pin | **GSAP 3 + ScrollTrigger** | **Hanya** untuk horizontal-pinned gallery. Jangan dipakai di tempat lain agar bundle ramping |
| Split text | Custom hook `useSplitText` | Pecah heading jadi per-karakter/kata untuk stagger mask reveal. Tidak perlu plugin berbayar |
| Marquee | CSS `@keyframes` + `translate3d` | Zero-JS, GPU-composited |
| Number counter | `useMotionValue` + `animate()` (Motion) | Untuk `+200`, `+50`, `120%` |
| Custom cursor | Komponen sendiri + `useSpring` | Follower + state (default / link / drag / view) |

### 2.3 Konten & Data

| Item | Pilihan |
|---|---|
| Blog | **MDX** — file-based di `content/blog/*.mdx`, plus `rehype-pretty-code` + `remark-gfm` |
| Case study | **MDX** di `content/work/*.mdx` dengan frontmatter |
| Validasi frontmatter | **Zod 4** — build gagal kalau frontmatter salah, bukan error saat runtime |
| Alternatif skala besar | Sanity Studio embedded di `/studio` — **pertimbangkan di v2, jangan di v1** |

### 2.4 Form & Integrasi

| Item | Pilihan |
|---|---|
| Booking call | **Cal.com embed** (`@calcom/embed-react`) — modal popup, bukan halaman terpisah |
| Contact form | **React Hook Form + Zod** → **Server Action** → **Resend** |
| Email template | **React Email** |
| Anti-spam | Honeypot field + rate limit via **Upstash Redis** |
| Analytics | **Vercel Analytics** + **Speed Insights** (privacy-friendly, tanpa cookie banner) |

### 2.5 Struktur Folder

```
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── work/page.tsx
│   │   ├── work/[slug]/page.tsx  # Case study
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   └── layout.tsx            # Nav + Footer + SmoothScroll
│   ├── api/og/route.tsx          # OG image dinamis (ImageResponse)
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css               # @theme Tailwind v4 + design tokens
├── components/
│   ├── sections/                 # Hero, About, Marquee, Experience, CtaBanner, Works, Blog, Footer
│   ├── ui/                       # Button, Pill, ArrowCircle, Card, SectionLabel
│   └── motion/                   # Reveal, SplitText, MagneticButton, Parallax, Counter, Cursor
├── lib/
│   ├── content.ts                # MDX loader + Zod schema
│   ├── motion.ts                 # Easing & variant tokens terpusat
│   └── utils.ts                  # cn()
├── hooks/
│   ├── use-lenis.ts
│   ├── use-reduced-motion.ts
│   └── use-media-query.ts
└── content/
    ├── work/
    └── blog/
```

---

## 3. Design System

### 3.1 Warna

Palet sengaja **sangat terbatas**. Warna hanya masuk lewat *foto karya*, bukan lewat UI. Ini yang bikin terasa editorial.

```css
@theme {
  /* Netral — tulang punggung */
  --color-ink:        #0A0A0A;  /* teks utama, footer, CTA banner */
  --color-ink-muted:  #6E6E6E;  /* paragraf sekunder */
  --color-ink-faint:  #A3A3A3;  /* label, meta, tanggal */
  --color-line:       #E4E4E4;  /* border, divider timeline */
  --color-surface:    #FFFFFF;  /* card, section terang */
  --color-canvas:     #F2F2F0;  /* background halaman (off-white hangat) */
  --color-canvas-alt: #EBEBE8;  /* section selang-seling, hover row */

  /* Aksen — dipakai <5% area */
  --color-accent:     #0A0A0A;  /* aksen = hitam. Kontras adalah aksennya */
  --color-focus:      #2563EB;  /* HANYA untuk focus ring — aksesibilitas */
}
```

**Aturan warna:**

- Background halaman `--color-canvas` (#F2F2F0), bukan putih murni — mengurangi eye strain, terasa seperti kertas.
- Card portfolio/blog di atasnya pakai `--color-surface` (#FFFFFF) → elevasi tanpa shadow.
- Section CTA & Footer full `--color-ink` → jangkar visual yang memecah ritme halaman.
- Semua **foto orang: grayscale 100%**. Semua **foto karya: warna asli muted**. Kontras inilah yang membuat karya jadi hero.
- Kontras teks minimal 4.5:1. `--color-ink-muted` di atas `--color-canvas` ≈ 5.1:1 ✓. `--color-ink-faint` hanya untuk teks ≥18px atau non-esensial.

### 3.2 Tipografi

Dua typeface. Tidak lebih.

| Peran | Font | Sumber | Weight |
|---|---|---|---|
| Display & Heading | **General Sans** | Fontshare (gratis, lisensi komersial) | 200, 300, 400, 500 |
| Body & UI | **Inter Variable** | `next/font/google` | 400, 500 |
| Mono (meta/tag, opsional) | **Geist Mono** | package `geist` | 400 |

> **Alternatif berbayar** kalau ada budget: `PP Neue Montreal` (Pangram Pangram) — inilah font yang paling mendekati referensi visual. General Sans adalah padanan gratis terdekat, bukan fallback darurat.

**Loading:** `next/font/local` untuk General Sans (self-hosted `.woff2` variable), `display: 'swap'`, `preload: true`, subset `latin`. Target CLS = 0.

**Type scale** (fluid `clamp()`, tidak ada lompatan antar-breakpoint):

```css
@theme {
  --text-display: clamp(4.5rem, 16vw, 15rem);    /* "Hello" — hero */
  --text-h1:      clamp(2.5rem, 5.5vw, 4.5rem);  /* "Explore My Design Journey" */
  --text-h2:      clamp(2rem, 4vw, 3.25rem);     /* "Latest Works" */
  --text-h3:      clamp(1.25rem, 2vw, 1.75rem);  /* judul card, nama perusahaan */
  --text-body:    clamp(0.9375rem, 1vw, 1.0625rem);
  --text-meta:    0.8125rem;                     /* tag, tanggal, "5 min read" */
}
```

**Aturan tipografi:**

- Display `Hello` → weight **200**, `letter-spacing: -0.04em`, `line-height: 0.82`. Kelegaan hurufnya adalah statement utama halaman.
- Semua heading `letter-spacing: -0.02em`. Semakin besar font, semakin negatif tracking-nya.
- Body `line-height: 1.6`, `max-width: 58ch`. Jangan pernah paragraf full-width.
- Label section (`• Portfolio`, `• Blogs`): uppercase, `letter-spacing: 0.08em`, `--text-meta`, warna `--color-ink-faint`, didahului dot 6px `--color-ink`.

### 3.3 Spacing & Layout

- **Grid:** 12 kolom, `max-width: 1440px`, gutter 24px (mobile) → 40px (desktop), padding luar 20px → 64px.
- **Skala spacing:** kelipatan 4px. Jarak antar-section `clamp(80px, 12vw, 180px)`.
- **Radius:** `sm: 8px` (pill), `md: 12px` (card), `lg: 20px` (banner besar), `full: 9999px` (tombol lingkaran).
- **Border:** `1px solid var(--color-line)`. Tidak ada `box-shadow` di mana pun kecuali hover card (`0 8px 30px rgba(0,0,0,.06)`).

### 3.4 Komponen UI Inti

| Komponen | Deskripsi |
|---|---|
| `<ArrowCircle>` | Lingkaran 48–64px berisi `↗`. Varian: solid ink / outline / ghost. Muncul di hover card, timeline row, CTA |
| `<Pill>` | Tag `UIUX` / `Branding` / `MARKETING`. Border 1px, radius-full, padding 6px 14px |
| `<LinkUnderline>` | Link "Book A Call ↗" dengan underline yang *sweep* dari kiri saat hover (bukan fade) |
| `<MagneticButton>` | Tombol yang tertarik ke arah kursor dalam radius 80px |
| `<SectionLabel>` | `• Portfolio` — dot + uppercase label |
| `<WorkCard>` | Gambar 4:3 + judul + "For [logo klien]" + ArrowCircle saat hover |
| `<BlogCard>` | Gambar 3:2 + Pill kategori + read time + judul |

---

## 4. Spesifikasi Section (Homepage)

### 4.1 Navigation

- **Layout:** logo asterisk (kiri) · `About Me · Portfolio · Services · Blog` · `Book A Call ↗` (kanan).
- **Perilaku:** transparan di atas hero; setelah scroll > 80px berubah jadi **floating pill** — `backdrop-filter: blur(16px)`, background `rgba(242,242,240,.8)`, border 1px, radius-full, lebarnya menyusut.
- **Hide-on-scroll-down / show-on-scroll-up** dengan transisi spring pada `y`.
- **Mobile:** hamburger → fullscreen overlay background `--color-ink`, link stagger dari bawah (delay 60ms/item), teks putih ukuran `--text-h2`.
- **Active state:** underline mengikuti link aktif memakai `layoutId` (shared layout animation Motion).

### 4.2 Hero

**Struktur:**
- Kiri-atas: dua stat block — `+200 / Project completed`, `+50 / Startup raised`.
- Tengah-kiri: `Hello` (display, weight 200) + em-dash + `It's D.Nova a design wizard`.
- Sisi kiri (rotated −90°): `Product designer`; kiri-bawah rotated: `2024`.
- Kiri-bawah: `Scroll down ↓`.
- Kanan: **cutout portrait grayscale** (PNG transparan, bukan foto persegi). Ini kunci komposisinya — bahu subjek memotong ekor huruf "o" pada "Hello".

**Layering:** portrait `z-10`, teks "Hello" `z-0`, dengan overlap terkontrol. Implementasi: satu PNG transparan di atas teks, atau dua layer (silhouette blur + cutout) bila aset tidak sempurna.

**Animasi masuk (total ≈1.4s):**

| Waktu | Elemen | Gerakan |
|---|---|---|
| 0.00s | Portrait | `clip-path: inset(100% 0 0 0)` → `inset(0)`, 1.1s, ease `[.16,1,.3,1]` |
| 0.15s | "Hello" | Split per-karakter, tiap karakter `y: 110% → 0` di dalam mask `overflow-hidden`, stagger 45ms |
| 0.60s | Stat number | Counter 0→200 dan 0→50 dalam 1.2s, `easeOut` |
| 0.70s | Teks pendukung | Fade + `y: 20 → 0` |
| 1.00s | Scroll down | Fade in + panah loop `y: [0, 6, 0]` 1.8s infinite |

**Animasi saat scroll:** portrait `y: 0 → −60px` (parallax lambat), "Hello" `y: 0 → 120px` + `opacity: 1 → .15`. Pakai `useScroll({ offset: ['start start', 'end start'] })`.

### 4.3 About Me

**Struktur 3 kolom asimetris:**
- **Kol 1 (4/12):** heading `About Me` + paragraf perkenalan + panah lengkung hand-drawn (SVG) mengarah ke kartu tengah.
- **Kol 2 (4/12):** kartu putih ter-elevasi — badge lingkaran dengan teks melingkar (rotasi lambat), angka `120%`, caption *"Average increase in client engagement in the first 6 months"*, dan foto grayscale.
- **Kol 3 (4/12):** foto kecil grayscale + 2 bullet point, tiap bullet didahului `ArrowCircle` solid hitam kecil.

**Animasi:**
- Panah SVG: `pathLength: 0 → 1` saat masuk viewport, 1.2s. Detail ini yang paling terasa *crafted*.
- Kartu tengah masuk **lebih lambat** dari kolom kiri/kanan (stagger 0.15s) → menciptakan depth.
- Badge lingkaran: `rotate: 360deg`, 20s linear infinite.
- `120%`: counter animation.
- Foto: parallax internal — `scale: 1.1` di dalam container `overflow-hidden`, `y` bergerak berlawanan arah scroll.

### 4.4 Project Marquee (Horizontal Gallery)

Baris kartu karya yang bergerak horizontal terus-menerus, **bleed** keluar viewport di kedua sisi.

**Perilaku:**
- Auto-scroll `translateX` infinite (konten diduplikasi 2× untuk loop mulus), ~40s per siklus.
- **Scroll-velocity coupling:** kecepatan marquee dipengaruhi kecepatan scroll user (`useVelocity`), dan **arah membalik** saat scroll ke atas. Ini efek signature halaman.
- **Draggable** di desktop & touch (`drag="x"` + `dragMomentum`).
- Hover kartu: marquee pause, gambar `scale: 1.04`, `ArrowCircle` fade+scale masuk di tengah.
- Kursor berubah ke state `drag` (lingkaran + ikon `↔`).

**Opsi lanjutan — Pinned Horizontal (GSAP ScrollTrigger):** section di-`pin`, scroll vertikal diterjemahkan jadi gerak horizontal. Pakai ini untuk halaman `/work` bila ingin efek lebih dramatis.

### 4.5 Experiences Timeline

**Struktur:**
- Header 2 kolom — kiri: `• Experiences` + `Explore My Design Journey` (h1). Kanan: paragraf + `Book A Call ↗`.
- List baris dipisah divider 1px:
  `[Perusahaan, Kota, Negara]` · `[↳ tanggal]` · `[deskripsi singkat]` · `[Pill tags]`

**Interaksi utama — expandable row:**
- Klik baris → expand jadi panel berisi 3 thumbnail proyek + paragraf detail + `ArrowCircle` besar.
- `<AnimatePresence>` + animasi `height: 0 → auto` dan opacity.
- Accordion behavior: hanya satu row terbuka pada satu waktu.
- Thumbnail masuk stagger 80ms, `scale: .9 → 1`.

**Micro-interaction hover baris:**
- Seluruh baris: background fade ke `--color-canvas-alt`.
- Nama perusahaan geser `x: 0 → 12px`.
- `↗` kecil muncul di ujung kanan dari `x: −10, opacity: 0`.
- Divider `scaleX: 0 → 1` dari kiri saat baris masuk viewport, stagger 80ms per baris.

### 4.6 CTA Banner (Dark)

- Full-width card `radius-lg`, background foto workspace gelap + overlay `rgba(10,10,10,.55)`, teks putih center.
- Konten: `(Book Your Free Consultation Now!)` → headline 2 baris → subteks → `Let's talk ↗`.
- **Animasi:** background parallax `y: −15% → 15%` sepanjang section; teks `y: 40 → 0` stagger; border-radius menyusut `40px → 20px` saat section masuk viewport.
- Hover `Let's talk`: underline sweep + panah rotasi 45°.

### 4.7 Latest Works

- `• Portfolio` + `Latest Works` (h2, center).
- Grid 3 kolom desktop / 1 kolom mobile. Kartu: gambar 4:3, judul, `For [logo klien]`.
- Kartu tengah **offset ke bawah** (`translateY: 32px`) untuk ritme non-grid.
- Hover: `ArrowCircle` solid muncul `scale: .6 → 1` di tengah gambar; gambar `scale: 1.05` + `brightness: .92`.
- Reveal: `clip-path: inset(0 0 100% 0) → inset(0)` per kartu, stagger 120ms.
- Bawah: `Check out More → View More` (magnetic button).

### 4.8 Blog / Design Insights

- `• Blogs` + `Design Insights & Trends` (h2, center).
- 3 kartu: gambar 3:2 (warna muted), Pill kategori, `5 min read`, judul maksimal 2 baris.
- Hover: gambar `scale: 1.04`, judul dapat underline sweep.
- Data dari `content/blog/*.mdx`, sort `publishedAt` desc, ambil 3 teratas.

### 4.9 Final CTA + Footer

- **Final CTA:** center, `Got a Vision? Let's Bring It to Life!` (h1) + subteks + `Book A Call ↗`, background `--color-canvas`. Heading pakai split-**word** reveal (bukan per-karakter — terlalu panjang).
- **Footer:** background `--color-ink`, teks `--color-canvas`.
  - Kiri: nav links horizontal. Kanan: `hello@dnova.com` ukuran `--text-h3`, hover → underline sweep, klik → copy-to-clipboard + toast "Copied!".
  - Baris bawah: `© 2026 D.Nova` · social links · `Built with Next.js`.
  - Efek **curtain reveal**: konten utama `relative z-10`, footer `sticky bottom-0 z-0` sehingga terungkap saat scroll.

---

## 5. Sistem Animasi (Terpusat)

### 5.1 Token Easing & Durasi

Semua animasi mengambil dari `src/lib/motion.ts`. **Tidak boleh ada angka easing hardcoded di komponen.**

```ts
export const ease = {
  out:      [0.16, 1, 0.30, 1],  // default — reveal, masuk viewport
  inOut:    [0.83, 0, 0.17, 1],  // transisi state, expand/collapse
  spring:   { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
  magnetic: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
} as const

export const duration = { fast: 0.3, base: 0.6, slow: 1.0, hero: 1.2 } as const
```

### 5.2 Variant Standar

```ts
export const revealUp = {
  hidden:  { y: 40, opacity: 0 },
  visible: (i = 0) => ({
    y: 0, opacity: 1,
    transition: { duration: duration.base, ease: ease.out, delay: i * 0.08 },
  }),
}

export const maskReveal = {
  hidden:  { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)',
             transition: { duration: duration.slow, ease: ease.out } },
}
```

`whileInView` selalu memakai `viewport={{ once: true, margin: '-15% 0px' }}` — animasi trigger sebelum elemen terlihat penuh, dan **tidak berulang** saat scroll balik ke atas.

### 5.3 Hierarki Gerakan

Aturan agar halaman tidak terasa "semuanya bergerak":

1. **Satu focal animation per section.** Elemen lain hanya reveal sederhana.
2. **Teks duluan, gambar menyusul** — kecuali hero (gambar duluan).
3. **Durasi berbanding lurus dengan ukuran elemen.** Besar = lambat (1.0–1.2s), kecil = cepat (0.3s).
4. **Tidak ada animasi > 1.2s** kecuali loop dekoratif (badge rotasi, marquee).
5. **Hanya animasikan `transform` & `opacity`.** Jangan `width`, `top`, `margin` — pengecualian: `height: auto` pada accordion.

### 5.4 Smooth Scroll (Lenis)

Config: `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true`, `syncTouch: false` (mobile pakai native scroll — lebih responsif dan hemat baterai).

**Kritis:** Lenis, Motion `useScroll`, dan GSAP ScrollTrigger harus berbagi **satu RAF loop**. Desync di sini adalah penyebab #1 animasi tersendat — uji di Chrome, Safari, dan Firefox sejak fase awal.

### 5.5 Custom Cursor

- Dot 8px (mengikuti instan) + ring 36px (mengikuti dengan `useSpring`, stiffness 150 / damping 15).
- State: `default` → `link` (ring membesar ke 60px) → `drag` (ring + `↔`) → `view` (ring + teks "View").
- **Hanya render di `@media (pointer: fine)`.** Di touch device tidak dirender sama sekali.

### 5.6 Reduced Motion — WAJIB

Jika `prefers-reduced-motion: reduce`:

- Semua reveal jadi fade `opacity` saja, durasi 0.2s.
- Lenis **dimatikan** → native scroll.
- Marquee & badge rotasi **berhenti**.
- Parallax nonaktif (`y` selalu 0).
- Custom cursor dimatikan.

Ini requirement aksesibilitas, bukan opsional.

### 5.7 Page Transition

- **View Transitions API** (`next.config.ts` → `experimental.viewTransition`) untuk cross-fade antar halaman.
- Fallback browser tanpa dukungan: `template.tsx` dengan `<motion.div>` fade + `y: 12`.
- Thumbnail karya → halaman case study: **shared element transition** lewat `view-transition-name` pada gambar.

---

## 6. Halaman Lain

| Route | Isi |
|---|---|
| `/` | Homepage (§4) |
| `/work` | Grid semua karya + filter kategori (`All / UIUX / Branding / Web`) dengan `layout` animation saat filter berubah |
| `/work/[slug]` | Case study — hero besar, meta (client, year, role, tools), problem → process → solution, galeri, link next project |
| `/blog` | List artikel + filter kategori |
| `/blog/[slug]` | Artikel MDX + reading progress bar (`useScroll` → `scaleX`) + TOC sticky + share |
| `/about` | Versi panjang §4.3 + timeline lengkap + tools & skills |
| `/services` | Daftar layanan + proses kerja (numbered steps) + pricing tier + FAQ accordion |
| `/not-found` | 404 kreatif — angka besar dengan distorsi mengikuti kursor |

---

## 7. Performa, SEO & Aksesibilitas

### 7.1 Anggaran Performa

| Metrik | Target |
|---|---|
| LCP | < 1.8s |
| INP | < 200ms |
| CLS | < 0.05 |
| JS bundle homepage (gzip) | < 180 KB |
| Total page weight homepage | < 1.5 MB |

**Strategi:**
- Semua section statis = **Server Components**. Hanya komponen ber-animasi yang `'use client'`, di-isolasi seketat mungkin (`<Reveal>` jadi client wrapper, `children`-nya tetap RSC).
- `next/image` dengan `sizes` eksplisit + `placeholder="blur"` (blurDataURL di-generate saat build via `plaiceholder`).
- Format **AVIF** dengan fallback WebP.
- Hero portrait: `priority` + `fetchPriority="high"`. Gambar lain lazy.
- GSAP `dynamic({ ssr: false })`, hanya di section yang memerlukannya.
- Font self-host, `preload`, `display: swap`, subset latin.
- Lenis & custom cursor di-load setelah hydration.
- Ukur tiap fase dengan `@next/bundle-analyzer`.

### 7.2 SEO

- `generateMetadata` per route — title, description, canonical, OG, Twitter card.
- **OG image dinamis** via `app/api/og/route.tsx` (`ImageResponse`) — judul artikel/karya dirender jadi 1200×630 dengan brand typography.
- JSON-LD: `Person` (homepage), `Article` (blog), `CreativeWork` (case study), `BreadcrumbList`.
- `sitemap.ts` & `robots.ts` generatif dari daftar konten MDX.
- Semantic HTML: satu `<h1>` per halaman, `<article>`, `<nav>`, `<section aria-labelledby>`.

### 7.3 Aksesibilitas

- Focus ring selalu terlihat: `outline: 2px solid var(--color-focus); outline-offset: 3px`. Jangan pernah `outline: none` tanpa pengganti.
- Skip-to-content link di posisi pertama tab order.
- Semua gambar punya `alt` deskriptif; gambar dekoratif `alt=""`.
- Accordion timeline: `aria-expanded`, `aria-controls`, keyboard `Enter`/`Space`.
- Marquee: duplikat konten `aria-hidden`, konten asli tetap terbaca screen reader.
- Target sentuh minimal 44×44px di mobile.

---

## 8. Responsif

| Breakpoint | Lebar | Perubahan Kunci |
|---|---|---|
| `sm` | < 640px | 1 kolom. Hero: "Hello" di atas, portrait di bawah (tidak overlap). Stat jadi baris horizontal. Timeline: tags turun ke baris kedua |
| `md` | 640–1024px | 2 kolom. About: kartu tengah full-width di bawah teks. Works/Blog: 2 kolom |
| `lg` | 1024–1440px | Layout penuh sesuai desain |
| `xl` | > 1440px | Konten max-width 1440px, tapi marquee & CTA banner tetap **full-bleed** |

**Catatan mobile:** ukuran display "Hello" tetap dominan (`16vw`) — jangan dikecilkan berlebihan, itu identitas halaman. Portrait di mobile pakai crop 4:5, bukan cutout.

---

## 9. Rencana Implementasi

| Fase | Deliverable | Estimasi |
|---|---|---|
| **0. Setup** | Next 15 + TS + Tailwind v4 + Biome, font, design token di `globals.css`, komponen UI dasar | 0.5 hari |
| **1. Layout & Nav** | Root layout, Nav (scroll behavior + mobile overlay), Footer, SmoothScroll provider, custom cursor | 1 hari |
| **2. Hero** | Hero lengkap: split-text, cutout portrait, counter, parallax | 1 hari |
| **3. About + Marquee** | About 3 kolom, SVG path animation, badge rotasi, marquee velocity-coupled | 1.5 hari |
| **4. Experience + CTA** | Timeline expandable, hover micro-interactions, CTA banner parallax | 1 hari |
| **5. Works + Blog** | Grid kartu, hover states, MDX loader + Zod schema, halaman list | 1.5 hari |
| **6. Halaman detail** | `/work/[slug]`, `/blog/[slug]`, reading progress, shared element transition | 1.5 hari |
| **7. Integrasi** | Cal.com embed, contact form + Resend + rate limit, analytics | 1 hari |
| **8. Polish** | Reduced-motion pass, audit a11y, Lighthouse tuning, OG images, SEO, cross-browser | 1.5 hari |

**Total ≈ 10.5 hari kerja.**

### Definition of Done (per section)

- [ ] Sesuai desain di 3 breakpoint (375 / 768 / 1440)
- [ ] Animasi masuk & hover berfungsi, mengambil token dari `lib/motion.ts`
- [ ] `prefers-reduced-motion` diuji dan berperilaku benar
- [ ] Keyboard-navigable, focus ring terlihat
- [ ] Tidak ada CLS saat load
- [ ] Tidak ada `'use client'` yang tidak perlu

---

## 10. Aset yang Dibutuhkan

| Aset | Spesifikasi | Catatan |
|---|---|---|
| Portrait hero | PNG transparan (cutout), ≥ 2000px tinggi, grayscale | **Kritis** — komposisi hero bergantung penuh pada ini |
| Foto About (2) | Grayscale, rasio 1:1 dan 4:5 | |
| Thumbnail karya | 8–12 buah, 4:3, warna muted, ≥ 1600px | Untuk marquee & grid |
| Gambar case study | 5–8 gambar per proyek | |
| Cover blog | 3–6 buah, 3:2 | |
| Foto CTA banner | Gelap, landscape, ≥ 2400px | |
| Logo klien | SVG monokrom | Untuk label "For [klien]" |
| Logo/asterisk | SVG | Favicon + nav |
| General Sans | `.woff2` variable dari Fontshare | Self-host di `public/fonts/` |

---

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Lenis + `useScroll` desync → animasi tersendat | Tinggi | Satu RAF loop bersama; uji di Safari & Firefox sejak fase 1 |
| Bundle membengkak karena GSAP + Motion | Sedang | GSAP hanya untuk 1 section, `dynamic({ ssr: false })`; ukur tiap fase |
| Animasi berat di mobile mid-range | Tinggi | Nonaktifkan parallax & custom cursor di `< lg`, `syncTouch: false`, uji di device fisik |
| Cutout portrait tidak tersedia | Tinggi | Fallback: foto persegi dengan mask gradient — siapkan varian layout sejak awal |
| Terlalu banyak animasi → terasa lambat | Sedang | Terapkan §5.3 ketat; review "satu focal animation per section" di akhir tiap fase |
| Font berbayar tidak dibeli | Rendah | General Sans sudah jadi baseline, bukan darurat |

---

## Lampiran A — Ringkasan Dependency

```jsonc
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "motion": "^12",
    "lenis": "^1",
    "gsap": "^3",
    "clsx": "^2",
    "tailwind-merge": "^3",
    "zod": "^4",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^5",
    "resend": "^4",
    "@react-email/components": "^0",
    "@calcom/embed-react": "^1",
    "@upstash/ratelimit": "^2",
    "@upstash/redis": "^1",
    "@vercel/analytics": "^1",
    "@vercel/speed-insights": "^1",
    "next-mdx-remote": "^5",
    "rehype-pretty-code": "^0",
    "remark-gfm": "^4",
    "geist": "^1"
  },
  "devDependencies": {
    "typescript": "^5.7",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "@biomejs/biome": "^2",
    "@next/bundle-analyzer": "^15",
    "plaiceholder": "^3"
  }
}
```

---

## Lampiran B — Keputusan yang Perlu Konfirmasi

1. **Konten:** apakah D.Nova ini persona fiktif (portfolio template) atau data asli? Ini menentukan apakah kita butuh copywriting nyata atau placeholder.
2. **Font:** pakai General Sans (gratis) atau beli PP Neue Montreal (~$50–150)?
3. **CMS:** MDX file-based (v1) sudah cukup, atau langsung Sanity karena konten akan sering diupdate non-teknis?
4. **Booking:** Cal.com atau Calendly? (PRD ini asumsi Cal.com — gratis, self-hostable, embed lebih rapi)
5. **Aset foto:** sudah ada, atau perlu pakai stock/AI-generated dulu sebagai placeholder?
