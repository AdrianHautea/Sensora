from flask import Blueprint, jsonify
from .focus_store import get_recent_samples
from .recommendation import generate_recommendation

esp_bp = Blueprint('esp', __name__)

latest_recommendation = 'Start studying!'

@esp_bp.route('/esp/recommendation', methods=['GET'])
def get_recommendation():

    global latest_recommendation
    samples = get_recent_samples()

    if len(samples) > 5:
        latest_recommendation = generate_recommendation(samples)

    return jsonify({
        'recommendation': latest_recommendation
    })