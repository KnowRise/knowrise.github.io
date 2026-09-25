/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage (project hfvtjobqcxeslpubyajq)
      { protocol: 'https', hostname: 'hfvtjobqcxeslpubyajq.supabase.co' },
      // Legacy GitHub-hosted assets (migrasi bertahap)
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      // Admin boleh tempel URL gambar eksternal apa pun (cover/blog/dll)
      { protocol: 'https', hostname: '**' },
    ],
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