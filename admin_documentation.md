# Admin Panel Documentation

Panduan ini berisi cara menggunakan sistem Admin Panel untuk mengelola dan mengatur konten (*Content Management System / CMS*) di dalam portofolio kamu.

## 1. Setup Supabase Authentication & Security

Supabase menggunakan Authentication bawaan yang terintegrasi langsung dengan Database RLS (Row Level Security) yang sudah kita set-up di file `supabase_setup.sql`.

### Cara Setup Pertama Kali di Supabase Dashboard:
1. **Buka Project Supabase Kamu:** Masuk ke dashboard project kamu.
2. **Setup Email Auth:** 
   - Di menu sebelah kiri, masuk ke **Authentication** -> **Providers**.
   - Pastikan **Email provider** diaktifkan (Enable Email provider).
   - Matikan (Disable) "Confirm email" jika kamu mau langsung bisa login tanpa verifikasi email dulu.
3. **Buat Akun Admin Master:**
   - Di menu **Authentication** -> **Users**, klik tombol hijau **Add user** -> **Create new user**.
   - Masukkan Email kamu dan password super admin yang kamu mau.
   - Akun ini akan langsung berstatus *Authenticated* dan otomatis diberi izin untuk semua operasi *insert/update/delete* berdasarkan rincian Policies SQL kita.

---

## 2. Autentikasi Panel Admin (Akses /admin)

Panel admin dilindungi dengan dua lapisan keamanan: autentikasi Supabase dan *Query Parameter Secret*.
1. **URL Rahasia:** Kamu **WAJIB** mengakses halaman login melalui URL **`/admin?admin`** (tanpa spasi dan tambahan apapun di value-nya).
2. Jika kamu (atau peretas) hanya mengakses `/admin` tanpa embel-embel `?admin`, lalu mencoba memasukkan kredensial yang kebetulan benar, sistem akan memblokir prosesnya secara lokal dengan pesan "Email atau Password Salah" untuk mengecohnya sehingga takkan pernah menghubungi database.
3. **Login:** Jika kamu mengakses dari `/admin?admin`, pengisian Email dan Password akan diteruskan ke server Supabase untuk login yang sah asalkan kamu memasukkan kredensial milik akun master yang kamu buat di langkah sebelumnya.
Bagian profile ini bersifat *Single Row* (hanya satu data).
- **Edit Profile:** Klik Edit di panel admin Profile, ubah isi teks (seperti tagline, bio, foto URL, dll), lalu pencet Save.
- Data ini akan langsung merefleksikan tampilan paling atas di Home Page.

---

## 2. Mengatur Urutan (Sort Order)
Beberapa komponen seperti **Experience (Work & Education)**, **Skills**, dan **Work (Projects)** memiliki fitur `sort_order`. 

- **Apa itu `sort_order`?:** Ini adalah angka yang menentukan prioritas kemunculan data. Angka yang **lebih kecil** akan tampil lebih dulu/di paling atas.
- **Auto Order:** Admin panel tidak sepenuhnya "auto order" dalam memindahkan data ke atas/bawah layaknya drag-and-drop. Kamu harus menentukan urutannya lewat input "Urutan (Sort Order)". 
  - *Contoh:* Kalau pengalaman kerja X dikasih `sort_order: 1` dan pengalaman kerja Y dikasih `sort_order: 2`, maka yang muncul paling atas di timeline adalah X.
- **Hapus Data:** Saat sebuah `Experience` atau `Skill` dihapus dengan tombol *Delete*, Supabase akan menghapusnya dari database. Kamu bebas mengisi `sort_order` secara manual (misalnya 1, 2, 3), dan kalau nomor 2 dihapus, tidak akan error, data di tampilan user akan otomatis mengurutkan 1 lalu 3.

---

## 3. Blog System
Blog menggunakan status *Published* & *Is Published* boolean.
- **Create:** Tulis artikel dalam Markdown. Kamu wajib mengatur `slug` (URL unik blog, misal: `belajar-backend-2026`).
- **Publish Date:** Tanggal tayang blog akan tercatat jika kamu mencentang *Publish* artikel tersebut. 
- **Tags:** Tulislah tags yang dipisahkan oleh koma (misal: `Nextjs, Supabase, React`). Admin panel akan otomatis merubahnya menjadi Array bentuk Tags.

---

## 4. Contact Messages
Halaman `/admin` akan memiliki menu Inbox.
- Pesan masuk (*contact messages*) dari pengunjung web yang mengisi form di halaman *Contact* akan masuk ke sini.
- Status dibaca bisa dilihat, dan kamu bisa menghapus isian inbox yang sudah usang.
