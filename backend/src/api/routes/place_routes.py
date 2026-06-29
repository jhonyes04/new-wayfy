from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from api.controllers.place_controller import PlaceController

place_bp = Blueprint('place_bp', __name__)

@place_bp.route('/', methods=['POST'])
@jwt_required()
def handle_create():
    current_user_id = int(get_jwt_identity())
    return PlaceController.create(request.get_json(), current_user_id)

@place_bp.route('/', methods=['GET'])
def handle_get_by_bbox():
    return PlaceController.get_by_bbox(
        request.args.get('south'),
        request.args.get('west'),
        request.args.get('north'),
        request.args.get('east'),
    )
    
@place_bp.route('/pending', methods=['GET'])
@jwt_required()
def handle_get_pending():
    claims = get_jwt()
    return PlaceController.get_pending(claims.get('is_admin', False))

@place_bp.route('/mine/pending', methods=['GET'])
@jwt_required()
def handle_get_my_pending():
    current_user_id = int(get_jwt_identity())
    return PlaceController.get_my_pending(current_user_id)

@place_bp.route('/<int:place_id>/status', methods=['PATCH'])
@jwt_required()
def handle_update_status(place_id):
    claims = get_jwt()
    return PlaceController.update_status(
        place_id,
        request.get_json(),
        claims.get('is_admin', False)
    )