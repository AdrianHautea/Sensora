from flask import Flask
from .vision_routes import vision_bp
from .esp_routes import esp_bp

from backend.focus_store import get_recent_samples

def create_app():

    app = Flask(__name__)

    app.register_blueprint(vision_bp)
    app.register_blueprint(esp_bp)

    return app

app = create_app()

@app.route("/debug/samples")
def debug_samples():
    return {"samples": get_recent_samples()}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)