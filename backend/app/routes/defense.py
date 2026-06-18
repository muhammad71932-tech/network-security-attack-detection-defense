from flask import Blueprint, jsonify
from ..data.network_data import DEFENSE_LAYERS

defense_bp = Blueprint('defense', __name__)

@defense_bp.route('/', methods=['GET'])
def get_defense():
    return jsonify(DEFENSE_LAYERS)

@defense_bp.route('/summary', methods=['GET'])
def get_summary():
    total_controls = sum(len(layer['mechanisms']) for layer in DEFENSE_LAYERS)
    return jsonify({
        "layers": len(DEFENSE_LAYERS),
        "total_controls": total_controls,
        "layer_names": [l['layer'] for l in DEFENSE_LAYERS],
    })
