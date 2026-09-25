'use client';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PaginationControls from '../components/PaginationControls';
import SearchInput from '../components/SearchInput';
import { usePagination } from '../hooks/usePagination';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const pg = usePagination(6);
  const debounced = useDebouncedValue(search, 350);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('blogs')
      .select('tags')
      .eq('is_published', true)
      .then(({ data }) => {
        const all = Array.from(new Set((data || []).flatMap((r) => (r as BlogPost).tags))).sort();
        setTags(all);
      });
  }, []);

  useEffect(() => {
    if (pg.page !== 1) pg.resetPage();
  }, [debounced, activeTag]);

  useEffect(() => { fetchPosts(); }, [pg.page, debounced, activeTag]);

  async function fetchPosts() {
    setLoading(true);
    if (supabase) {
      let query: any = supabase.from('blogs').select('*', { count: 'exact' }).eq('is_published', true);
      if (activeTag !== 'All') query = query.contains('tags', [activeTag]);
      const term = debounced.trim();
      if (term) {
        const esc = term.replace(/[%_]/g, (m) => '\\' + m);
        query = query.or(`title.ilike.%${esc}%,excerpt.ilike.%${esc}%`);
      }
      const { data, count } = await query.order('published_at', { ascending: false }).range(pg.from, pg.to);
      setPosts((data || []) as BlogPost[]);
      if (count !== null) pg.setTotal(count);
    } else {
      setPosts([]);
      pg.setTotal(0);
    }
    setLoading(false);
  }

  const allTags = ['All', ...tags];

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
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); pg.setPage(1); }}
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

      {!loading && (
        <div className="mb-8">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari tulisan..." className="max-w-md mx-auto" />
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="list" count={3} />
      ) : posts.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-4">✍️</p>
          {search.trim() || activeTag !== 'All'
            ? <p>Tidak ada hasil untuk pencarian ini.</p>
            : <p>Belum ada postingan untuk saat ini. Nantikan tulisan pertama!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
          <PaginationControls page={pg.page} pageSize={pg.pageSize} total={pg.total} onChange={pg.setPage} />
        </div>
      )}
    </div>
  );
}