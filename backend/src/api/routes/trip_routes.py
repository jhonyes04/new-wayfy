import os
from flask import Blueprint, request, send_from_directory
from flask_jwt_extended import jwt_required
from api.controllers.trip_controller import TripController

trip_bp = Blueprint('trip_bp', __name__)

@trip_bp.route('/', methods=['POST'])
@jwt_required()
def handle_create_trip():
    return TripController.create_trip(request.get_json())

@trip_bp.route('/', methods=['GET'])
@jwt_required()
def handle_get_my_trips():
    return TripController.get_my_trips()

@trip_bp.route('/public', methods=['GET'])
@jwt_required(optional=True)
def handle_get_public_trips():
    return TripController.get_public_trips()

@trip_bp.route('/<int:trip_id>', methods=['GET'])
@jwt_required(optional=True)
def handle_get_trip(trip_id):
    return TripController.get_trip(trip_id)

@trip_bp.route('/<int:trip_id>', methods=['PUT'])
@jwt_required()
def handle_update_trip(trip_id):
    return TripController.update_trip(trip_id, request.get_json())

@trip_bp.route('/<int:trip_id>', methods=['DELETE'])
@jwt_required()
def handle_delete_trip(trip_id):
    return TripController.delete_trip(trip_id)

@trip_bp.route('/<int:trip_id>/cover', methods=['PUT'])
@jwt_required()
def handle_update_cover(trip_id):
    return TripController.update_cover(trip_id, request.files.get('file'))

@trip_bp.route('/<int:trip_id>/cover', methods=['DELETE'])
@jwt_required()
def handle_delete_cover(trip_id):
    return TripController.delete_cover(trip_id)

@trip_bp.route('/cover/<path:filename>', methods=['GET'])
def serve_cover(filename):
    cover_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../public/trip_covers')
    return send_from_directory(cover_dir, filename)

@trip_bp.route('/<int:trip_id>/fork', methods=['POST'])
@jwt_required()
def handle_fork_trip(trip_id):
    return TripController.fork_trip(trip_id)

@trip_bp.route('/<int:trip_id>/days', methods=['POST'])
@jwt_required()
def handle_add_day(trip_id):
    return TripController.add_day(trip_id, request.get_json())

@trip_bp.route('/<int:trip_id>/days/<int:day_id>', methods=['PUT'])
@jwt_required()
def handle_update_day(trip_id, day_id):
    return TripController.update_day(trip_id, day_id, request.get_json())

@trip_bp.route('/<int:trip_id>/days/<int:day_id>', methods=['DELETE'])
@jwt_required()
def handle_delete_day(trip_id, day_id):
    return TripController.delete_day(trip_id, day_id)

@trip_bp.route('/<int:trip_id>/days/<int:day_id>/places', methods=['POST'])
@jwt_required()
def handle_add_place(trip_id, day_id):
    return TripController.add_place(trip_id, day_id, request.get_json())

@trip_bp.route('/<int:trip_id>/days/<int:day_id>/places/<int:place_id>', methods=['PUT'])
@jwt_required()
def handle_update_place(trip_id, day_id, place_id):
    return TripController.update_place(trip_id, day_id, place_id, request.get_json())

@trip_bp.route('/<int:trip_id>/days/<int:day_id>/places/<int:place_id>', methods=['DELETE'])
@jwt_required()
def handle_delete_place(trip_id, day_id, place_id):
    return TripController.delete_place(trip_id, day_id, place_id)