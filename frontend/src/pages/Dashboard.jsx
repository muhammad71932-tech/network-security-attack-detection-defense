import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAttackSummary, getIdsLogs, getFirewallLogs } from '../api'
import Header from '../components/common/Header'
import StatCard from '../components/common/StatCard'
import SeverityBadge from '../components/common/SeverityBadge'

function NetworkTopology() {
  const nodes = [
    { id: 'internet',  x: 380, y: 20,  label: 'Internet',        icon: '🌐', type: 'external' },
    { id: 'attacker',  x: 620, y: 20,  label: '203.0.113.45',    icon: '☠', type: 'threat' },
    { id: 'firewall',  x: 380, y: 110, label: 'Firewall + IDS',  icon: '🔥', type: 'security' },
    { id: 'dmz',       x: 380, y: 200, label: 'Web Server (DMZ)',icon: '🖥', type: 'server' },
    { id: 'switch',    x: 380, y: 295, label: 'Core Switch',     icon: '⊞',  type: 'network' },
    { id: 'app',       x: 180, y: 385, label: 'App Server',      icon: '⚙', type: 'server' },
    { id: 'db',        x: 380, y: 385, label: 'DB Server',       icon: '🗄', type: 'database' },
    { id: 'wifi',      x: 580, y: 385, label: 'Wi-Fi AP',        icon: '📶', type: 'wireless' },
    { id: 'atthost',   x: 480, y: 295, label: '10.10 ⚠ Attacker',icon: '💀', type: 'threat' },
  ]

  const edges = [
    { from: { x: 430, y: 40 }, to: { x: 410, y: 105 }, color: '#ef4444', dashed: true },
    { from: { x: 390, y: 40 }, to: { x: 390, y: 105 }, color: '#94a3b8' },
    { from: { x: 390, y: 135 }, to: { x: 390, y: 195 }, color: '#94a3b8' },
    { from: { x: 390, y: 225 }, to: { x: 390, y: 290 }, color: '#94a3b8' },
    { from: { x: 370, y: 310 }, to: { x: 200, y: 380 }, color: '#94a3b8' },
    { from: { x: 390, y: 310 }, to: { x: 390, y: 380 }, color: '#ef4444', dashed: true },
    { from: { x: 410, y: 310 }, to: { x: 570, y: 380 }, color: '#f59e0b' },
    { from: { x: 480, y: 295 }, to: { x: 410, y: 302 }, color: '#ef4444', dashed: true },
  ]

  const typeStyle = {
    external: 'fill-slate-700 stroke-slate-500',
    threat:   'fill-red-900/80 stroke-red-500',
    security: 'fill-indigo-900/80 stroke-indigo-500',
    server:   'fill-slate-700 stroke-slate-500',
    network:  'fill-cyan-900/80 stroke-cyan-600',
    database: 'fill-amber-900/80 stroke-amber-500',
    wireless: 'fill-purple-900/80 stroke-purple-500',
  }

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        Live Network Topology — Active Threats
      </h3>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 780 450" className="w-full max-w-2xl mx-auto" style={{ minWidth: 500 }}>
          {/* edges */}
          {edges.map((e, i) => (
            <line key={i}
              x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
              stroke={e.color} strokeWidth="1.5"
              strokeDasharray={e.dashed ? '5,4' : undefined}
              opacity="0.7"
            />
          ))}
          {/* subnet label */}
          <rect x="120" y="260" width="340" height="150" rx="8"
            fill="rgba(6,182,212,0.04)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="6,4" />
          <text x="130" y="278" fill="#06b6d4" fontSize="10" fontFamily="monospace">192.168.10.0/24 — Internal LAN</text>
          {/* nodes */}
          {nodes.map(n => (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              <rect x="-52" y="-18" width="104" height="36" rx="8" className={typeStyle[n.type]}
                strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">
                {n.icon} {n.label}
              </text>
            </g>
          ))}
          {/* threat labels */}
          <text x="530" y="70" fill="#ef4444" fontSize="10" fontFamily="monospace">Port Scan →</text>
          <text x="390" y="340" fill="#ef4444" fontSize="10" fontFamily="monospace">← ARP Poison</text>
          <text x="540" y="340" fill="#f59e0b" fontSize="10" fontFamily="monospace">Deauth ↗</text>
        </svg>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [idsLogs, setIdsLogs] = useState([])
  const [fwLogs,  setFwLogs]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAttackSummary(), getIdsLogs(), getFirewallLogs()])
      .then(([s, ids, fw]) => {
        setSummary(s.data)
        setIdsLogs(ids.data)
        setFwLogs(fw.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const severityColor = { critical: 'text-red-400', high: 'text-orange-400', medium: 'text-amber-400' }

  return (
    <div className="animate-fade-in">
      <Header
        title="Network Security Dashboard"
        subtitle="Multi-Layer Attack Detection & Defense — E-Commerce Network 192.168.10.0/24"
        badge="INCIDENT ACTIVE"
      />

      {/* Scenario Banner */}
      <div className="card border-amber-500/30 bg-amber-500/5 p-4 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="text-amber-300 font-semibold mb-1">Scenario Overview</p>
          <p className="text-slate-400">
            A mid-sized e-commerce company operates a hybrid network. The network administrator has observed
            ARP traffic spikes, users redirected to a fake login page, unusual outbound DB traffic,
            and intermittent Wi-Fi disconnections. This dashboard analyses all detected threats.
          </p>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-slate-700/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Attacks Detected" value={summary?.total_attacks} color="red"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard label="IDS Alerts" value={summary?.ids_alerts} sub="Active alert count" color="orange"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          />
          <StatCard label="Suspicious Hosts" value={summary?.suspicious_hosts} sub="ARP table anomalies" color="amber"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>}
          />
          <StatCard label="FW Blocks" value={summary?.firewall_blocks} sub="Blocked connections" color="emerald"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
          />
        </div>
      )}

      {/* Network topology + quick nav */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <NetworkTopology />
        </div>

        {/* Quick navigation */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CCP Sections</p>
          {[
            { to: '/attacks',      label: 'Part A: Attack Identification', desc: '4 attack types with log evidence', color: 'red' },
            { to: '/analysis',     label: 'Part B: Computational Analysis', desc: 'ARP & port-scan calculations', color: 'cyan' },
            { to: '/defense',      label: 'Part C: Defense Strategy', desc: 'Multi-layer protection design', color: 'emerald' },
            { to: '/architecture', label: 'Part D: Secure Architecture', desc: 'Network redesign with VLANs', color: 'purple' },
          ].map(({ to, label, desc, color }) => (
            <Link key={to} to={to}
              className="card-hover block p-4">
              <p className={`text-sm font-semibold text-${color}-400`}>{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IDS logs */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent IDS Alerts</h3>
            <span className="badge-critical">{idsLogs.length} alerts</span>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
            {idsLogs.slice(0, 6).map((log, i) => (
              <div key={i} className="log-entry">
                <SeverityBadge severity={log.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs truncate">{log.msg}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Firewall logs */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Firewall Log</h3>
            <span className="badge-high">{fwLogs.length} entries</span>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
            {fwLogs.map((log, i) => (
              <div key={i} className="log-entry">
                <span className={`text-xs font-mono font-bold ${log.action === 'BLOCK' ? 'text-red-400' : log.action === 'ALERT' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {log.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs truncate">{log.src} → {log.dst}:{log.port}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{log.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
