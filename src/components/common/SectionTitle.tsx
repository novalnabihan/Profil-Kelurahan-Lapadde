interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({ children, subtitle, align = 'left' }: SectionTitleProps) {
  return (
    <div className={`mb-8 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-[22px] font-semibold text-[#1a202c] mb-1.5">{children}</h2>
      {subtitle && <p className="text-[14px] text-[#718096]">{subtitle}</p>}
    </div>
  );
}