export default function MainFooter() {
  return (
    <footer className="bg-[#2d3748] text-white py-12 mt-16">
      <div className="max-w-[1140px] mx-auto px-6 text-center">
        <h3 className="text-[17px] font-semibold mb-2">Kelurahan Lapadde</h3>
        <p className="text-[14px] opacity-88 mb-1.5">Kecamatan Batam Kota, Kota Batam</p>
        <p className="text-[14px] opacity-88">Provinsi Kepulauan Riau</p>
        
        <div className="mt-7 pt-5 border-t border-white/10">
          <p className="text-[13px] opacity-70">
            &copy; {new Date().getFullYear()} Kelurahan Lapadde. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}