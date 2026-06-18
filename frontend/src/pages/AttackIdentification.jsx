import { useEffect, useState } from 'react'
import { getAttacks, getArpTable, getIdsLogs, getFirewallLogs } from '../api'
import Header from '../components/common/Header'
import SeverityBadge from '../components/common/SeverityBadge'

const ICONS = {
  arp: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  dns: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  scan: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  wifi: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
}

const SEVERITY_BORDER = {
  critical: 'border-red-500/40 hover:border-red-500/60',
  high:     'border-orange-500/40 hover:border-orange-500/60',
  medium:   'border-amber-500/40 hover:border-amber-500/60',
}
const SEVERITY_ICON_BG = {
  critical: 'bg-red-500/15 text-red-400',
  high:     'bg-orange-500/15 text-orange-400',
  medium:   'bg-amber-500/15 text-amber-400',
}

function AttackCard({ attack, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`card w-full text-left p-5 transition-all duration-200 border ${SEVERITY_BORDER[attack.severity]}
        ${active ? 'ring-2 ring-offset-1 ring-offset-slate-900 ring-cyan-500/50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl flex-shrink-0 ${SEVERITY_ICON_BG[attack.severity]}`}>
          {ICONS[attack.icon]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{attack.name}</h3>
            <SeverityBadge severity={attack.severity} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{attack.layer}</p>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{attack.description}</p>
        </div>
      </div>
    </button>
  )
}

function AttackDetail({ attack }) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-3 rounded-xl ${SEVERITY_ICON_BG[attack.severity]}`}>
          {ICONS[attack.icon]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{attack.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <SeverityBadge severity={attack.severity} />
            <span className="text-xs text-slate-500">{attack.layer}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{attack.description}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Observed Symptoms</h4>
          <ul className="space-y-1.5">
            {attack.symptoms.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Evidence & Justification</h4>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
            {attack.justification}
          </div>
        </div>

        {attack.evidence && Object.keys(attack.evidence).length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Technical Evidence</h4>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-xs space-y-1">
              {Object.entries(attack.evidence).map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-cyan-500 min-w-0 flex-shrink-0">{k.replace(/_/g, ' ')}:</span>
                  <span className="text-slate-300 break-all">{JSON.stringify(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ARPTable({ entries }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white">ARP Table Analysis</h3>
        <p className="text-xs text-slate-400 mt-0.5">Internal LAN — 192.168.10.0/24</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">IP Address</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">MAC Address</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {entries.map((row, i) => (
              <tr key={i} className={`hover:bg-slate-700/20 transition-colors ${row.status === 'suspicious' ? 'bg-red-500/5' : ''}`}>
                <td className="px-5 py-3 font-mono text-xs text-slate-300">{row.ip}</td>
                <td className={`px-5 py-3 font-mono text-xs ${row.status === 'suspicious' ? 'text-red-400 font-semibold' : 'text-slate-300'}`}>
                  {row.mac}
                  {row.status === 'suspicious' && (
                    <span className="ml-2 text-red-500">← Foreign OUI</span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">{row.role}</td>
                <td className="px-5 py-3">
                  {row.status === 'suspicious' ? (
                    <span className="badge-critical">SUSPICIOUS</span>
                  ) : (
                    <span className="badge-low">LEGITIMATE</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 bg-red-500/5 border-t border-red-500/20">
        <p className="text-xs text-red-400">
          ⚠ 192.168.10.10 → FF:EE:DD:CC:BB:AA uses a foreign OUI (FF:EE:DD:…), inconsistent with
          the corporate AA:BB:CC:DD:… prefix. Indicates ARP cache poisoning.
        </p>
      </div>
    </div>
  )
}

function LogViewer({ logs, title }) {
  const severityColor = {
    critical: 'text-red-400',
    high:     'text-orange-400',
    medium:   'text-amber-400',
    low:      'text-emerald-400',
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="log-entry">
            <span className="text-slate-600 font-mono text-xs flex-shrink-0">{log.timestamp.split(' ')[1]}</span>
            <SeverityBadge severity={log.severity} />
            <div className="flex-1 min-w-0">
              <p className={`font-mono text-xs ${severityColor[log.severity] ?? 'text-slate-300'}`}>{log.type}</p>
              <p className="text-slate-400 text-xs mt-0.5 break-all">{log.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AttackIdentification() {
  const [attacks,  setAttacks]  = useState([])
  const [arpTable, setArpTable] = useState([])
  const [idsLogs,  setIdsLogs]  = useState([])
  const [active,   setActive]   = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([getAttacks(), getArpTable(), getIdsLogs()])
      .then(([a, t, l]) => {
        setAttacks(a.data)
        setArpTable(t.data)
        setIdsLogs(l.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-cyan-400 text-sm animate-pulse">Loading attack data…</div>
    </div>
  )

  const selectedAttack = attacks[active]

  return (
    <div className="animate-fade-in">
      <Header
        title="Attack Identification"
        subtitle="Part A — Identify and justify at least 3 attack types using logs and symptoms"
        badge="4 Attacks Found"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Attack list */}
        <div className="lg:col-span-2 space-y-3">
          {attacks.map((attack, i) => (
            <AttackCard key={attack.id} attack={attack} active={i === active} onClick={() => setActive(i)} />
          ))}
        </div>

        {/* Attack detail */}
        <div className="lg:col-span-3">
          {selectedAttack && <AttackDetail attack={selectedAttack} />}
        </div>
      </div>

      {/* ARP Table */}
      <div className="mb-6">
        <ARPTable entries={arpTable} />
      </div>

      {/* IDS Logs */}
      <LogViewer logs={idsLogs} title="IDS Alert Log — All Events" />
    </div>
  )
}
