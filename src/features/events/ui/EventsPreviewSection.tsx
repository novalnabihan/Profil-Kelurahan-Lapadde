import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  eventDate: Date;
}

interface EventsPreviewSectionProps {
  events: Event[];
}

export default function EventsPreviewSection({ events }: EventsPreviewSectionProps) {
  const displayEvents = events.slice(0, 3);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[22px] font-semibold text-[#1a202c]">Berita & Kegiatan</h2>
          <Link
            href="/kegiatan"
            className="text-[14px] text-[#8b9474] font-medium hover:text-[#6d7558] transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] gap-5">
          {displayEvents.map((event, index) => (
            <Link
              key={event.id}
              href={`/kegiatan/${event.slug}`}
              className={`bg-[#f8f9fa] rounded-md overflow-hidden hover:shadow-lg transition-all ${
                index === 0 ? 'lg:row-span-2' : ''
              }`}
            >
              <div className={`p-6 ${index === 0 ? 'lg:p-7' : ''}`}>
                <div className="text-[12px] text-[#8b9474] font-medium mb-2.5">
                  {new Date(event.eventDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <h3
                  className={`font-semibold text-[#1a202c] leading-snug mb-2.5 ${
                    index === 0 ? 'text-[20px] lg:text-[20px]' : 'text-[17px]'
                  }`}
                >
                  {event.title}
                </h3>
                <p className="text-[14px] text-[#4a5568] leading-relaxed line-clamp-3">
                  {event.content.substring(0, 150)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}