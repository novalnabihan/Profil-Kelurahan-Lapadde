// import Link from 'next/link';

// const services = [
//   {
//     icon: '📋',
//     title: 'Pengaduan Warga',
//     description: 'Sampaikan keluhan atau aspirasi Anda',
//     href: '/alur-pengaduan',  // ← Update
//   },
//   {
//     icon: '📄',
//     title: 'Surat Pengantar',
//     description: 'Ajukan pembuatan surat keterangan',
//     href: '/denah-kantor',  // ← Update
//   },
//   {
//     icon: '📊',
//     title: 'Data & Statistik',
//     description: 'Lihat data kependudukan dan wilayah kelurahan',
//     href: '/#peta',
//   },
// ];

// export default function ServicesSection() {
//   return (
//     <section className="py-14 bg-[#f8f9fa]">
//       <div className="max-w-[1140px] mx-auto px-6">
//         <h2 className="text-[22px] font-semibold text-[#1a202c] mb-8">Layanan Kelurahan</h2>
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr] gap-4">
//           {services.map((service) => (
//             <Link
//               key={service.title}
//               href={service.href}
//               className="bg-white p-6 rounded-md border-l-[3px] border-[#8b9474] hover:shadow-md hover:translate-x-0.5 transition-all"
//             >
//               <span className="block text-[28px] mb-3">{service.icon}</span>
//               <h3 className="text-[16px] font-semibold text-[#1a202c] mb-1.5">
//                 {service.title}
//               </h3>
//               <p className="text-[14px] text-[#718096] leading-relaxed">
//                 {service.description}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }