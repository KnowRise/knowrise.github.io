export default function TimelineItem({
  title,
  period,
  company,
  description,
  direction,
}) {
  const isRight = direction === "right";
  return (
    <div className="relative w-full">
      {/* KIRI: Bagian Garis dan Titik */}
      <div className="absolute flex items-center justify-center inset-0">
        <div className="absolute w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="w-px h-full bg-gray-600"></div>
      </div>

      {/* KANAN: Bagian Konten */}
      <div
        data-aos={isRight ? "fade-left" : "fade-right"}
        className={`bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-5/12 ${
          isRight ? "md:ml-auto" : "md:mr-auto"
        } ${isRight ? "text-left" : "md:text-right"}`}
      >
        <p className="text-green-400 text-sm font-semibold">{period}</p>
        <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
        <p className="text-gray-400 text-sm">{company}</p>
        <p className="text-gray-300 mt-3">{description}</p>
      </div>
    </div>
  );
}
