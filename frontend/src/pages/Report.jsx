import { useEffect, useState, useRef } from 'react'
import {
  getAttacks, getArpTable, getIdsLogs, getFirewallLogs,
  getArpAnalysis, getPortScanAnalysis,
  getDefense, getArchitecture,
} from '../api'

/* ─── small helpers ─────────────────────────────────── */
function Section({ num, title, children }) {
  return (
    <section className="mb-10 print:mb-8">
      <h2 className="text-lg font-bold text-white border-b border-slate-600 pb-2 mb-4 print:text-black print:border-gray-300">
        {num}. {title}
      </h2>
      {children}
    </section>
  )
}

function SubSection({ num, title, children }) {
  return (
    <div className="mb-6 print:mb-5">
      <h3 className="text-base font-semibold text-cyan-300 mb-3 print:text-gray-800">{num} {title}</h3>
      {children}
    </div>
  )
}

function Para({ children }) {
  return <p className="text-slate-300 text-sm leading-relaxed mb-3 print:text-gray-700">{children}</p>
}

function FormulaBox({ children }) {
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 font-mono text-sm text-cyan-300 my-3 print:bg-gray-50 print:border-gray-300 print:text-gray-800">
      {children}
    </div>
  )
}

function ResultRow({ label, value, unit }) {
  return (
    <tr className="border-b border-slate-700 print:border-gray-200">
      <td className="py-2 pr-6 text-slate-400 text-sm print:text-gray-600">{label}</td>
      <td className="py-2 font-mono font-semibold text-cyan-300 text-sm print:text-gray-900">
        {value} <span className="font-normal text-slate-500 print:text-gray-500">{unit}</span>
      </td>
    </tr>
  )
}

const SEV_PRINT = { critical:'#b91c1c', high:'#c2410c', medium:'#b45309', low:'#15803d' }

/* ─── main component ─────────────────────────────────── */
export default function Report() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    Promise.all([
      getAttacks(), getArpTable(), getIdsLogs(), getFirewallLogs(),
      getArpAnalysis({ normal_pps:200, attack_pps:5000, packet_size:60 }),
      getPortScanAnalysis({ ports:1000, ms_per_port:2, threshold_sec:1 }),
      getDefense(), getArchitecture(),
    ]).then(([attacks, arp, ids, fw, arpCalc, psCalc, defense, arch]) => {
      setData({ attacks:attacks.data, arpTable:arp.data, idsLogs:ids.data, fwLogs:fw.data,
                arpCalc:arpCalc.data, psCalc:psCalc.data, defense:defense.data, arch:arch.data })
    }).finally(() => setLoading(false))
  }, [])

  const handlePrint = () => window.print()

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-cyan-400 animate-pulse text-sm">
      Loading report data…
    </div>
  )

  const { attacks, arpTable, idsLogs, fwLogs, arpCalc, psCalc, defense, arch } = data

  return (
    <div>
      {/* Print / action bar – hidden when printing */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white">Full CCP Report</h1>
          <p className="text-slate-400 text-sm mt-1">Print-ready academic report covering all four parts</p>
        </div>
        <button onClick={handlePrint} className="btn-cyber flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* ── REPORT BODY ── */}
      <div ref={printRef} className="card p-10 print:shadow-none print:border-none print:p-0 print:bg-white">

        {/* Cover */}
        <div className="text-center mb-10 pb-8 border-b border-slate-600 print:border-gray-300">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-cyber rounded-2xl mb-4 print:hidden">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 print:text-black print:text-3xl">
            Multi-Layer Network Attack Detection and Defense Design
          </h1>
          <p className="text-slate-400 print:text-gray-600">Complex Computing Problem (CCP)</p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm print:text-gray-700">
            {[
              ['Course',    'Network Security'],
              ['Program',   'BS (Computer Science)'],
              ['Announced', '21-04-2026'],
              ['Due Date',  '25-06-2026'],
              ['Max Marks', '10'],
            ].map(([k,v]) => (
              <div key={k} className="text-center">
                <p className="text-slate-500 text-xs">{k}</p>
                <p className="text-white font-semibold print:text-gray-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500 print:text-gray-500">
            Mapped CLO: CLO3 &nbsp;|&nbsp; WP2 (Depth of Analysis) &nbsp;|&nbsp; WP3 (Depth of Knowledge)
          </div>
        </div>

        {/* ── 1. Problem Statement ── */}
        <Section num="1" title="Problem Statement">
          <Para>
            A mid-sized e-commerce company operates a hybrid network consisting of a public-facing
            web server in a DMZ, internal application and database servers, employee access via
            Wi-Fi and VPN, and a firewall with IDS deployed at the network perimeter. The internal
            subnet is <strong className="text-white print:text-black">192.168.10.0/24</strong>.
          </Para>
          <Para>
            The network administrator recently observed the following suspicious activities:
          </Para>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mb-4 print:text-gray-700 ml-2">
            <li>A sudden spike in ARP traffic within the internal LAN</li>
            <li>Multiple users reported being redirected to a fake login page</li>
            <li>Unusual outbound traffic from the database server to unknown IP addresses</li>
            <li>Wi-Fi users experiencing intermittent disconnections</li>
          </ul>
          <Para>
            IDS logs recorded alerts for ARP Spoofing attempts and DNS poisoning indicators.
            Firewall logs show port scanning attempts from external IP{' '}
            <span className="font-mono text-red-400">203.0.113.45</span>.
          </Para>

          {/* ARP Table */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Sample ARP Table (Given Data)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-700 print:border-gray-300">
                <thead className="bg-slate-700/50 print:bg-gray-100">
                  <tr>
                    {['IP Address','MAC Address','Role','Status'].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-slate-400 print:text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {arpTable.map((row, i) => (
                    <tr key={i} className={`border-t border-slate-700 print:border-gray-200 ${row.status==='suspicious' ? 'bg-red-500/5' : ''}`}>
                      <td className="px-4 py-2 font-mono text-xs text-slate-300 print:text-gray-800">{row.ip}</td>
                      <td className={`px-4 py-2 font-mono text-xs ${row.status==='suspicious' ? 'text-red-400 font-bold' : 'text-slate-300 print:text-gray-800'}`}>
                        {row.mac}{row.status==='suspicious' ? ' ← Foreign OUI' : ''}
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-400 print:text-gray-600">{row.role}</td>
                      <td className="px-4 py-2 text-xs">
                        <span style={{ color: row.status==='suspicious' ? '#f87171' : '#34d399' }}>
                          {row.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ── 2. Part A – Attack Identification ── */}
        <Section num="2" title="Part A: Attack Identification">
          <Para>
            Based on the observed symptoms, IDS alerts, firewall logs, and ARP table anomalies,
            the following four distinct attacks were identified in the network:
          </Para>

          {attacks.map((atk, i) => (
            <SubSection key={atk.id} num={`2.${i+1}`} title={atk.name}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: SEV_PRINT[atk.severity] || '#94a3b8',
                               backgroundColor: SEV_PRINT[atk.severity]+'22',
                               border:`1px solid ${SEV_PRINT[atk.severity]}44`,
                               padding:'2px 8px', borderRadius:'9999px', fontSize:'11px', fontWeight:700 }}>
                  {atk.severity.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 print:text-gray-500">{atk.layer}</span>
              </div>

              <Para>{atk.description}</Para>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 print:text-gray-600">
                Observed Symptoms
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mb-3 print:text-gray-700 ml-2">
                {atk.symptoms.map((s, si) => <li key={si}>{s}</li>)}
              </ul>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 print:text-gray-600">
                Justification
              </p>
              <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 leading-relaxed print:bg-gray-50 print:border-gray-300 print:text-gray-700">
                {atk.justification}
              </div>
            </SubSection>
          ))}

          {/* IDS Logs table */}
          <SubSection num="2.5" title="IDS Alert Log Evidence">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-700 print:border-gray-300">
                <thead className="bg-slate-700/50 print:bg-gray-100">
                  <tr>
                    {['Timestamp','Severity','Type','Source','Message'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-400 print:text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {idsLogs.map((log, i) => (
                    <tr key={i} className="border-t border-slate-700 print:border-gray-200">
                      <td className="px-3 py-1.5 font-mono text-slate-500 print:text-gray-500">{log.timestamp}</td>
                      <td className="px-3 py-1.5">
                        <span style={{ color: SEV_PRINT[log.severity] || '#94a3b8', fontWeight:600, fontSize:11 }}>
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-slate-300 print:text-gray-700">{log.type}</td>
                      <td className="px-3 py-1.5 font-mono text-slate-400 print:text-gray-600">{log.src}</td>
                      <td className="px-3 py-1.5 text-slate-300 print:text-gray-700">{log.msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        </Section>

        {/* ── 3. Part B – Computational Analysis ── */}
        <Section num="3" title="Part B: Computational Analysis">

          <SubSection num="3.1" title="ARP Traffic Analysis">
            <Para>
              ARP packets increased from{' '}
              <strong className="text-white print:text-black">
                {arpCalc.inputs.normal_pps} packets/sec
              </strong>{' '}
              (normal) to{' '}
              <strong className="text-white print:text-black">
                {arpCalc.inputs.attack_pps} packets/sec
              </strong>{' '}
              (under attack), with each packet being{' '}
              <strong className="text-white print:text-black">
                {arpCalc.inputs.packet_size_bytes} bytes
              </strong>.
            </Para>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 print:text-gray-600">
              (i) Percentage Increase in ARP Traffic
            </p>
            <FormulaBox>
              <div>% Increase = ((Attack Rate − Normal Rate) ÷ Normal Rate) × 100</div>
              <div className="mt-1">= (({arpCalc.inputs.attack_pps} − {arpCalc.inputs.normal_pps}) ÷ {arpCalc.inputs.normal_pps}) × 100</div>
              <div className="mt-1">= ({arpCalc.inputs.attack_pps - arpCalc.inputs.normal_pps} ÷ {arpCalc.inputs.normal_pps}) × 100</div>
              <div className="mt-1 text-lg font-bold text-emerald-400 print:text-green-700">
                = {arpCalc.calculations.percentage_increase}%
              </div>
            </FormulaBox>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-4 print:text-gray-600">
              (ii) Impact on Network Bandwidth
            </p>
            <FormulaBox>
              <div>Bandwidth (bps) = Rate (pps) × Packet Size (bytes) × 8</div>
              <div className="mt-1">Normal  = {arpCalc.inputs.normal_pps} × {arpCalc.inputs.packet_size_bytes} × 8 = {arpCalc.calculations.normal_bandwidth_bps.toLocaleString()} bps = {arpCalc.calculations.normal_bandwidth_kbps} Kbps</div>
              <div className="mt-1">Attack  = {arpCalc.inputs.attack_pps} × {arpCalc.inputs.packet_size_bytes} × 8 = {arpCalc.calculations.attack_bandwidth_bps.toLocaleString()} bps</div>
              <div className="mt-1 text-lg font-bold text-emerald-400 print:text-green-700">
                = {arpCalc.calculations.attack_bandwidth_kbps.toLocaleString()} Kbps ({arpCalc.calculations.attack_bandwidth_mbps} Mbps)
              </div>
            </FormulaBox>

            <div className="mt-3 overflow-x-auto">
              <table className="text-sm">
                <tbody>
                  <ResultRow label="ARP Traffic % Increase"   value={arpCalc.calculations.percentage_increase} unit="%" />
                  <ResultRow label="Normal Bandwidth"         value={arpCalc.calculations.normal_bandwidth_kbps} unit="Kbps" />
                  <ResultRow label="Attack Bandwidth"         value={arpCalc.calculations.attack_bandwidth_kbps.toLocaleString()} unit="Kbps" />
                  <ResultRow label="Attack Bandwidth (Mbps)"  value={arpCalc.calculations.attack_bandwidth_mbps} unit="Mbps" />
                  <ResultRow label="Additional Bandwidth"     value={(arpCalc.calculations.additional_bandwidth_bps/1000).toLocaleString()} unit="Kbps extra" />
                </tbody>
              </table>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-3 print:bg-yellow-50 print:border-yellow-300">
              <p className="text-sm text-amber-300 print:text-yellow-800">{arpCalc.impact}</p>
            </div>
          </SubSection>

          <SubSection num="3.2" title="Port Scan Analysis">
            <Para>
              The attacker at{' '}
              <span className="font-mono text-red-400">203.0.113.45</span>{' '}
              performed a port scan across{' '}
              <strong className="text-white print:text-black">
                {psCalc.inputs.total_ports} ports
              </strong>{' '}
              with each scan taking{' '}
              <strong className="text-white print:text-black">
                {psCalc.inputs.time_per_port_ms} ms
              </strong>. The IDS detection threshold is{' '}
              <strong className="text-white print:text-black">
                {psCalc.inputs.ids_threshold_sec} second
              </strong>.
            </Para>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 print:text-gray-600">
              (i) Total Time Required
            </p>
            <FormulaBox>
              <div>Total Time = Total Ports × Time per Port</div>
              <div className="mt-1">= {psCalc.inputs.total_ports} × {psCalc.inputs.time_per_port_ms} ms</div>
              <div className="mt-1">= {psCalc.calculations.total_time_ms} ms</div>
              <div className="mt-1 text-lg font-bold text-emerald-400 print:text-green-700">
                = {psCalc.calculations.total_time_sec} seconds
              </div>
            </FormulaBox>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-4 print:text-gray-600">
              (ii) IDS Detectability Evaluation
            </p>
            <FormulaBox>
              <div>Scan Duration  = {psCalc.calculations.total_time_sec} s</div>
              <div className="mt-1">IDS Threshold  = {psCalc.inputs.ids_threshold_sec} s</div>
              <div className="mt-1">Since {psCalc.calculations.total_time_sec} s &gt; {psCalc.inputs.ids_threshold_sec} s  →  threshold EXCEEDED</div>
              <div className="mt-1 text-lg font-bold text-emerald-400 print:text-green-700">
                ∴ The port scan IS DETECTABLE by the IDS
              </div>
            </FormulaBox>

            <div className="mt-3 overflow-x-auto">
              <table className="text-sm">
                <tbody>
                  <ResultRow label="Total Ports Scanned"  value={psCalc.inputs.total_ports} unit="ports" />
                  <ResultRow label="Time per Port"        value={psCalc.inputs.time_per_port_ms} unit="ms" />
                  <ResultRow label="Total Scan Time"      value={psCalc.calculations.total_time_sec} unit="seconds" />
                  <ResultRow label="IDS Threshold"        value={psCalc.inputs.ids_threshold_sec} unit="second" />
                  <ResultRow label="Detectable by IDS"    value={psCalc.detection.detectable ? 'YES' : 'NO'} unit="" />
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mt-3 print:bg-green-50 print:border-green-300">
              <p className="text-sm text-emerald-300 print:text-green-800">{psCalc.detection.reason}</p>
              <p className="text-xs text-slate-400 mt-1 print:text-gray-600">{psCalc.detection.recommendation}</p>
            </div>
          </SubSection>
        </Section>

        {/* ── 4. Part C – Defense Mechanism Design ── */}
        <Section num="4" title="Part C: Defense Mechanism Design">
          <Para>
            A multi-layer defense-in-depth strategy is proposed below, covering the Network,
            Application, Wireless, and Monitoring layers. Each control directly mitigates one
            or more identified attacks.
          </Para>

          {defense.map((layer, li) => (
            <SubSection key={li} num={`4.${li+1}`} title={layer.layer}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-700 print:border-gray-300">
                  <thead className="bg-slate-700/50 print:bg-gray-100">
                    <tr>
                      {['Control / Mechanism','Tool / Technology','Description','Mitigates'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 print:text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {layer.mechanisms.map((m, mi) => (
                      <tr key={mi} className="border-t border-slate-700 print:border-gray-200 align-top">
                        <td className="px-3 py-2 text-cyan-300 font-semibold text-xs print:text-blue-800">{m.name}</td>
                        <td className="px-3 py-2 text-xs text-slate-400 print:text-gray-600 font-mono">{m.tool}</td>
                        <td className="px-3 py-2 text-xs text-slate-300 print:text-gray-700 leading-relaxed">{m.description}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {m.mitigates.map((tag,ti) => (
                              <span key={ti} className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded print:bg-gray-100 print:text-gray-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>
          ))}
        </Section>

        {/* ── 5. Part D – Secure Architecture Enhancement ── */}
        <Section num="5" title="Part D: Secure Architecture Enhancement">
          <Para>
            The current network uses a flat architecture with a single{' '}
            <strong className="text-white print:text-black">192.168.10.0/24</strong> subnet and
            no VLAN segmentation. The redesigned architecture adopts a defence-in-depth topology
            with five isolated VLANs, an NGFW, internal firewall, Dynamic ARP Inspection, DNSSEC,
            WPA3-Enterprise wireless, and centralised SIEM monitoring.
          </Para>

          <SubSection num="5.1" title="Current Architecture Vulnerabilities">
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 print:text-gray-700 ml-2">
              {arch.current.vulnerabilities.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </SubSection>

          <SubSection num="5.2" title="VLAN Segmentation Design">
            <Para>
              Network segmentation isolates each tier into a separate broadcast domain. ARP
              spoofing is thereby contained to a single VLAN; cross-VLAN traffic must traverse
              the internal firewall, where ACLs enforce least-privilege access between tiers.
            </Para>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-700 print:border-gray-300">
                <thead className="bg-slate-700/50 print:bg-gray-100">
                  <tr>
                    {['VLAN','Name','Subnet','Purpose'].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-slate-400 print:text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {arch.secure.vlans.map((v, i) => (
                    <tr key={i} className="border-t border-slate-700 print:border-gray-200">
                      <td className="px-4 py-2 text-xs font-mono text-slate-300 print:text-gray-800">VLAN {10*(i+1)}</td>
                      <td className="px-4 py-2 text-xs font-semibold text-cyan-300 print:text-blue-800">{v.name}</td>
                      <td className="px-4 py-2 text-xs font-mono text-slate-400 print:text-gray-600">{v.subnet}</td>
                      <td className="px-4 py-2 text-xs text-slate-300 print:text-gray-700">
                        {['Public-facing web servers (hardened, WAF-protected)',
                          'Application tier — internal services',
                          'Database tier — high-security zone',
                          'Employee workstations and Wi-Fi clients',
                          'Network device management (ACL-restricted)'][i]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>

          <SubSection num="5.3" title="Security Controls by Zone">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-700 print:border-gray-300">
                <thead className="bg-slate-700/50 print:bg-gray-100">
                  <tr>
                    {['Zone','Security Control','Prevents'].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-slate-400 print:text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {arch.secure.controls.map((c, i) => (
                    <tr key={i} className="border-t border-slate-700 print:border-gray-200">
                      <td className="px-4 py-2 text-xs font-semibold text-cyan-300 print:text-blue-800">{c.zone}</td>
                      <td className="px-4 py-2 text-xs text-slate-300 print:text-gray-700">{c.control}</td>
                      <td className="px-4 py-2 text-xs text-slate-400 print:text-gray-600">{c.prevents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>

          <SubSection num="5.4" title="Continuous Monitoring Strategy">
            <Para>
              The Security Operations Centre (SOC) runs a SIEM (e.g., Splunk/ELK) that aggregates
              logs from all VLANs, the NGFW, IDS/IPS, DNS resolver, and Wi-Fi controllers.
              Correlation rules detect multi-stage attack chains that span multiple layers.
            </Para>
            {[
              {
                title: 'Segmentation Monitoring',
                points: [
                  'SIEM correlates logs from all VLANs — detects inter-VLAN anomalies',
                  'Switch RSPAN mirrors traffic to IDS for deep-packet inspection',
                  'DAI violation counters alert on ARP anomalies per VLAN',
                  'NetFlow / sFlow on core switch detects east-west lateral movement',
                ],
              },
              {
                title: 'Threat-Specific Detection Rules',
                points: [
                  'IDS rule: ARP rate > 500 pps/host → alert and block source port',
                  'DNS resolver logs fed to SIEM — flag TTL manipulation and forged records',
                  'Firewall logs port-scan bursts → auto-blacklist offending external IP',
                  'DLP engine inspects DB server egress — block bulk exports to unknown IPs',
                ],
              },
            ].map(({ title, points }) => (
              <div key={title} className="mb-3">
                <p className="text-sm font-semibold text-slate-300 mb-1 print:text-gray-700">{title}</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 print:text-gray-600 ml-2">
                  {points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            ))}
          </SubSection>
        </Section>

        {/* ── 6. Conclusion ── */}
        <Section num="6" title="Conclusion">
          <Para>
            This report has demonstrated a comprehensive analysis of a real-world network security
            incident affecting a hybrid e-commerce network. Four distinct attacks were identified
            — ARP Spoofing, DNS Cache Poisoning, External Port Scanning, and Wi-Fi
            Deauthentication — each confirmed through IDS alerts, firewall logs, and ARP table
            anomalies.
          </Para>
          <Para>
            Computational analysis showed that ARP traffic increased by{' '}
            <strong className="text-white print:text-black">2,400%</strong>, consuming{' '}
            <strong className="text-white print:text-black">2.4 Mbps</strong> of bandwidth under
            attack. The port scan across 1,000 ports at 2 ms per port required{' '}
            <strong className="text-white print:text-black">2 seconds</strong>, exceeding the
            1-second IDS threshold and therefore being{' '}
            <strong className="text-white print:text-black">detectable</strong>.
          </Para>
          <Para>
            A four-layer defence strategy was proposed, covering the Network (DAI, VLANs, NGFW),
            Application (DNSSEC, WAF, TLS), Wireless (WPA3-Enterprise, 802.11w), and Monitoring
            (SIEM, IDS/IPS, DLP) layers — providing 18 controls mitigating 8 attack types. The
            secure architecture redesign introduces five VLANs that eliminate the flat-network
            vulnerability, combined with per-zone security controls that prevent ARP spoofing,
            DNS poisoning, and unauthorised data exfiltration.
          </Para>
          <Para>
            Together, these measures realise a defence-in-depth posture where each layer
            independently blocks attack vectors, ensuring that an attacker must defeat all layers
            simultaneously — significantly raising the cost and complexity of any successful breach.
          </Para>
        </Section>

        {/* Footer */}
        <div className="border-t border-slate-700 pt-4 mt-4 text-center text-xs text-slate-600 print:border-gray-300 print:text-gray-400">
          Network Security CCP &nbsp;|&nbsp; Multi-Layer Attack Detection &amp; Defense Design &nbsp;|&nbsp; BS(CB) 2026
        </div>
      </div>

      {/* Print styles injected inline */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          aside { display: none !important; }
          main > div { padding: 0 !important; max-width: 100% !important; }
          .card { background: white !important; border: none !important; box-shadow: none !important; }
          @page { margin: 20mm; }
        }
      `}</style>
    </div>
  )
}
