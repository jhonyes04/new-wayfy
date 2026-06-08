from flask import Blueprint
from api.routes.user_routes import user_bp

api = Blueprint('api', __name__)

api.register_blueprint(user_bp, url_prefix='/users')
