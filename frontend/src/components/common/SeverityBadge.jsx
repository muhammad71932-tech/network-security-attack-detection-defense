export default function SeverityBadge({ severity }) {
  const cls = {
    critical: 'badge-critical',
    high:     'badge-high',
    medium:   'badge-medium',
    low:      'badge-low',
    info:     'badge-info',
  }[severity?.toLowerCase()] ?? 'badge-info'

  return <span className={cls}>{severity?.toUpperCase()}</span>
}
