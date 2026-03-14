import type { WorkCardProps } from '../types';

export default function WorkCard({ work, direction }: WorkCardProps) {
  const isRightImage = direction === 'right';

  return (
    <div
      className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-14"
      data-aos={isRightImage ? 'fade-left' : 'fade-right'}
    >
      {/* Image */}
      <div
        className={`w-full md:w-1/2 rounded-xl overflow-hidden border shadow-lg ${
          isRightImage ? 'md:order-2' : 'md:order-1'
        }`}
        style={{ borderColor: 'var(--card-border)' }}
      >
        <img
          src={work.image_url}
          alt={`Cover for ${work.title}`}
          className="w-full object-cover"
        />
      </div>

      {/* Text */}
      <div className={`w-full md:w-1/2 ${isRightImage ? 'md:order-1' : 'md:order-2'}`}>
        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          {work.title}
        </h3>
        <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {work.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'var(--green-tag-bg)', color: 'var(--green-tag-text)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={work.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold transition-opacity hover:opacity-75"
          style={{ color: 'var(--green)' }}
        >
          Lihat Detail →
        </a>
      </div>
    </div>
  );
}
