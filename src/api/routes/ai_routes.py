from flask import Blueprint, request
from api.controllers.ai_controller import AIController
ai_bp = Blueprint('ai_bp', __name__)

@ai_bp.route('/mapgpt', methods=['POST'])
def handle_mapgpt():
    data = request.get_json()
    
    return AIController.map_gpt(data['prompt'])