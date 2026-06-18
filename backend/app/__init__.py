from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.attacks     import attacks_bp
    from .routes.analysis    import analysis_bp
    from .routes.defense     import defense_bp
    from .routes.architecture import architecture_bp

    app.register_blueprint(attacks_bp,      url_prefix='/api/attacks')
    app.register_blueprint(analysis_bp,     url_prefix='/api/analysis')
    app.register_blueprint(defense_bp,      url_prefix='/api/defense')
    app.register_blueprint(architecture_bp, url_prefix='/api/architecture')

    return app
