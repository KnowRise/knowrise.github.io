/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage bucket "media" (project hfvtjobqcxeslpubyajq)
      { protocol: 'https', hostname: 'hfvtjobqcxeslpubyajq.supabase.co' },
      // Legacy GitHub-hosted assets (migrasi bertahap)
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
    // Host tetap dua di atas, tapi optimizer tetap dikunci supaya file
    // yang tidak terduga tidak bisa menyajikan HTML/SVG yang dieksekusi
    // sebagai bagian dari origin kita sendiri.
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