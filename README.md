# Japanese Club Manager

Website manajemen keuangan & inventaris untuk Club Jepang yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Prisma.

## Fitur

### 1. Dashboard
- Ringkasan total barang dan harga
- Total pemasukan
- Perhitungan sisa saldo
- Data terbaru barang dan pemasukan

### 2. Manajemen Barang (`/barang`)
- CRUD (Create, Read, Update, Delete) untuk daftar barang
- Input: Produk, Ukuran, Quantity, Nominal
- Auto-calculate Fix Prize (Quantity × Nominal)
- Fitur pencarian dan filter
- Expandable rows untuk Sub Items
- Total harga keseluruhan

### 3. Manajemen Pemasukan (`/pemasukan`)
- CRUD untuk data pemasukan/donasi
- Input: Tanggal, Nama Penyumbang, Keterangan, Nominal
- Keterangan: "Dalam Club" / "Orang Luar Club"
- Fitur pencarian
- Total pemasukan otomatis

### 4. Sub Items
- Detail kebutuhan per barang (contoh: Shaved Ice → alat penghalus es, sirup, cup es krim, sendok es krim)
- Expandable rows di halaman barang

## Teknologi

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite dengan Prisma ORM
- **Icons**: Lucide React
- **Charts**: Recharts (untuk fitur bonus)

## Setup & Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Langkah-langkah

1. **Clone/Download project**
   ```bash
   cd japanese-club-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   ```
   http://localhost:3000
   ```

## Database Schema

### Barang
- `id`: Primary key
- `produk`: Nama produk
- `ukuran`: Satuan (ml, g, kg, dll)
- `quantity`: Jumlah
- `nominal`: Harga satuan
- `fixPrize`: Total harga (auto-calculated)
- `createdAt`, `updatedAt`: Timestamps

### SubItem
- `id`: Primary key
- `barangId`: Foreign key ke Barang
- `namaSubItem`: Nama detail kebutuhan
- `createdAt`, `updatedAt`: Timestamps

### Pemasukan
- `id`: Primary key
- `tanggal`: Tanggal pemasukan
- `penyumbang`: Nama penyumbang
- `keterangan`: Enum (DalamClub, OrangLuarClub)
- `nominal`: Jumlah uang
- `createdAt`, `updatedAt`: Timestamps

## Struktur Project

```
src/
├── app/
│   ├── api/
│   │   ├── barang/
│   │   └── pemasukan/
│   ├── barang/
│   ├── pemasukan/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BarangTable.tsx
│   ├── Navigation.tsx
│   └── PemasukanTable.tsx
└── lib/
    └── prisma.ts
```

## API Endpoints

### Barang
- `GET /api/barang` - Ambil semua barang
- `POST /api/barang` - Tambah barang baru
- `PUT /api/barang/[id]` - Update barang
- `DELETE /api/barang/[id]` - Hapus barang

### Pemasukan
- `GET /api/pemasukan` - Ambil semua pemasukan
- `POST /api/pemasukan` - Tambah pemasukan baru
- `PUT /api/pemasukan/[id]` - Update pemasukan
- `DELETE /api/pemasukan/[id]` - Hapus pemasukan

## Fitur Bonus (Opsional)

- Export ke CSV/Excel
- Chart ringkasan pemasukan dengan Recharts
- Dark mode toggle
- Responsive design untuk mobile

## Development

### Menjalankan dalam mode development
```bash
npm run dev
```

### Build untuk production
```bash
npm run build
npm start
```

### Database commands
```bash
npx prisma studio  # GUI untuk database
npx prisma db push # Push schema ke database
npx prisma generate # Generate Prisma client
```

## Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## Lisensi

MIT License
