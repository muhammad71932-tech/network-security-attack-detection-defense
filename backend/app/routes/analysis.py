from flask import Blueprint, jsonify, request

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/arp', methods=['GET'])
def arp_analysis():
    normal_pps  = int(request.args.get('normal_pps',  200))
    attack_pps  = int(request.args.get('attack_pps', 5000))
    packet_size = int(request.args.get('packet_size',   60))  # bytes

    pct_increase        = ((attack_pps - normal_pps) / normal_pps) * 100
    normal_bw_bps       = normal_pps  * packet_size * 8
    attack_bw_bps       = attack_pps  * packet_size * 8
    additional_bw_bps   = attack_bw_bps - normal_bw_bps
    normal_bw_kbps      = normal_bw_bps  / 1000
    attack_bw_kbps      = attack_bw_bps  / 1000
    attack_bw_mbps      = attack_bw_bps  / 1_000_000

    return jsonify({
        "inputs": {
            "normal_pps":   normal_pps,
            "attack_pps":   attack_pps,
            "packet_size_bytes": packet_size,
        },
        "calculations": {
            "percentage_increase":       round(pct_increase, 2),
            "formula_pct":               f"(({attack_pps} - {normal_pps}) / {normal_pps}) × 100",
            "normal_bandwidth_bps":      normal_bw_bps,
            "normal_bandwidth_kbps":     round(normal_bw_kbps, 2),
            "attack_bandwidth_bps":      attack_bw_bps,
            "attack_bandwidth_kbps":     round(attack_bw_kbps, 2),
            "attack_bandwidth_mbps":     round(attack_bw_mbps, 4),
            "additional_bandwidth_bps":  additional_bw_bps,
            "formula_bw":                f"{attack_pps} pps × {packet_size} bytes × 8 = {attack_bw_bps} bps",
        },
        "impact": (
            f"ARP traffic increased by {pct_increase:.0f}%. "
            f"Normal ARP bandwidth was {normal_bw_kbps:.1f} Kbps; "
            f"under attack it surges to {attack_bw_kbps:.1f} Kbps ({attack_bw_mbps:.2f} Mbps), "
            "consuming network resources and degrading performance for legitimate traffic."
        ),
    })

@analysis_bp.route('/portscan', methods=['GET'])
def portscan_analysis():
    total_ports      = int(request.args.get('ports',         1000))
    time_per_port_ms = float(request.args.get('ms_per_port',    2))
    threshold_sec    = float(request.args.get('threshold_sec',  1))

    total_time_ms  = total_ports * time_per_port_ms
    total_time_sec = total_time_ms / 1000
    detectable     = total_time_sec > threshold_sec

    return jsonify({
        "inputs": {
            "total_ports":       total_ports,
            "time_per_port_ms":  time_per_port_ms,
            "ids_threshold_sec": threshold_sec,
        },
        "calculations": {
            "total_time_ms":  total_time_ms,
            "total_time_sec": round(total_time_sec, 3),
            "formula":        f"{total_ports} ports × {time_per_port_ms} ms = {total_time_ms} ms = {total_time_sec} s",
        },
        "detection": {
            "detectable": detectable,
            "reason": (
                f"Scan duration ({total_time_sec} s) exceeds IDS threshold ({threshold_sec} s) → "
                f"{'DETECTABLE' if detectable else 'NOT DETECTABLE'}"
            ),
            "recommendation": (
                "Tune IDS threshold to < 500 ms and implement rate-limiting ACLs on the firewall "
                "to alert/block high-frequency connection attempts from a single source."
            ),
        },
    })
