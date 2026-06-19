from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.controllers.accessibility_controller import AccessibilityController

accessibility_bp = Blueprint('accessibility_bp', __name__)

@accessibility_bp.route('/<string:osm_id>', methods=['GET'])
def handle_get(osm_id):
    return AccessibilityController.get_by_osm_id(osm_id)


@accessibility_bp.route('/<string:osm_id>', methods=['POST'])
@jwt_required()
def handle_upsert(osm_id):
    current_user_id = int(get_jwt_identity())
    return AccessibilityController.upsert(osm_id, request.get_json(), current_user_id)


@accessibility_bp.route('/<int:review_id>/photos', methods=['POST'])
@jwt_required()
def handle_upload_photos(review_id):
    current_user_id = int(get_jwt_identity())
    files = request.files.getlist('photos')
    return AccessibilityController.upload_photos(review_id, files, current_user_id)

@accessibility_bp.route('/photos/<int:photo_id>', methods=['DELETE'])
@jwt_required()
def handle_delete_photo(photo_id):
    curren_user_id = int(get_jwt_identity())
    return AccessibilityController.delete_photo(photo_id, curren_user_id)

@accessibility_bp.route('/photos/<path:filename>', methods=['GET'])
def handle_serve_photo(filename):
    return AccessibilityController.serve_photo(filename)

@accessibility_bp.route('/<string:osm_id>/review', methods=['GET'])
def handle_get_place_review(osm_id):
    return AccessibilityController.get_place_review(osm_id)