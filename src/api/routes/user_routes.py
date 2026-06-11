from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from api.controllers.user_controller import UserController

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/register', methods=['POST'])
def handle_register():
    return UserController.register(request.get_json())

@user_bp.route('/login', methods=['POST'])
def handle_login():
    return UserController.login(request.get_json())

@user_bp.route('/', methods=['GET'])
@jwt_required()
def handle_get_all():
    return UserController.get_all()

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def handle_get_by_id(user_id):
    return UserController.get_by_id(user_id)

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def handle_update_user(user_id):
    data = request.get_json()
    claims = get_jwt()
    current_user_id = int(get_jwt_identity())
    current_user_is_admin = claims.get('is_admin', False)
    
    return UserController.update(
        user_id=user_id, 
        data=data,
        current_user_id=current_user_id,
        current_user_is_admin=current_user_is_admin
    )

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def handle_delete_user(user_id):
    claims = get_jwt()
    current_user_id = int(get_jwt_identity())
    current_user_is_admin = claims.get('is_admin', False)
    
    return UserController.delete(
        user_id=user_id,
        current_user_id=current_user_id,
        current_user_is_admin=current_user_is_admin
    )

@user_bp.route('/avatar', methods=['PUT'])
@jwt_required()
def handle_update_avatar():
    current_user_id = get_jwt_identity()
    
    file_object = request.files.get('avatar')
    
    return UserController.update_avatar(current_user_id, file_object)