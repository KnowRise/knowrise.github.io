import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { marked } from 'marked';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

// Static fallback
const STATIC_PROFILE: Profile = {
  id: 'static',
  full_name: 'Muhammad Rifaa Siraajuddin Sugandi',
  tagline: 'Backend Developer',
  bio:
    'A 2025 graduate from SMKN 2 Sukabumi with a specialization in Software Engineering. As a Junior Backend Developer at a local startup, I\'m actively involved in building and maintaining efficient and reliable backend systems.\n\nI am a curious and persistent individual who is genuinely passionate about problem-solving. I believe that the best solutions come from a deep understanding of the core issue, and I enjoy the process of breaking down complex challenges into manageable parts. This methodical approach drives my work and my commitment to continuous learning.',
  photo_url: '/img/MyFoto.png',
  cv_url: '/cv.pdf',
  instagram_url: 'https://www.instagram.com/rifaa_srjdn/',
  github_url: 'https://github.com/KnowRise',
};

export default function Home() {
  const [profile, setProfile] = useState<Profile>(STATIC_PROFILE);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data }) => { if (data) setProfile(data as Profile); });
  }, []);

  return (
    <div className="flex flex-col gap-10 py-14 page-in">
      {/* Hero */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-8">
        {/* Text */}
        <div className="flex flex-col gap-4 md:max-w-[70%]">
          <div>
            <h1 className="text-2xl md:text-4xl font-montserrat leading-snug" style={{ color: 'var(--text-primary)' }}>
              {profile.full_name}
            </h1>
            <h2 className="text-sm md:text-xl font-montserrat italic mt-1" style={{ color: 'var(--green)' }}>
              {profile.tagline}
            </h2>
          </div>
          
          <div 
            className="prose prose-sm md:prose-base max-w-none text-[var(--text-secondary)] prose-a:text-[var(--green)] prose-a:font-bold hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: marked.parse(profile.bio, { async: false }) as string }}
          />

          {/* Social + CV */}
          <div className="flex flex-wrap gap-3 items-center mt-2">
            {profile.instagram_url && (
              <a
                href={profile.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all hover:border-[var(--green)] hover:text-[var(--green)]"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
              >
                <FontAwesomeIcon icon={faInstagram} />
                Instagram
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all hover:border-[var(--green)] hover:text-[var(--green)]"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
              >
                <FontAwesomeIcon icon={faGithub} />
                GitHub
              </a>
            )}
            {profile.cv_url && (
              <a
                href={profile.cv_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-montserrat transition-opacity hover:opacity-85"
                style={{ background: 'var(--btn-active)', color: 'var(--btn-active-text)' }}
              >
                ⬇ Download CV
              </a>
            )}
          </div>
        </div>

        {/* Photo */}
        <div
          className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 border-2"
          style={{ borderColor: 'var(--green)' }}
        >
          <img
            src={profile.photo_url ?? '/img/MyFoto.png'}
            alt={profile.full_name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
