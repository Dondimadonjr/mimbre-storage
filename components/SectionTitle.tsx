interface SectionTitleProps {
  title: string
  subtitle?: string
  id?: string
}

export default function SectionTitle({
  title,
  subtitle,
  id,
}: SectionTitleProps) {
  return (
    <div id={id} className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-text-secondary">{subtitle}</p>}
    </div>
  )
}
