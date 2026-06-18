from flask import Blueprint, request, jsonify
from api.controllers.ai_controller import AIController
from api.utils import limiter

ai_bp = Blueprint('ai_bp', __name__)

@ai_bp.route('/mapgpt', methods=['POST'])
@limiter.limit('20 per minute')
def handle_mapgpt():
    data = request.get_json(silent=True) or {}
    prompt = data.get('prompt')

    if not prompt or not str(prompt).strip():
        return jsonify({'msg': 'Prompt vacío'}), 400

    return AIController.map_gpt(prompt)

@ai_bp.route('/geocode', methods=['GET'])
@limiter.limit('30 per minute')
def handle_geocode():
    query = request.args.get('q', '')
    return  AIController.geocode(query)

@ai_bp.route('/geocode-poi', methods=['GET'])
@limiter.limit('30 per minute')
def handle_geocode_poi():
    query = request.args.get('q', '')
    return AIController.geocode_poi(query)