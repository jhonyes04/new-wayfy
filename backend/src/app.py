"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

from api.utils import APIException, generate_sitemap, limiter
from api.models import db
from api.routes import api
from api.controllers.user_controller import bcrypt  # Instancia compartida del controlador
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# --- CONFIGURACIÓN DE ACCESOS Y SEGURIDAD (CORS / BCRYPT) ---
# CORS(app)
cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
CORS(app, origins=[origin.strip() for origin in cors_origins.split(",") if origin.strip()])


bcrypt.init_app(app)
limiter.init_app(app)

# --- CONFIGURACIÓN DE SEGURIDAD PARA JWT ---
# app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", os.getenv("FLASK_APP_KEY", "fallback-secret-key"))
jwt_secret = os.getenv("JWT_SECRET_KEY")
if not jwt_secret:
    raise RuntimeError("JWT_SECRET_KEY no está configurado. Define esta variable de entorno")
app.config['JWT_SECRET_KEY'] = jwt_secret

expires_hours = float(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 1))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=expires_hours)

jwt = JWTManager(app)

# --- CONFIGURACIÓN DE BASE DE DATOS ---
# Lee 'sqlite:///wayfy.db' directamente desde tu archivo .env
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///project.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- INICIALIZACIÓN DE EXTENSIONES DEL SISTEMA ---
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Componentes de administración y comandos CLI internos
setup_admin(app)
setup_commands(app)

# Agregar todos los endpoints de la API modularizada con el prefijo "/api"
app.register_blueprint(api, url_prefix='/api')

# Manejo centralizado de excepciones personalizadas de la API
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Enrutamiento para desarrollo (Sitemap) y producción (Servir el Frontend)
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evita almacenar en caché estáticos en desarrollo
    return response

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=os.getenv('FLASK_DEBUG') == "1")