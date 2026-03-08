from flask import Blueprint, request, jsonify
from .focus_store import add_sample

vision_bp = Blueprint('vision', __name__)

@vision_bp.route('/vision', methods=['POST'])
def receive_vision_data():

    data = request.json
    if data is None:
        return jsonify({'error': 'No data'}), 400

    add_sample(data)
    print("Received sample:", data)
    return jsonify({'status': 'received'})