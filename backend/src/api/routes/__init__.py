from flask import Blueprint
from api.routes.user_routes import user_bp
from api.routes.ai_routes import ai_bp
from api.routes.accessibility_routes import accessibility_bp

api = Blueprint('api', __name__)

api.register_blueprint(user_bp, url_prefix='/users')
api.register_blueprint(ai_bp, url_prefix='/ai')
api.register_blueprint(accessibility_bp, url_prefix='/accessibility')