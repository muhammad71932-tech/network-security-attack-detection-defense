export default function Header({ title, subtitle, badge }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {badge && (
        <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold">
          {badge}
        </span>
      )}
    </div>
  )
}
