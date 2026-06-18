import { useEffect, useState } from 'react'
import { getArchitecture } from '../api'
import Header from '../components/common/Header'

const VLAN_COLORS = {
  orange: { bg: 'bg-orange-500/15', border: 'border-orange-500/40', text: 'text-orange-400', dot: 'bg-orange-400' },
  blue:   { bg: 'bg-blue-500/15',   border: 'border-blue-500/40',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  red:    { bg: 'bg-red-500/15',    border: 'border-red-500/40',    text: 'text-red-400',    dot: 'bg-red-400' },
  green:  { bg: 'bg-emerald-500/15',border: 'border-emerald-500/40',text: 'text-emerald-400',dot: 'bg-emerald-400' },
  purple: { bg: 'bg-purple-500/15', border: 'border-purple-500/40', text: 'text-purple-400', dot: 'bg-purple-400' },
}

function CurrentArchDiagram() {
  return (
    <svg viewBox="0 0 500 480" className="w-full" style={{ maxHeight: 480 }}>
      {/* edges */}
      <line x1="250" y1="50"  x2="250" y2="100" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="250" y1="130" x2="250" y2="180" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="250" y1="210" x2="250" y2="260" stroke="#64748b" strokeWidth="1.5"/>
      {/* switch to servers */}
      <line x1="250" y1="285" x2="120" y2="340" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="250" y1="285" x2="250" y2="340" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="250" y1="285" x2="380" y2="340" stroke="#f59e0b" strokeWidth="1.5"/>
      {/* attacker */}
      <line x1="390" y1="50" x2="270" y2="100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3"/>
      {/* threat labels */}
      <text x="300" y="75" fill="#ef4444" fontSize="9" fontFamily="monospace">Port Scan</text>
      <text x="245" y="325" fill="#ef4444" fontSize="9" fontFamily="monospace">ARP Poison</text>
      <text x="295" y="320" fill="#f59e0b" fontSize="9" fontFamily="monospace">Deauth</text>

      {/* Flat network label */}
      <rect x="60" y="248" width="330" height="155" rx="6" fill="rgba(239,68,68,0.04)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" strokeDasharray="5,3"/>
      <text x="70" y="265" fill="#ef4444" fontSize="9" fontFamily="monospace">192.168.10.0/24 — FLAT (no segmentation)</text>

      {/* nodes */}
      {[
        { x:250, y:35,  label:'Internet 🌐',         fill:'#1e293b', stroke:'#475569' },
        { x:390, y:35,  label:'Attacker ☠ 203.x.x.x', fill:'#450a0a', stroke:'#ef4444' },
        { x:250, y:115, label:'Firewall + IDS 🔥',    fill:'#1e1b4b', stroke:'#6366f1' },
        { x:250, y:195, label:'Web Server DMZ 🖥',     fill:'#1e293b', stroke:'#475569' },
        { x:250, y:272, label:'Core Switch ⊞',        fill:'#083344', stroke:'#06b6d4' },
        { x:120, y:358, label:'App Server ⚙',         fill:'#1e293b', stroke:'#475569' },
        { x:250, y:358, label:'DB Server 🗄 ⚠',       fill:'#431407', stroke:'#f97316' },
        { x:380, y:358, label:'Wi-Fi AP 📶',          fill:'#2e1065', stroke:'#a855f7' },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 70} y={n.y - 18} width={140} height={36} rx={7}
            fill={n.fill} stroke={n.stroke} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize={10} fontWeight="500">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function SecureArchDiagram() {
  return (
    <svg viewBox="0 0 560 580" className="w-full" style={{ maxHeight: 580 }}>
      {/* Internet → NGFW */}
      <line x1="280" y1="48" x2="280" y2="100" stroke="#64748b" strokeWidth="1.5"/>
      {/* NGFW → DMZ Switch */}
      <line x1="280" y1="130" x2="280" y2="180" stroke="#64748b" strokeWidth="1.5"/>
      {/* DMZ Switch → Internal FW */}
      <line x1="280" y1="210" x2="280" y2="255" stroke="#64748b" strokeWidth="1.5"/>
      {/* Internal FW → Core Switch */}
      <line x1="280" y1="285" x2="280" y2="330" stroke="#64748b" strokeWidth="1.5"/>
      {/* Core Switch → VLANs */}
      <line x1="280" y1="355" x2="100" y2="420" stroke="#06b6d4" strokeWidth="1.5"/>
      <line x1="280" y1="355" x2="220" y2="420" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1="280" y1="355" x2="340" y2="420" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1="280" y1="355" x2="460" y2="420" stroke="#10b981" strokeWidth="1.5"/>
      {/* SIEM monitoring (dashed) */}
      <line x1="280" y1="355" x2="510" y2="290" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="280" y1="270" x2="510" y2="290" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3"/>

      {/* VLAN zone boxes */}
      {[
        { x:25,  color:'rgba(6,182,212,0.06)',   stroke:'rgba(6,182,212,0.25)',   label:'VLAN 10 DMZ' },
        { x:150, color:'rgba(59,130,246,0.06)',  stroke:'rgba(59,130,246,0.25)',  label:'VLAN 20 App' },
        { x:270, color:'rgba(239,68,68,0.06)',   stroke:'rgba(239,68,68,0.25)',   label:'VLAN 30 DB' },
        { x:395, color:'rgba(16,185,129,0.06)',  stroke:'rgba(16,185,129,0.25)',  label:'VLAN 40 Users' },
      ].map((v, i) => (
        <g key={i}>
          <rect x={v.x} y={412} width={120} height={90} rx={6}
            fill={v.color} stroke={v.stroke} strokeWidth={1} strokeDasharray="4,3"/>
          <text x={v.x + 60} y={428} textAnchor="middle" fill="white" fontSize={8} fontFamily="monospace">{v.label}</text>
        </g>
      ))}

      {/* Main nodes */}
      {[
        { x:280, y:35,  label:'Internet 🌐',              fill:'#1e293b', stroke:'#475569' },
        { x:280, y:115, label:'NGFW + IPS 🔥',            fill:'#1e1b4b', stroke:'#4f46e5' },
        { x:280, y:195, label:'WAF + Web Server 🖥',       fill:'#082f49', stroke:'#0284c7' },
        { x:280, y:270, label:'Internal Firewall 🛡',      fill:'#1e1b4b', stroke:'#6366f1' },
        { x:280, y:342, label:'Core Switch (DAI+DHCP Snoop)',fill:'#083344', stroke:'#06b6d4' },
        { x:100, y:455, label:'App Srv ⚙',                fill:'#082f49', stroke:'#0284c7' },
        { x:220, y:455, label:'App DB ⚙',                 fill:'#082f49', stroke:'#3b82f6' },
        { x:340, y:455, label:'DB+DAM+DLP 🗄',            fill:'#450a0a', stroke:'#dc2626' },
        { x:460, y:455, label:'WPA3+NAC 📶',              fill:'#052e16', stroke:'#16a34a' },
        { x:510, y:280, label:'SIEM 📊',                  fill:'#2e1065', stroke:'#a855f7' },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 70} y={n.y - 18} width={140} height={36} rx={7}
            fill={n.fill} stroke={n.stroke} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize={9} fontWeight="500">
            {n.label}
          </text>
        </g>
      ))}

      {/* Labels */}
      <text x="512" y="266" fill="#a855f7" fontSize="9" fontFamily="monospace">SIEM monitors all</text>
    </svg>
  )
}

function VLANCard({ vlan }) {
  const c = VLAN_COLORS[vlan.color] ?? VLAN_COLORS.blue
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        <h4 className={`text-sm font-semibold ${c.text}`}>{vlan.name}</h4>
      </div>
      <p className="font-mono text-xs text-slate-400">{vlan.subnet}</p>
    </div>
  )
}

function ControlRow({ control }) {
  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
      <td className="px-5 py-3">
        <span className="badge-info text-xs">{control.zone}</span>
      </td>
      <td className="px-5 py-3 text-sm text-slate-300 font-medium">{control.control}</td>
      <td className="px-5 py-3 text-xs text-slate-400">{control.prevents}</td>
    </tr>
  )
}

export default function SecureArchitecture() {
  const [arch,    setArch]    = useState(null)
  const [view,    setView]    = useState('both')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArchitecture().then(r => setArch(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-cyan-400 text-sm animate-pulse">Loading architecture data…</div>
    </div>
  )

  const { current, secure } = arch

  return (
    <div className="animate-fade-in">
      <Header
        title="Secure Architecture Enhancement"
        subtitle="Part D — Redesign the network to prevent ARP spoofing, DNS poisoning, and data exfiltration"
        badge="Part D"
      />

      {/* Vulnerabilities of current arch */}
      <div className="card border-red-500/20 bg-red-500/5 p-5 mb-6">
        <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Current Architecture Vulnerabilities
        </h3>
        <ul className="space-y-1.5">
          {current.vulnerabilities.map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
              {v}
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'both',    label: 'Compare Both' },
          { key: 'current', label: 'Current (Vulnerable)' },
          { key: 'secure',  label: 'Secure Redesign' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === key
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Diagrams */}
      {view === 'both' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full" />
              {current.title}
            </h3>
            <CurrentArchDiagram />
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {secure.title}
            </h3>
            <SecureArchDiagram />
          </div>
        </div>
      )}

      {view === 'current' && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold text-red-400 mb-4">{current.title}</h3>
          <div className="max-w-md mx-auto"><CurrentArchDiagram /></div>
        </div>
      )}

      {view === 'secure' && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold text-emerald-400 mb-4">{secure.title}</h3>
          <div className="max-w-md mx-auto"><SecureArchDiagram /></div>
        </div>
      )}

      {/* VLAN Segmentation */}
      <div className="card p-6 mb-6">
        <h3 className="section-title">Network Segmentation — VLAN Design</h3>
        <p className="text-sm text-slate-400 mb-4">
          Separate broadcast domains isolate each tier. ARP spoofing is contained to a single VLAN;
          cross-VLAN traffic must traverse the firewall, where ACLs enforce least-privilege access.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {secure.vlans.map((v, i) => (
            <VLANCard key={i} vlan={v} />
          ))}
        </div>
      </div>

      {/* Security controls table */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white">Security Controls by Zone</h3>
          <p className="text-xs text-slate-400 mt-0.5">Every zone has at least one dedicated control addressing the detected threats.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Zone</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Control</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Prevents</th>
              </tr>
            </thead>
            <tbody>
              {secure.controls.map((c, i) => (
                <ControlRow key={i} control={c} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring strategy */}
      <div className="card p-6">
        <h3 className="section-title">Continuous Monitoring Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[
            {
              title: 'Segmentation Monitoring',
              color: 'cyan',
              points: [
                'SIEM correlates logs from all VLANs — detects inter-VLAN anomalies',
                'Switch RSPAN mirrors traffic to IDS for deep-packet inspection',
                'DAI violation counters alert on ARP anomalies per VLAN',
                'Netflow / sFlow on core switch detects east-west lateral movement',
              ],
            },
            {
              title: 'Threat Detection Monitoring',
              color: 'purple',
              points: [
                'IDS rule: ARP rate > 500 pps/host → alert + block',
                'DNS resolver logs fed to SIEM — flag TTL manipulation',
                'Firewall logs port-scan bursts → auto-blacklist offending IP',
                'DLP engine inspects DB server egress — block bulk exports to unknown IPs',
              ],
            },
          ].map(({ title, color, points }) => (
            <div key={title} className={`rounded-xl border border-${color}-500/30 bg-${color}-500/5 p-4`}>
              <h4 className={`text-sm font-semibold text-${color}-400 mb-3`}>{title}</h4>
              <ul className="space-y-2">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className={`w-1.5 h-1.5 bg-${color}-400 rounded-full mt-1.5 flex-shrink-0`} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
