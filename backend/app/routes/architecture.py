from flask import Blueprint, jsonify
from ..data.network_data import ARCHITECTURE

architecture_bp = Blueprint('architecture', __name__)

@architecture_bp.route('/', methods=['GET'])
def get_architecture():
    return jsonify(ARCHITECTURE)

@architecture_bp.route('/current', methods=['GET'])
def get_current():
    return jsonify(ARCHITECTURE['current'])

@architecture_bp.route('/secure', methods=['GET'])
def get_secure():
    return jsonify(ARCHITECTURE['secure'])
