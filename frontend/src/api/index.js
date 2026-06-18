import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getAttacks          = ()       => api.get('/attacks/')
export const getArpTable         = ()       => api.get('/attacks/arp-table')
export const getIdsLogs          = ()       => api.get('/attacks/ids-logs')
export const getFirewallLogs     = ()       => api.get('/attacks/firewall-logs')
export const getAttackSummary    = ()       => api.get('/attacks/summary')

export const getArpAnalysis      = (params) => api.get('/analysis/arp',      { params })
export const getPortScanAnalysis = (params) => api.get('/analysis/portscan', { params })

export const getDefense          = ()       => api.get('/defense/')
export const getDefenseSummary   = ()       => api.get('/defense/summary')

export const getArchitecture     = ()       => api.get('/architecture/')
export const getCurrentArch      = ()       => api.get('/architecture/current')
export const getSecureArch       = ()       => api.get('/architecture/secure')
