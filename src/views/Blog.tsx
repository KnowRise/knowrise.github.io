import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('All');

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      if (supabase) {
        const { data } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        if (data) setPosts(data as BlogPost[]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Collect unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags)))];
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tags.includes(activeTag));

  return (
    <div className="py-14 page-in">
      <h1 className="text-3xl font-bold font-montserrat text-center mb-3" style={{ color: 'var(--text-primary)' }}>
        Blog
      </h1>
      <p className="text-center mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Tulisan tentang keseharian, engineering, dan hal-hal yang aku pelajari.
      </p>

      {/* Tag filter */}
      {!loading && allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{
                background: activeTag === tag ? 'var(--btn-active)' : 'var(--btn-inactive)',
                color: activeTag === tag ? 'var(--btn-active-text)' : 'var(--btn-inactive-text)',
                borderColor: activeTag === tag ? 'var(--btn-active)' : 'var(--card-border)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="list" count={3} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-4">✍️</p>
          <p>Belum ada postingan untuk saat ini. Nantikan tulisan pertama!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
