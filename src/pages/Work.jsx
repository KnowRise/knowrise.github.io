import WorkCard from '../components/WorkCard';
import works from '../assets/json/works.json';

export default function Work() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-16 text-white">
        My Projects
      </h1>
      
      <div>
        {works.map((work, index) => (
          <WorkCard
            key={work.id}
            work={work}
            direction={index % 2 === 0 ? 'right' : 'left'} // Jika genap, gambar di kanan. Jika ganjil, di kiri.
          />
        ))}
      </div>
    </div>
  );
}