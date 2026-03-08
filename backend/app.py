from flask import Flask
from flask_cors import CORS
from .vision_routes import vision_bp
from .esp_routes import esp_bp
from flask import jsonify

from backend.focus_store import get_recent_samples
from backend.recommendation_loop import start_recommendation_loop

def create_app():

    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(vision_bp)
    app.register_blueprint(esp_bp)

    start_recommendation_loop()

    return app

app = create_app()

@app.route('/debug/samples')
def debug_samples():
    return {'samples': get_recent_samples()}

@app.route('/api/focus/history')
def focus_history():

    samples = get_recent_samples()

    return jsonify({
        'history': samples
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)