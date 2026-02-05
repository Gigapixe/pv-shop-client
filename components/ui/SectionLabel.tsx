type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`flex justify-center items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest ${className}`}
    >
      <span className="relative before:content-[''] before:block before:w-3 before:h-0.5 before:bg-primary" />
      {children}
    </p>
  );
}
