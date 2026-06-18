import { useEffect, useState } from 'react'
import { getDefense } from '../api'
import Header from '../components/common/Header'

const LAYER_COLORS = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    icon: 'bg-blue-500/15' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400',  icon: 'bg-purple-500/15' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'bg-emerald-500/15' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   icon: 'bg-amber-500/15' },
}

const LAYER_ICONS = {
  network: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  app: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  wireless: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  monitor: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
}

function MechanismCard({ mechanism, color }) {
  const c = LAYER_COLORS[color]

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h4 className={`text-sm font-semibold ${c.text}`}>{mechanism.name}</h4>
            <span className="badge-info text-xs">{mechanism.tool}</span>
          </div>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{mechanism.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {mechanism.mitigates.map((m, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DefenseLayerSection({ layer }) {
  const [expanded, setExpanded] = useState(true)
  const c = LAYER_COLORS[layer.color] ?? LAYER_COLORS.blue

  return (
    <div className={`card border ${c.border} overflow-hidden`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full px-6 py-5 flex items-center gap-4 text-left ${c.bg} hover:brightness-110 transition-all`}
      >
        <div className={`p-2.5 rounded-xl ${c.icon} ${c.text}`}>
          {LAYER_ICONS[layer.icon]}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold ${c.text}`}>{layer.layer}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{layer.mechanisms.length} security controls</p>
        </div>
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {layer.mechanisms.map((m, i) => (
            <MechanismCard key={i} mechanism={m} color={layer.color} />
          ))}
        </div>
      )}
    </div>
  )
}

function DefensePyramid() {
  const layers = [
    { label: 'Monitoring & Response',  desc: 'SIEM, IDS/IPS, NTA, DLP', color: '#f59e0b', width: '100%' },
    { label: 'Wireless Security',       desc: 'WPA3, 802.11w, NAC', color: '#10b981', width: '80%' },
    { label: 'Application Layer',       desc: 'DNSSEC, WAF, TLS, DAM', color: '#a855f7', width: '62%' },
    { label: 'Network Layer',           desc: 'DAI, VLANs, NGFW, IP Source Guard', color: '#06b6d4', width: '45%' },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Defense-in-Depth Model</h3>
      <div className="flex flex-col items-center gap-1.5">
        {layers.map((l, i) => (
          <div key={i} className="flex items-center gap-3" style={{ width: l.width, maxWidth: '100%' }}>
            <div
              className="flex-1 rounded-lg px-4 py-3 text-center transition-all hover:brightness-110"
              style={{ backgroundColor: l.color + '20', border: `1px solid ${l.color}40` }}
            >
              <p className="text-sm font-semibold" style={{ color: l.color }}>{l.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 text-center mt-4">
        Each layer independently blocks attack vectors — attacker must defeat all layers.
      </p>
    </div>
  )
}

export default function DefenseStrategy() {
  const [layers,  setLayers]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDefense().then(r => setLayers(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-cyan-400 text-sm animate-pulse">Loading defense data…</div>
    </div>
  )

  const totalControls = layers.reduce((s, l) => s + l.mechanisms.length, 0)

  return (
    <div className="animate-fade-in">
      <Header
        title="Defense Mechanism Design"
        subtitle="Part C — Multi-layer defense strategy with specific tools and technologies"
        badge="Part C"
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Defense Layers',   value: layers.length,  color: 'text-cyan-400' },
          { label: 'Total Controls',   value: totalControls,  color: 'text-emerald-400' },
          { label: 'Attacks Mitigated',value: 8,              color: 'text-purple-400' },
          { label: 'Coverage',         value: '100%',         color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <DefensePyramid />
        </div>

        {/* Attack-defense mapping */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Attack → Defense Mapping</h3>
          <div className="space-y-3">
            {[
              { attack: 'ARP Spoofing',             defenses: ['Dynamic ARP Inspection', 'DHCP Snooping', 'IP Source Guard', 'VLAN Segmentation'] },
              { attack: 'DNS Cache Poisoning',       defenses: ['DNSSEC', 'DNS over HTTPS/TLS', 'SIEM Correlation'] },
              { attack: 'External Port Scanning',    defenses: ['NGFW Rate-Limiting ACLs', 'IPS Signatures', 'IP Blacklisting'] },
              { attack: 'Wi-Fi Deauthentication',    defenses: ['WPA3-Enterprise', '802.11w MFP', 'Rogue AP Detection'] },
              { attack: 'Data Exfiltration',         defenses: ['DLP', 'DB Activity Monitor', 'Firewall Egress Rules'] },
              { attack: 'Credential Theft (Phishing)',defenses: ['TLS/mTLS', 'WAF', 'MFA'] },
            ].map(({ attack, defenses }) => (
              <div key={attack} className="flex items-start gap-3">
                <div className="w-1/3">
                  <span className="badge-critical text-xs">{attack}</span>
                </div>
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {defenses.map((d, i) => (
                    <span key={i} className="badge-info text-xs">{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {layers.map((layer, i) => (
          <DefenseLayerSection key={i} layer={layer} />
        ))}
      </div>
    </div>
  )
}
