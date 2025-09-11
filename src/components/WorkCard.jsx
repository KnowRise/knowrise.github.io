export default function WorkCard({ work, direction }) {
  const isRightImage = direction === 'right';

  return (
    <div 
      data-aos={isRightImage ? "fade-left" : "fade-right"}
      className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16"
    >
      {/* BAGIAN GAMBAR */}
      <div className={`w-full md:w-1/2 rounded-lg overflow-hidden shadow-lg ${isRightImage ? 'md:order-2' : 'md:order-1'}`}>
        <img src={work.imageSrc} alt={`Cover for ${work.title}`} className="w-full object-cover" />
      </div>

      {/* BAGIAN TEKS */}
      <div className={`w-full md:w-1/2 ${isRightImage ? 'md:order-1' : 'md:order-2'}`}>
        <h3 className="text-[24px] font-bold text-white mb-3">{work.title}</h3>
        <p className="text-gray-300 mb-4">{work.description}</p>
        
        {/* BAGIAN TAGS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {work.tags.map((tag) => (
            <span key={tag} className="bg-green-800/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <a 
          href={work.workLink}
          target="blank" 
          rel="noopener noreferrer"
          className="mt-2 font-semibold text-green-500 hover:text-green-300 hover:border-b transition"
        >
          Lihat Detail &rarr;
        </a>
      </div>
    </div>
  );
}