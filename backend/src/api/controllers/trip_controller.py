import os
import time
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import select
from api.models import db
from api.models.trip_model import Trip, TripDay, TripDayPlace
from datetime import date as date_type, time as time_type
from werkzeug.utils import secure_filename

def _parse_time(raw):
                if not raw:
                    return None
                
                try:
                    h, m = raw.split(':')
                    return time_type(int(h), int(m))
                except Exception:
                    return None

class TripController:
    @staticmethod
    def create_trip(data: dict):
        current_user_id = int(get_jwt_identity())
        
        if not data or not data.get('title'):
            return jsonify({'msg': 'El título del viaje es obligatorio'}), 400
        
        try:
            trip = Trip(
                user_id=current_user_id,
                title=data['title'],
                description=data.get('description'),
                is_public=data.get('is_public', False)
            )
            
            db.session.add(trip)
            db.session.commit()
            
            return jsonify({'msg': 'Viaje creado', 'trip': trip.serialize()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al crear el viaje', 'error': str(e)}), 500
        
    @staticmethod
    def get_my_trips():
        current_user_id = int(get_jwt_identity())
        
        try:
            trips = db.session.execute(
                select(Trip).filter_by(user_id=current_user_id).order_by(Trip.created_at.desc())
            ).scalars().all()
            
            return jsonify({'total': len(trips), 'trips': [t.serialize() for t in trips]}), 200
        except Exception as e:
            return jsonify({'msg': 'Error al obtener viajes', 'error': str(e)}), 500
        
    @staticmethod
    def get_public_trips():
        try:
            trips = db.session.execute(
                select(Trip).filter_by(is_public=True).order_by(Trip.created_at.desc())
            ).scalars().all()
            
            return jsonify({'total': len(trips), 'trips': [t.serialize() for t in trips]}), 200
        except Exception as e:
            return jsonify({'msg': 'Error al obtener viajes públicos', 'error': str(e)}), 500
        
    @staticmethod
    def get_trip(trip_id: int):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()
        
        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if not trip.is_public and trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para ver este viaje'}), 403

        return jsonify(trip.serialize(include_days=True)), 200
    
    @staticmethod
    def update_trip(trip_id: int, data: dict):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        try:
            if 'title' in data:
                trip.title = data['title']
            if 'description' in data:
                trip.description = data['description']
            if 'is_public' in data:
                trip.is_public = data['is_public']
            db.session.commit()
            return jsonify({'msg': 'Viaje actualizado', 'trip': trip.serialize()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al actualizar el viaje', 'error': str(e)}), 500
        
    @staticmethod
    def update_cover(trip_id: int, file_object):
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
        current_user_id = int(get_jwt_identity())
        
        if not file_object or file_object.filename == '':
            return jsonify({'msg': 'No se ha seleccionado ningún archivo'}), 400
        
        extension = file_object.filename.rsplit('.', 1)[-1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            return jsonify({'msg': 'Formato no permitido. Usa PNG, JPG, JPEG o WEBP'}), 400
        
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()
        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403
        
        try:
            base_dir = os.path.abspath(os.path.dirname(__file__))
            cover_dir = os.path.abspath(os.path.join(base_dir, '../../..', 'public', 'trip_covers'))
            os.makedirs(cover_dir, exist_ok=True)
            
            if trip.cover_image:
                old_path = os.path.join(cover_dir, trip.cover_image)
                if os.path.exists(old_path):
                    os.remove(old_path)
                    
            timestamp = int(time.time())
            filename = secure_filename(f'trip_{trip_id}_{timestamp}.{extension}')
            file_object.save(os.path.join(cover_dir, filename))
            
            trip.cover_image = filename
            db.session.commit()
            
            return jsonify({'msg': 'Imagen actualizada', 'trip': trip.serialize()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al guardar la imagen', 'error': str(e)}), 500
        
    @staticmethod
    def delete_cover(trip_id: int):
        current_user_id = int(get_jwt_identity())
        
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()
        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 400
        
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar ese viaje'}), 403
        
        if not trip.cover_image:
            return jsonify({'msg': 'Este viaje no tiene imagen'}), 400
        
        try:
            base_dir = os.path.abspath(os.path.dirname(__file__))
            cover_dir = os.path.abspath(os.path.join(base_dir, '../../..', 'public', 'trip_covers'))
            old_path = os.path.join(cover_dir, trip.cover_image)
            
            if os.path.exists(old_path):
                os.remove(old_path)
                
            trip.cover_image = None
            db.session.commit()
            
            return jsonify({'msg': 'Imagen eliminada', 'trip': trip.serialize()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al eliminar la imagen', 'error': str(e)}), 500
        
    @staticmethod
    def delete_trip(trip_id: int):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para eliminar este viaje'}), 403

        try:
            db.session.delete(trip)
            db.session.commit()
            return jsonify({'msg': 'Viaje eliminado'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al eliminar el viaje', 'error': str(e)}), 500

    @staticmethod
    def fork_trip(trip_id: int):
        current_user_id = int(get_jwt_identity())
        original = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not original:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if not original.is_public:
            return jsonify({'msg': 'Solo se pueden copiar viajes públicos'}), 403

        try:
            new_trip = Trip(
                user_id=current_user_id,
                title=f'Copia de {original.title}',
                description=original.description,
                is_public=False,
                original_trip_id=original.id,
            )
            db.session.add(new_trip)
            db.session.flush()

            for day in original.days:
                new_day = TripDay(
                    trip_id=new_trip.id,
                    day_number=day.day_number,
                    date=day.date,
                    title=day.title,
                    notes=day.notes,
                )
                db.session.add(new_day)
                db.session.flush()

                for place in day.places:
                    new_place = TripDayPlace(
                        trip_day_id=new_day.id,
                        favorite_id=None,
                        place_name=place.place_name,
                        latitude=place.latitude,
                        longitude=place.longitude,
                        osm_id=place.osm_id,
                        sub_type=place.sub_type,
                        order=place.order,
                        notes=place.notes,
                    )
                    db.session.add(new_place)

            db.session.commit()
            return jsonify({'msg': 'Viaje copiado correctamente', 'trip': new_trip.serialize(include_days=True)}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al copiar el viaje', 'error': str(e)}), 500
        
    @staticmethod
    def add_day(trip_id: int, data: dict):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        data = data or {}
        try:
            day_number = len(trip.days) + 1
            raw_date = data.get('date')
            day = TripDay(
                trip_id=trip_id,
                day_number=data.get('day_number', day_number),
                date=date_type.fromisoformat(raw_date) if raw_date else None,
                title=data.get('title'),
                notes=data.get('notes'),
            )
            db.session.add(day)
            db.session.commit()
            return jsonify({'msg': 'Día añadido', 'day': day.serialize()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al añadir el día', 'error': str(e)}), 500

    @staticmethod
    def update_day(trip_id: int, day_id: int, data: dict):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        day = db.session.execute(select(TripDay).filter_by(id=day_id, trip_id=trip_id)).scalar_one_or_none()
        if not day:
            return jsonify({'msg': 'Día no encontrado'}), 404

        try:
            if 'date' in data:
                if data['date']:
                    day.date = date_type.fromisoformat(data['date'])
                else:
                    day.date = None
            if 'title' in data:
                day.title = data['title']
            if 'notes' in data:
                day.notes = data['notes']
            if 'day_number' in data:
                day.day_number = data['day_number']
            db.session.commit()
            return jsonify({'msg': 'Día actualizado', 'day': day.serialize(include_places=True)}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al actualizar el día', 'error': str(e)}), 500

    @staticmethod
    def delete_day(trip_id: int, day_id: int):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        day = db.session.execute(select(TripDay).filter_by(id=day_id, trip_id=trip_id)).scalar_one_or_none()
        if not day:
            return jsonify({'msg': 'Día no encontrado'}), 404

        try:
            db.session.delete(day)
            db.session.commit()
            return jsonify({'msg': 'Día eliminado'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al eliminar el día', 'error': str(e)}), 500
        
    @staticmethod
    def add_place(trip_id: int, day_id: int, data: dict):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        day = db.session.execute(select(TripDay).filter_by(id=day_id, trip_id=trip_id)).scalar_one_or_none()
        if not day:
            return jsonify({'msg': 'Día no encontrado'}), 404

        if not data or not data.get('place_name'):
            return jsonify({'msg': 'El nombre del lugar es obligatorio'}), 400

        try:                
            order = len(day.places)
            place = TripDayPlace(
                trip_day_id=day_id,
                favorite_id=data.get('favorite_id'),
                place_name=data['place_name'],
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                osm_id=data.get('osm_id'),
                sub_type=data.get('sub_type'),
                order=data.get('order', order),
                notes=data.get('notes'),
                visit_time=_parse_time(data.get('visit_time')),
                visit_time_end=_parse_time(data.get('visit_time_end'))
            )
            db.session.add(place)
            db.session.commit()
            return jsonify({'msg': 'Lugar añadido', 'place': place.serialize()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al añadir el lugar', 'error': str(e)}), 500

    @staticmethod
    def update_place(trip_id: int, day_id: int, place_id: int, data: dict):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        place = db.session.execute(select(TripDayPlace).filter_by(id=place_id, trip_day_id=day_id)).scalar_one_or_none()
        if not place:
            return jsonify({'msg': 'Lugar no encontrado'}), 404

        try:
            if 'place_name' in data:
                place.place_name = data['place_name']
            if 'notes' in data:
                place.notes = data['notes']
            if 'visit_time' in data:
                place.visit_time = _parse_time(data['visit_time'])
            if 'visit_time_end' in data:
                place.visit_time_end = _parse_time(data['visit_time_end'])
            if 'order' in data:
                place.order = data['order']
            if 'trip_day_id' in data:
                place.trip_day_id = data['trip_day_id']
            db.session.commit()
            return jsonify({'msg': 'Lugar actualizado', 'place': place.serialize()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al actualizar el lugar', 'error': str(e)}), 500

    @staticmethod
    def delete_place(trip_id: int, day_id: int, place_id: int):
        current_user_id = int(get_jwt_identity())
        trip = db.session.execute(select(Trip).filter_by(id=trip_id)).scalar_one_or_none()

        if not trip:
            return jsonify({'msg': 'Viaje no encontrado'}), 404
        if trip.user_id != current_user_id:
            return jsonify({'msg': 'No tienes permiso para editar este viaje'}), 403

        place = db.session.execute(select(TripDayPlace).filter_by(id=place_id, trip_day_id=day_id)).scalar_one_or_none()
        if not place:
            return jsonify({'msg': 'Lugar no encontrado'}), 404

        try:
            db.session.delete(place)
            db.session.commit()
            return jsonify({'msg': 'Lugar eliminado'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al eliminar el lugar', 'error': str(e)}), 500
