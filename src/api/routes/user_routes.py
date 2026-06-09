from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.controllers.user_controller import UserController

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/register', methods=['POST'])
def handle_register():
    return UserController.register(request.get_json())

@user_bp.route('/login', methods=['POST'])
def handle_login():
    return UserController.login(request.get_json())

@user_bp.route('/avatar', methods=['PUT'])
@jwt_required()
def handle_update_avatar():
    current_user_id = get_jwt_identity()
    
    file_object = request.files.get('avatar')
    
    return UserController.update_avatar(current_user_id, file_object)