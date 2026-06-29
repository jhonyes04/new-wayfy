import json
from flask import jsonify
from sqlalchemy import select
from api.models import db
from api.models.place_model import Place

PROIMITY_DEGRESS = 0.0003

class PlaceController:
    @staticmethod
    def create(data: dict, current_user_id: int):
        if not data:
            return jsonify({'msg': 'Datos requeridos'}), 400
        
        required = ['name', 'longitude', 'latitude']
        if not all(field in data for field in required):
            return jsonify({'msg': 'nombre, longitud y latitud son obligatorios'}), 400
        
        name = data['name']
        longitude = float(data['longitude'])
        latitude = float(data['latitude'])
        sub_type = data.get('sub_type', None)
        place_label = data.get('place_label', None)
        
        existing = db.session.execute(
            select(Place).where(
                Place.longitude.between(longitude - PROIMITY_DEGRESS, longitude + PROIMITY_DEGRESS),
                Place.latitude.between(latitude - PROIMITY_DEGRESS, latitude + PROIMITY_DEGRESS)
            )
        ).scalars().first()
        
        if existing:
            return jsonify({
                'msg': 'Ya existe un lugar cercano',
                'place': existing.serialize()
            }), 200
            
        try:
            new_place = Place(
                name=name,
                longitude=longitude,
                latitude=latitude,
                sub_type=sub_type,
                place_label=place_label,
                created_by=current_user_id,
                status='pending',
            )
            db.session.add(new_place)
            db.session.commit()

            return jsonify({
                'msg': 'Lugar enviado para revisión',
                'place': new_place.serialize()
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al crear el lugar', 'error': str(e)}), 500
        
    @staticmethod
    def get_by_bbox(south, west, north, east):
        try:
            south, west, north, east = float(south), float(west), float(north), float(east)
        except (TypeError, ValueError):
            return jsonify({'msg': 'Parámetros bbox inválidos'}), 400

        try:
            places = db.session.execute(
                select(Place).where(
                    Place.status == 'approved',
                    Place.latitude.between(south, north),
                    Place.longitude.between(west, east),
                )
            ).scalars().all()

            return jsonify({
                'total': len(places),
                'places': [p.serialize() for p in places]
            }), 200

        except Exception as e:
            return jsonify({'msg': 'Error al obtener lugares', 'error': str(e)}), 500
        
    @staticmethod
    def get_pending(current_user_is_admin: bool):
        if not current_user_is_admin:
            return jsonify({'msg': 'No tienes permiso'}), 403

        try:
            places = db.session.execute(
                select(Place).where(Place.status == 'pending')
                .order_by(Place.created_at.asc())
            ).scalars().all()

            return jsonify({
                'total': len(places),
                'places': [p.serialize() for p in places]
            }), 200

        except Exception as e:
            return jsonify({'msg': 'Error al obtener lugares pendientes', 'error': str(e)}), 500
        
    @staticmethod
    def update_status(place_id: int, data: dict, current_user_is_admin: bool):
        if not current_user_is_admin:
            return jsonify({'msg': 'No tienes permiso'}), 403

        if not data or 'status' not in data:
            return jsonify({'msg': 'status es requerido'}), 400

        new_status = data['status']
        if new_status not in ('approved', 'rejected'):
            return jsonify({'msg': 'status debe ser approved o rejected'}), 400

        place = db.session.get(Place, place_id)
        if not place:
            return jsonify({'msg': 'Lugar no encontrado'}), 404

        try:
            place.status = new_status
            db.session.commit()

            return jsonify({
                'msg': f'Lugar {new_status}',
                'place': place.serialize()
            }), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al actualizar el estado', 'error': str(e)}), 500

    @staticmethod
    def get_my_pending(current_user_id: int):
        try:
            places = db.session.execute(
                select(Place).where(
                    Place.created_by == current_user_id,
                    Place.status == 'pending',
                )
            ).scalars().all()

            return jsonify({
                'total': len(places),
                'places': [p.serialize() for p in places]
            }), 200

        except Exception as e:
            return jsonify({'msg': 'Error al obtener tus lugares', 'error': str(e)}), 500