from flask import Blueprint, request
from api.controllers.user_controller import UserController

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/register', methods=['POST'])
def handle_register():
    return UserController.register(request.get_json())

@user_bp.route('/login', methods=['POST'])
def handle_login():
    return UserController.login(request.get_json())