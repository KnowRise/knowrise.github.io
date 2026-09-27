/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage bucket "media" (project hfvtjobqcxeslpubyajq).
      // Satu-satunya host eksternal yang boleh dilayani optimizer. Host
      // lain harus diunggah lewat FileUploader, bukan ditempel URL-nya.
      { protocol: 'https', hostname: 'hfvtjobqcxeslpubyajq.supabase.co' },
      // raw.githubusercontent.com sengaja tidak ada. Dulu dipakai untuk
      // foto profil cadangan; sekarang path-nya lokal (/img/MyFoto.png
      // dari folder public), jadi tidak ada alasan lagi membiarkannya
      // masuk daftar origin yang diizinkan.
    ],
    // Origin sudah dikunci ke satu host di atas. Lapisan tambahan ini
    // supaya file yang tidak terduga tidak bisa menyajikan HTML/SVG yang
    // dieksekusi sebagai bagian dari origin kita sendiri.
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: '/work',
        destination: '/projects',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;