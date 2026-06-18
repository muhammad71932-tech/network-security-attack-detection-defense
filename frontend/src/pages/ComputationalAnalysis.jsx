import { useState, useEffect } from 'react'
import { getArpAnalysis, getPortScanAnalysis } from '../api'
import Header from '../components/common/Header'

function BarChart({ normal, attack, label }) {
  const max = attack
  const nPct = (normal / max) * 100
  const aPct = 100

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{label} comparison</p>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Normal ({normal.toLocaleString()} pps)</span>
            <span className="text-emerald-400">{nPct.toFixed(1)}%</span>
          </div>
          <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${nPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Under Attack ({attack.toLocaleString()} pps)</span>
            <span className="text-red-400">100%</span>
          </div>
          <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-700" style={{ width: `${aPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ label, value, unit, color = 'cyan', formula }) {
  const c = {
    cyan:    'border-cyan-500/30 bg-cyan-500/5',
    red:     'border-red-500/30 bg-red-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    amber:   'border-amber-500/30 bg-amber-500/5',
    purple:  'border-purple-500/30 bg-purple-500/5',
  }[color] ?? 'border-cyan-500/30 bg-cyan-500/5'

  const vc = {
    cyan:    'text-cyan-400',
    red:     'text-red-400',
    emerald: 'text-emerald-400',
    amber:   'text-amber-400',
    purple:  'text-purple-400',
  }[color] ?? 'text-cyan-400'

  return (
    <div className={`rounded-xl border p-4 ${c}`}>
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${vc}`}>{value} <span className="text-sm font-normal text-slate-400">{unit}</span></p>
      {formula && <p className="font-mono text-xs text-slate-500 mt-2 break-all">{formula}</p>}
    </div>
  )
}

function ARPCalculator() {
  const [normalPps,   setNormalPps]   = useState(200)
  const [attackPps,   setAttackPps]   = useState(5000)
  const [packetSize,  setPacketSize]  = useState(60)
  const [result,      setResult]      = useState(null)
  const [loading,     setLoading]     = useState(false)

  const calculate = async () => {
    setLoading(true)
    try {
      const res = await getArpAnalysis({ normal_pps: normalPps, attack_pps: attackPps, packet_size: packetSize })
      setResult(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { calculate() }, [])

  return (
    <div className="card p-6">
      <h3 className="section-title">ARP Traffic Analysis</h3>
      <p className="section-subtitle">Calculate the percentage increase in ARP traffic and its bandwidth impact</p>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Normal Rate (pps)</label>
          <input type="number" value={normalPps} onChange={e => setNormalPps(+e.target.value)}
            className="input-cyber" min="1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Attack Rate (pps)</label>
          <input type="number" value={attackPps} onChange={e => setAttackPps(+e.target.value)}
            className="input-cyber" min="1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Packet Size (bytes)</label>
          <input type="number" value={packetSize} onChange={e => setPacketSize(+e.target.value)}
            className="input-cyber" min="1" />
        </div>
      </div>

      <button onClick={calculate} disabled={loading} className="btn-cyber mb-6">
        {loading ? 'Calculating…' : 'Calculate'}
      </button>

      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Bar chart */}
          <BarChart normal={result.inputs.normal_pps} attack={result.inputs.attack_pps} label="ARP Rate" />

          {/* Step-by-step: Percentage increase */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Step 1 — Percentage Increase</p>
            <div className="formula-box mb-3">
              <p className="text-slate-400 mb-1">% increase = ((Attack Rate − Normal Rate) ÷ Normal Rate) × 100</p>
              <p className="text-white">= (({result.inputs.attack_pps} − {result.inputs.normal_pps}) ÷ {result.inputs.normal_pps}) × 100</p>
              <p className="text-cyan-300 text-lg mt-1">= <strong>{result.calculations.percentage_increase}%</strong></p>
            </div>
            <ResultCard label="Percentage Increase" value={result.calculations.percentage_increase} unit="%" color="red"
              formula={result.calculations.formula_pct} />
          </div>

          {/* Step-by-step: Bandwidth */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Step 2 — Bandwidth Impact</p>
            <div className="formula-box mb-3">
              <p className="text-slate-400 mb-1">Bandwidth (bps) = Rate × Packet_Size_bytes × 8</p>
              <p className="text-white">Normal  = {result.inputs.normal_pps} × {result.inputs.packet_size_bytes} × 8 = {result.calculations.normal_bandwidth_bps.toLocaleString()} bps ({result.calculations.normal_bandwidth_kbps} Kbps)</p>
              <p className="text-white">Attack  = {result.inputs.attack_pps} × {result.inputs.packet_size_bytes} × 8 = {result.calculations.attack_bandwidth_bps.toLocaleString()} bps</p>
              <p className="text-cyan-300 text-lg mt-1">= <strong>{result.calculations.attack_bandwidth_kbps.toLocaleString()} Kbps ({result.calculations.attack_bandwidth_mbps} Mbps)</strong></p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ResultCard label="Normal Bandwidth"  value={result.calculations.normal_bandwidth_kbps} unit="Kbps" color="emerald" />
              <ResultCard label="Attack Bandwidth"  value={result.calculations.attack_bandwidth_kbps} unit="Kbps" color="red" />
            </div>
          </div>

          {/* Impact summary */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-amber-300 text-sm font-semibold mb-1">Impact Summary</p>
            <p className="text-slate-300 text-sm leading-relaxed">{result.impact}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function PortScanCalculator() {
  const [ports,        setPorts]       = useState(1000)
  const [msPerPort,    setMsPerPort]   = useState(2)
  const [thresholdSec, setThresholdSec]= useState(1)
  const [result,       setResult]      = useState(null)
  const [loading,      setLoading]     = useState(false)

  const calculate = async () => {
    setLoading(true)
    try {
      const res = await getPortScanAnalysis({ ports, ms_per_port: msPerPort, threshold_sec: thresholdSec })
      setResult(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="section-title">Port Scan Detection Analysis</h3>
      <p className="section-subtitle">Compute total scan time and determine IDS detectability</p>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Ports to Scan</label>
          <input type="number" value={ports} onChange={e => setPorts(+e.target.value)}
            className="input-cyber" min="1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Time per Port (ms)</label>
          <input type="number" value={msPerPort} step="0.1" onChange={e => setMsPerPort(+e.target.value)}
            className="input-cyber" min="0.1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">IDS Threshold (s)</label>
          <input type="number" value={thresholdSec} step="0.1" onChange={e => setThresholdSec(+e.target.value)}
            className="input-cyber" min="0.1" />
        </div>
      </div>

      <button onClick={calculate} disabled={loading} className="btn-cyber mb-6">
        {loading ? 'Calculating…' : 'Calculate'}
      </button>

      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Formula */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Calculation</p>
            <div className="formula-box mb-4">
              <p className="text-slate-400 mb-1">Total Time = Ports × Time_per_port</p>
              <p className="text-white">= {result.inputs.total_ports} × {result.inputs.time_per_port_ms} ms</p>
              <p className="text-white">= {result.calculations.total_time_ms} ms</p>
              <p className="text-cyan-300 text-lg mt-1">= <strong>{result.calculations.total_time_sec} seconds</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ResultCard label="Total Ports" value={result.inputs.total_ports} unit="ports" color="purple" />
            <ResultCard label="Total Time"  value={result.calculations.total_time_sec} unit="seconds" color="amber" />
            <ResultCard label="IDS Threshold" value={result.inputs.ids_threshold_sec} unit="seconds" color="cyan" />
          </div>

          {/* Detection verdict */}
          <div className={`rounded-xl border p-5 ${result.detection.detectable ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
            <div className="flex items-center gap-3 mb-3">
              {result.detection.detectable ? (
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <p className={`font-bold text-lg ${result.detection.detectable ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.detection.detectable ? 'DETECTABLE by IDS' : 'NOT DETECTABLE by IDS'}
                </p>
                <p className="text-sm text-slate-400">{result.detection.reason}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-400 mb-1">Explanation</p>
              <p className="text-sm text-slate-300">
                The port scan takes <strong className="text-cyan-400">{result.calculations.total_time_sec}s</strong> to
                complete {result.inputs.total_ports} ports at {result.inputs.time_per_port_ms}ms each.
                The IDS threshold is set to <strong className="text-amber-400">{result.inputs.ids_threshold_sec}s</strong>.
                Since {result.calculations.total_time_sec}s <strong>{result.detection.detectable ? '>' : '≤'}</strong> {result.inputs.ids_threshold_sec}s,
                the scan {result.detection.detectable ? 'exceeds the detection window and WILL be flagged' : 'falls under the threshold and will NOT trigger an alert'}.
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-3">{result.detection.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComputationalAnalysis() {
  return (
    <div className="animate-fade-in">
      <Header
        title="Computational Analysis"
        subtitle="Part B — Quantitative calculations for ARP traffic and port scan detection"
        badge="Part B"
      />

      {/* Summary of given data */}
      <div className="card border-cyan-500/20 bg-cyan-500/5 p-5 mb-6">
        <h3 className="text-sm font-semibold text-cyan-300 mb-3">Given Data (from problem statement)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ['Normal ARP Rate',  '200 pps'],
            ['Attack ARP Rate',  '5,000 pps'],
            ['ARP Packet Size',  '60 bytes'],
            ['Ports Scanned',    '1,000 ports'],
            ['Time per Port',    '2 ms'],
            ['IDS Threshold',    '1 second'],
            ['Attacker IP',      '203.0.113.45'],
            ['Subnet',           '192.168.10.0/24'],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-slate-500">{k}</p>
              <p className="font-mono text-cyan-300 font-semibold mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <ARPCalculator />
        <PortScanCalculator />
      </div>
    </div>
  )
}
