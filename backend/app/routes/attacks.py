from flask import Blueprint, jsonify
from ..data.network_data import ATTACKS, ARP_TABLE, IDS_LOGS, FIREWALL_LOGS

attacks_bp = Blueprint('attacks', __name__)

@attacks_bp.route('/', methods=['GET'])
def get_attacks():
    return jsonify(ATTACKS)

@attacks_bp.route('/arp-table', methods=['GET'])
def get_arp_table():
    return jsonify(ARP_TABLE)

@attacks_bp.route('/ids-logs', methods=['GET'])
def get_ids_logs():
    return jsonify(IDS_LOGS)

@attacks_bp.route('/firewall-logs', methods=['GET'])
def get_firewall_logs():
    return jsonify(FIREWALL_LOGS)

@attacks_bp.route('/summary', methods=['GET'])
def get_summary():
    critical = sum(1 for a in ATTACKS if a['severity'] == 'critical')
    high     = sum(1 for a in ATTACKS if a['severity'] == 'high')
    medium   = sum(1 for a in ATTACKS if a['severity'] == 'medium')
    return jsonify({
        "total_attacks": len(ATTACKS),
        "critical": critical,
        "high": high,
        "medium": medium,
        "suspicious_hosts": sum(1 for e in ARP_TABLE if e['status'] == 'suspicious'),
        "ids_alerts": len(IDS_LOGS),
        "firewall_blocks": sum(1 for l in FIREWALL_LOGS if l['action'] == 'BLOCK'),
    })
