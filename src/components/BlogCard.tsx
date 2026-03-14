import Link from 'next/link';
import type { BlogCardProps } from '../types';

export default function BlogCard({ post }: BlogCardProps) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  // rough read time estimate
  const wordCount = post.content.split(' ').length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      data-aos="fade-up"
    >
      {/* Meta row */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {date && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</span>
        )}
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--green-tag-bg)', color: 'var(--green-tag-text)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="font-bold font-montserrat mb-2 group-hover:text-[var(--green)] transition-colors" style={{ color: 'var(--text-primary)' }}>
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          {post.excerpt}
        </p>
      )}

      <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>
        Baca selengkapnya ({readTime} menit) →
      </span>
    </Link>
  );
}
