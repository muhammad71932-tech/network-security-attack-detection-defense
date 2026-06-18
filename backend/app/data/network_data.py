ATTACKS = [
    {
        "id": "arp_spoofing",
        "name": "ARP Spoofing / Poisoning",
        "layer": "Layer 2 – Data Link",
        "severity": "critical",
        "icon": "arp",
        "description": (
            "The attacker broadcasts forged ARP replies, mapping their own MAC address to a "
            "legitimate IP (e.g., the default gateway 192.168.10.1). All hosts update their "
            "ARP cache with the poisoned entry, routing traffic through the attacker's machine "
            "(classic Man-in-the-Middle scenario)."
        ),
        "symptoms": [
            "Sudden spike in ARP broadcast traffic (200 → 5,000 pps)",
            "Multiple users redirected to a fake login page",
            "Duplicate ARP replies for the same IP from different MACs",
            "IDS alerts: 'ARP Spoofing attempts detected'",
        ],
        "evidence": {
            "ids_alert": "ARP Spoofing attempts",
            "suspicious_entry": {"ip": "192.168.10.10", "mac": "FF:EE:DD:CC:BB:AA"},
            "normal_rate_pps": 200,
            "attack_rate_pps": 5000,
        },
        "justification": (
            "The ARP table shows 192.168.10.10 → FF:EE:DD:CC:BB:AA, a MAC pattern inconsistent "
            "with the organisational OUI (AA:BB:CC:DD:XX) present on all legitimate hosts. "
            "Combined with the 2,400 % rise in ARP traffic flagged by IDS, this conclusively "
            "indicates an active ARP poisoning attack enabling MitM interception."
        ),
    },
    {
        "id": "dns_poisoning",
        "name": "DNS Cache Poisoning",
        "layer": "Layer 7 – Application",
        "severity": "critical",
        "icon": "dns",
        "description": (
            "The attacker injects forged DNS responses into the resolver's cache, causing "
            "legitimate domain names to resolve to malicious IP addresses. Users who query "
            "those domains are transparently redirected to attacker-controlled servers "
            "(e.g., a fake login page that harvests credentials)."
        ),
        "symptoms": [
            "Multiple users redirected to a fake login page after DNS lookup",
            "IDS logs show DNS poisoning indicators",
            "Unexpected A-record changes for internal domains",
            "Phishing page hosted at a foreign IP serving the corporate login UI",
        ],
        "evidence": {
            "ids_alert": "DNS Poisoning indicators",
            "affected_service": "Internal DNS resolver",
            "observable": "Login page redirect to attacker IP",
        },
        "justification": (
            "The symptom of users being redirected to a fake login page, combined with IDS "
            "alerts for DNS poisoning indicators, strongly suggests the DNS resolver cache "
            "has been compromised. The attacker leveraged ARP spoofing (already confirmed) "
            "to intercept DNS queries and inject malicious responses, completing a layered "
            "credential-harvesting attack chain."
        ),
    },
    {
        "id": "port_scanning",
        "name": "External Port Scanning",
        "layer": "Layer 3/4 – Network / Transport",
        "severity": "high",
        "icon": "scan",
        "description": (
            "The external IP 203.0.113.45 conducted a systematic sweep across TCP/UDP ports "
            "on the public-facing server. Port scanning is a reconnaissance technique used to "
            "discover open services and potential entry points before launching an exploit."
        ),
        "symptoms": [
            "Firewall logs: high-volume connection attempts from 203.0.113.45",
            "Sequential port probes across 1,000 ports in ~2 seconds",
            "SYN packets without completing TCP three-way handshake (SYN scan)",
            "Total scan time (2 s) exceeds IDS alert threshold (1 s)",
        ],
        "evidence": {
            "source_ip": "203.0.113.45",
            "ports_scanned": 1000,
            "time_per_port_ms": 2,
            "total_time_sec": 2,
            "ids_threshold_sec": 1,
            "detectable": True,
        },
        "justification": (
            "Firewall logs explicitly record repeated probe attempts from 203.0.113.45. "
            "Scanning 1,000 ports at 2 ms/port takes 2 seconds — exceeding the 1-second IDS "
            "detection threshold. This reconnaissance activity is consistent with pre-attack "
            "enumeration targeting the DMZ web server."
        ),
    },
    {
        "id": "wifi_deauth",
        "name": "Wi-Fi Deauthentication Attack",
        "layer": "Layer 2 – Wireless (802.11)",
        "severity": "medium",
        "icon": "wifi",
        "description": (
            "An attacker sends forged 802.11 deauthentication frames to Wi-Fi clients, "
            "forcing them to disconnect from the access point. This can be used to disrupt "
            "connectivity, capture WPA handshakes during reconnection, or force clients onto "
            "a rogue access point."
        ),
        "symptoms": [
            "Wi-Fi users experiencing intermittent disconnections",
            "Repeated association / deauthentication events in AP logs",
            "Clients attempting to reconnect—exposing WPA handshakes",
            "Possible Evil Twin AP observed nearby",
        ],
        "evidence": {
            "observable": "Intermittent Wi-Fi disconnections for employees",
            "risk": "WPA2 handshake capture → offline brute-force",
        },
        "justification": (
            "The symptom of intermittent Wi-Fi disconnections, absent any hardware fault, "
            "is a textbook indicator of a deauthentication flood. Because 802.11 management "
            "frames are unauthenticated in WPA2 networks, any device can spoof deauth frames. "
            "This attack complements the MitM chain by forcing wireless clients to re-associate "
            "through a rogue AP under attacker control."
        ),
    },
]

ARP_TABLE = [
    {"ip": "192.168.10.1",  "mac": "AA:BB:CC:DD:EE:01", "status": "legitimate", "role": "Default Gateway"},
    {"ip": "192.168.10.5",  "mac": "AA:BB:CC:DD:EE:05", "status": "legitimate", "role": "App Server"},
    {"ip": "192.168.10.10", "mac": "FF:EE:DD:CC:BB:AA", "status": "suspicious", "role": "Unknown – Attacker"},
    {"ip": "192.168.10.20", "mac": "AA:BB:CC:DD:EE:20", "status": "legitimate", "role": "Workstation"},
    {"ip": "192.168.10.50", "mac": "AA:BB:CC:DD:EE:50", "status": "legitimate", "role": "Database Server"},
]

IDS_LOGS = [
    {"timestamp": "2026-04-21 09:14:03", "severity": "critical", "type": "ARP Spoofing",    "src": "192.168.10.10", "dst": "broadcast",      "msg": "Duplicate ARP reply for 192.168.10.1 from FF:EE:DD:CC:BB:AA"},
    {"timestamp": "2026-04-21 09:14:07", "severity": "critical", "type": "ARP Spoofing",    "src": "192.168.10.10", "dst": "192.168.10.20",  "msg": "Gratuitous ARP flood – 4,800 pps detected"},
    {"timestamp": "2026-04-21 09:15:22", "severity": "critical", "type": "DNS Poisoning",   "src": "192.168.10.10", "dst": "192.168.10.53",  "msg": "Forged DNS A-record for login.company.internal → 203.0.113.99"},
    {"timestamp": "2026-04-21 09:18:45", "severity": "high",     "type": "Port Scan",       "src": "203.0.113.45",  "dst": "192.168.10.100", "msg": "SYN scan across ports 1–1000 completed in 2.0 s (threshold: 1 s)"},
    {"timestamp": "2026-04-21 09:22:11", "severity": "medium",   "type": "Deauth Flood",    "src": "RF:00:00:00:00:01", "dst": "broadcast",  "msg": "802.11 deauth frames – 230 frames/sec on SSID CorpWifi"},
    {"timestamp": "2026-04-21 09:30:00", "severity": "high",     "type": "Data Exfiltration","src": "192.168.10.50","dst": "198.51.100.77",  "msg": "Unusual outbound traffic – 2.1 GB to unknown IP over port 443"},
]

FIREWALL_LOGS = [
    {"timestamp": "2026-04-21 09:18:40", "action": "ALERT",  "src": "203.0.113.45", "dst": "192.168.10.100", "port": "1-1000", "proto": "TCP",  "msg": "Port scan detected from external IP"},
    {"timestamp": "2026-04-21 09:18:41", "action": "BLOCK",  "src": "203.0.113.45", "dst": "192.168.10.100", "port": "22",     "proto": "TCP",  "msg": "SSH probe blocked"},
    {"timestamp": "2026-04-21 09:18:42", "action": "BLOCK",  "src": "203.0.113.45", "dst": "192.168.10.100", "port": "3306",   "proto": "TCP",  "msg": "MySQL probe blocked"},
    {"timestamp": "2026-04-21 09:30:01", "action": "ALLOW",  "src": "192.168.10.50","dst": "198.51.100.77",  "port": "443",    "proto": "TCP",  "msg": "Outbound HTTPS – volume anomaly"},
    {"timestamp": "2026-04-21 09:31:00", "action": "BLOCK",  "src": "192.168.10.10","dst": "192.168.10.1",   "port": "0",      "proto": "ARP",  "msg": "ARP poisoning source blocked"},
]

DEFENSE_LAYERS = [
    {
        "layer": "Network Layer",
        "icon": "network",
        "color": "blue",
        "mechanisms": [
            {
                "name": "Dynamic ARP Inspection (DAI)",
                "tool": "Managed Switch / Cisco DAI",
                "description": "Validates ARP packets against a trusted DHCP snooping binding table. Drops ARP replies whose MAC-to-IP mapping doesn't match the binding table.",
                "mitigates": ["ARP Spoofing"],
            },
            {
                "name": "DHCP Snooping",
                "tool": "Layer-2 Switch Feature",
                "description": "Filters untrusted DHCP messages and builds a binding table used by DAI. Prevents rogue DHCP servers.",
                "mitigates": ["ARP Spoofing", "Rogue DHCP"],
            },
            {
                "name": "Network Segmentation (VLANs)",
                "tool": "IEEE 802.1Q VLANs",
                "description": "Isolates DMZ, internal servers, database, and employee Wi-Fi into separate broadcast domains. Limits lateral movement.",
                "mitigates": ["ARP Spoofing", "Lateral Movement"],
            },
            {
                "name": "Firewall ACLs & IPS Tuning",
                "tool": "Next-Gen Firewall (Palo Alto / pfSense)",
                "description": "Block inbound port scans using rate-limiting ACLs. Enable IPS signatures for SYN flood and reconnaissance detection.",
                "mitigates": ["Port Scanning", "DoS"],
            },
            {
                "name": "IP Source Guard",
                "tool": "Managed Switch",
                "description": "Restricts IP traffic on untrusted ports to only those source IPs in the DHCP snooping binding table.",
                "mitigates": ["IP Spoofing", "ARP Spoofing"],
            },
        ],
    },
    {
        "layer": "Application Layer",
        "icon": "app",
        "color": "purple",
        "mechanisms": [
            {
                "name": "DNSSEC",
                "tool": "BIND 9 / Windows DNS with DNSSEC",
                "description": "Cryptographically signs DNS zone data. Resolvers validate signatures, rejecting forged DNS responses.",
                "mitigates": ["DNS Poisoning"],
            },
            {
                "name": "DNS over HTTPS / TLS (DoH/DoT)",
                "tool": "Cloudflare / Pi-hole",
                "description": "Encrypts DNS queries between clients and resolver, preventing interception and injection of malicious responses.",
                "mitigates": ["DNS Poisoning", "MitM"],
            },
            {
                "name": "TLS/mTLS Everywhere",
                "tool": "Let's Encrypt / Internal CA",
                "description": "Enforce HTTPS for all web services. Use mutual TLS for service-to-service communication to prevent credential theft.",
                "mitigates": ["MitM", "Credential Theft"],
            },
            {
                "name": "Web Application Firewall (WAF)",
                "tool": "ModSecurity / AWS WAF",
                "description": "Inspects HTTP(S) traffic for injection attacks, XSS, and other OWASP Top-10 vulnerabilities at the application layer.",
                "mitigates": ["Web Exploits", "Injection"],
            },
            {
                "name": "Database Activity Monitoring (DAM)",
                "tool": "IBM Guardium / Imperva",
                "description": "Monitors all database queries in real-time. Alerts on anomalous bulk exports or unexpected external connections.",
                "mitigates": ["Data Exfiltration"],
            },
        ],
    },
    {
        "layer": "Wireless Security",
        "icon": "wireless",
        "color": "emerald",
        "mechanisms": [
            {
                "name": "WPA3-Enterprise (802.1X / EAP-TLS)",
                "tool": "WPA3 + RADIUS (FreeRADIUS)",
                "description": "Replaces WPA2-PSK. Per-user certificates via EAP-TLS prevent credential sharing. Management frame protection (MFP/802.11w) blocks deauth flooding.",
                "mitigates": ["Wi-Fi Deauth", "Rogue AP", "Credential Theft"],
            },
            {
                "name": "802.11w Management Frame Protection",
                "tool": "Wi-Fi 6 APs (Cisco/Aruba)",
                "description": "Requires deauthentication and disassociation frames to be cryptographically authenticated, defeating deauth flood attacks.",
                "mitigates": ["Wi-Fi Deauthentication"],
            },
            {
                "name": "Rogue AP Detection",
                "tool": "Wireless IDS (Cisco WLC / Aruba AirWave)",
                "description": "Continuously scans for unauthorised access points broadcasting the corporate SSID. Auto-contains rogue APs.",
                "mitigates": ["Evil Twin / Rogue AP"],
            },
            {
                "name": "Network Access Control (NAC)",
                "tool": "Cisco ISE / Aruba ClearPass",
                "description": "Enforces posture checks before granting network access. Quarantines non-compliant devices to a restricted VLAN.",
                "mitigates": ["Unauthorised Access"],
            },
        ],
    },
    {
        "layer": "Monitoring & Response",
        "icon": "monitor",
        "color": "amber",
        "mechanisms": [
            {
                "name": "SIEM (Security Information & Event Management)",
                "tool": "Splunk / IBM QRadar / ELK Stack",
                "description": "Aggregates logs from firewall, IDS, switches, and DNS. Correlates events across layers to detect multi-stage attacks.",
                "mitigates": ["All Attack Types"],
            },
            {
                "name": "IDS/IPS Tuning",
                "tool": "Snort 3 / Suricata",
                "description": "Enable ARP anomaly, DNS anomaly, and port-scan signatures. Tune thresholds (e.g., >500 ARP/sec = alert) to reduce false positives.",
                "mitigates": ["ARP Spoofing", "Port Scanning", "DNS Poisoning"],
            },
            {
                "name": "Data Loss Prevention (DLP)",
                "tool": "Symantec DLP / Forcepoint",
                "description": "Inspects outbound traffic for sensitive data patterns. Blocks or alerts on bulk database exports to unknown external IPs.",
                "mitigates": ["Data Exfiltration"],
            },
            {
                "name": "Network Traffic Analysis (NTA)",
                "tool": "Zeek / Darktrace",
                "description": "Baselines normal traffic behaviour using ML. Flags deviations like unusual DB outbound connections or ARP anomalies.",
                "mitigates": ["ARP Spoofing", "Data Exfiltration", "Lateral Movement"],
            },
        ],
    },
]

ARCHITECTURE = {
    "current": {
        "title": "Current (Vulnerable) Architecture",
        "description": "Flat network with insufficient segmentation, no ARP inspection, and a single perimeter firewall.",
        "nodes": [
            {"id": "internet",   "label": "Internet",         "type": "external",  "x": 400, "y": 30},
            {"id": "firewall",   "label": "Perimeter Firewall","type": "security",  "x": 400, "y": 120},
            {"id": "webserver",  "label": "Web Server\n(DMZ)", "type": "server",    "x": 400, "y": 220},
            {"id": "switch",     "label": "Core Switch",       "type": "network",   "x": 400, "y": 330},
            {"id": "appserver",  "label": "App Server",        "type": "server",    "x": 200, "y": 430},
            {"id": "dbserver",   "label": "DB Server",         "type": "database",  "x": 400, "y": 430},
            {"id": "wifi",       "label": "Wi-Fi AP\n(WPA2)",  "type": "wireless",  "x": 600, "y": 430},
            {"id": "employees",  "label": "Employees",         "type": "endpoint",  "x": 600, "y": 530},
            {"id": "vpn",        "label": "VPN",               "type": "security",  "x": 200, "y": 530},
        ],
        "edges": [
            {"from": "internet",  "to": "firewall"},
            {"from": "firewall",  "to": "webserver"},
            {"from": "webserver", "to": "switch"},
            {"from": "switch",    "to": "appserver"},
            {"from": "switch",    "to": "dbserver"},
            {"from": "switch",    "to": "wifi"},
            {"from": "wifi",      "to": "employees"},
            {"from": "employees", "to": "vpn"},
            {"from": "vpn",       "to": "switch"},
        ],
        "vulnerabilities": [
            "No VLAN segmentation – all devices share 192.168.10.0/24",
            "No Dynamic ARP Inspection on the core switch",
            "No DNSSEC on internal resolver",
            "WPA2-PSK Wi-Fi vulnerable to deauth + handshake capture",
            "No DLP – database server can exfiltrate freely",
        ],
    },
    "secure": {
        "title": "Redesigned Secure Architecture",
        "description": "Defense-in-depth with VLAN segmentation, NGFW, DAI, DNSSEC, WPA3-Enterprise, and SIEM monitoring.",
        "vlans": [
            {"id": "vlan10", "name": "VLAN 10 – DMZ",       "subnet": "10.0.10.0/24", "color": "orange"},
            {"id": "vlan20", "name": "VLAN 20 – App Tier",  "subnet": "10.0.20.0/24", "color": "blue"},
            {"id": "vlan30", "name": "VLAN 30 – DB Tier",   "subnet": "10.0.30.0/24", "color": "red"},
            {"id": "vlan40", "name": "VLAN 40 – Employees", "subnet": "10.0.40.0/24", "color": "green"},
            {"id": "vlan50", "name": "VLAN 50 – Management","subnet": "10.0.50.0/24", "color": "purple"},
        ],
        "controls": [
            {"zone": "Perimeter",    "control": "Next-Gen Firewall + IPS",         "prevents": "Port scanning, external exploits"},
            {"zone": "DMZ",          "control": "WAF + TLS termination",           "prevents": "Web exploits, MitM"},
            {"zone": "Internal FW",  "control": "VLAN ACLs + micro-segmentation",  "prevents": "Lateral movement"},
            {"zone": "LAN Switch",   "control": "DAI + DHCP Snooping + IP Source Guard", "prevents": "ARP spoofing"},
            {"zone": "DNS",          "control": "DNSSEC + DoH",                    "prevents": "DNS poisoning"},
            {"zone": "Wi-Fi",        "control": "WPA3-Enterprise + 802.11w + NAC", "prevents": "Deauth, rogue AP"},
            {"zone": "Database",     "control": "DAM + DLP + encrypted backups",   "prevents": "Data exfiltration"},
            {"zone": "SOC",          "control": "SIEM + NTA + IDS/IPS (Snort)",    "prevents": "All multi-layer attacks"},
        ],
    },
}
