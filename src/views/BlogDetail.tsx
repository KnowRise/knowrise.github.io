'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export default function BlogDetail({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setNotFound(false);
      if (!supabase || !slug) { setNotFound(true); setLoading(false); return; }
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      if (data) setPost(data as BlogPost);
      else setNotFound(true);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-14 page-in animate-pulse space-y-4 max-w-2xl mx-auto">
        <div className="h-3 w-1/4 rounded-full" style={{ background: 'var(--tag-bg)' }} />
        <div className="h-6 w-3/4 rounded-full" style={{ background: 'var(--tag-bg)' }} />
        <div className="h-3 w-1/3 rounded-full" style={{ background: 'var(--tag-bg)' }} />
        <div className="space-y-2 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 rounded-full" style={{ background: 'var(--tag-bg)', width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="py-14 text-center page-in">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold font-montserrat mb-2" style={{ color: 'var(--text-primary)' }}>
          Artikel tidak ditemukan
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Mungkin artikel ini belum dipublish atau slug-nya salah.
        </p>
        <Link
          href="/blog"
          className="text-sm font-semibold"
          style={{ color: 'var(--green)' }}
        >
          ← Kembali ke Blog
        </Link>
      </div>
    );
  }

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  const wordCount = post.content.split(' ').length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const htmlContent = marked.parse(post.content) as string;

  return (
    <article className="py-14 page-in max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm mb-6 transition-colors hover:text-[var(--green)]"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Kembali ke Blog
      </Link>

      {/* Cover image */}
      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="w-full rounded-xl mb-6 border"
          style={{ borderColor: 'var(--card-border)' }}
        />
      )}

      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold font-montserrat mb-3 leading-snug" style={{ color: 'var(--text-primary)' }}>
        {post.title}
      </h1>

      <div className="flex flex-wrap gap-3 items-center mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        {date && <span>{date}</span>}
        <span>·</span>
        <span>{readTime} menit baca</span>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--green-tag-bg)', color: 'var(--green-tag-text)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Body — rendered Markdown */}
      <div
        className="prose prose-sm max-w-none leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
