export default function StatCard({ label, value, sub, color = 'cyan', icon }) {
  const colors = {
    cyan:    'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    red:     'text-red-400  bg-red-500/10  border-red-500/20',
    orange:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
    amber:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }
  const c = colors[color] ?? colors.cyan

  return (
    <div className="card p-5 flex items-start gap-4">
      {icon && (
        <div className={`p-2.5 rounded-xl border ${c} flex-shrink-0`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-3xl font-bold mt-0.5 ${c.split(' ')[0]}`}>{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
