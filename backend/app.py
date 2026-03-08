from flask import Flask
from .vision_routes import vision_bp
from .esp_routes import esp_bp

def create_app():

    app = Flask(__name__)

    app.register_blueprint(vision_bp)
    app.register_blueprint(esp_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)