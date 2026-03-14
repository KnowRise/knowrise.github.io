import BlogDetail from '../../../src/views/BlogDetail';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
