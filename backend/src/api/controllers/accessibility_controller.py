import os
import time
from flask import jsonify, current_app
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from werkzeug.utils import secure_filename
from api.models import db, AccessibilityReview, AccessibilityPhoto

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_PHOTOS_PER_REVIEW = 5


def _allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class AccessibilityController:

    @staticmethod
    def get_by_osm_id(osm_id: str):
        reviews = db.session.execute(
            select(AccessibilityReview)
            .options(joinedload(AccessibilityReview.last_modified_by))
            .where(AccessibilityReview.osm_id == osm_id)
        ).scalars().unique().all()

        counts = {'yes': 0, 'limited': 0, 'no': 0}
        for r in reviews:
            if r.wheelchair in counts:
                counts[r.wheelchair] += 1

        total = sum(counts.values())
        consensus = max(counts, key=counts.get) if total > 0 else None

        return jsonify({
            'osm_id': osm_id,
            'total_reviews': len(reviews),
            'wheelchair_consensus': consensus,
            'wheelchair_counts': counts,
            'reviews': [r.serialize() for r in reviews],
        }), 200

    @staticmethod
    def upsert(osm_id: str, data: dict, current_user_id: int):
        if not data:
            return jsonify({'msg': 'No se recibieron datos'}), 400

        wheelchair = data.get('wheelchair')
        if wheelchair and wheelchair not in ('yes', 'limited', 'no'):
            return jsonify({'msg': 'Valor de wheelchair inválido'}), 400

        existing = db.session.execute(
            select(AccessibilityReview).where(AccessibilityReview.osm_id == osm_id)
        ).scalar_one_or_none()

        if existing:
            existing.wheelchair = wheelchair
            existing.has_ramp = data.get('has_ramp')
            existing.has_elevator = data.get('has_elevator')
            existing.has_accessible_toilet = data.get('has_accessible_toilet')
            existing.has_accessible_parking = data.get('has_accessible_parking')
            existing.automatic_door = data.get('automatic_door')
            existing.description = data.get('description')
            existing.place_name = data.get('place_name')
            existing.last_modified_by_id = current_user_id  # ← registra quién editó
            review = existing
        else:
            review = AccessibilityReview(
                osm_id=osm_id,
                osm_type=data.get('osm_type', 'node'),
                place_name=data.get('place_name'),
                last_modified_by_id=current_user_id,
                wheelchair=wheelchair,
                has_ramp=data.get('has_ramp'),
                has_elevator=data.get('has_elevator'),
                has_accessible_toilet=data.get('has_accessible_toilet'),
                has_accessible_parking=data.get('has_accessible_parking'),
                automatic_door=data.get('automatic_door'),
                description=data.get('description'),
            )
            db.session.add(review)

        db.session.commit()
        return jsonify(review.serialize()), 200
    
    @staticmethod
    def get_place_review(osm_id: str):
        review = db.session.execute(
            select(AccessibilityReview).where(AccessibilityReview.osm_id == osm_id)
        ).scalar_one_or_none()

        if not review:
            return jsonify({'msg': 'Sin datos de accesibilidad'}), 404

        return jsonify(review.serialize()), 200

    @staticmethod
    def upload_photos(review_id: int, files, current_user_id: int):
        review = db.session.get(AccessibilityReview, review_id)
        if not review:
            return jsonify({'msg': 'Reseña no encontrada'}), 404

        existing_count = len(review.photos)
        if existing_count + len(files) > MAX_PHOTOS_PER_REVIEW:
            return jsonify({'msg': f'Máximo {MAX_PHOTOS_PER_REVIEW} fotos por lugar'}), 400

        photos_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), '../../../public/accessibility_photos'
        )
        os.makedirs(photos_dir, exist_ok=True)

        saved = []
        for i, file in enumerate(files):
            if not _allowed_file(file.filename):
                continue
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = secure_filename(f"{int(time.time())}_{current_user_id}_{i}.{ext}")
            file.save(os.path.join(photos_dir, filename))

            photo = AccessibilityPhoto(
                review_id=review_id,
                user_id=current_user_id,
                filename=filename,
                caption=file.filename,
            )
            db.session.add(photo)
            saved.append(photo)

        db.session.commit()
        return jsonify([p.serialize() for p in saved]), 201

    @staticmethod
    def serve_photo(filename: str):
        import flask
        photos_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), '../../../public/accessibility_photos'
        )
        return flask.send_from_directory(photos_dir, filename)
    
    @staticmethod
    def delete_photo(photo_id: int, current_user_id: int):
        photo = db.session.get(AccessibilityPhoto, photo_id)
        
        if not photo:
            return jsonify({'msg': 'Foto no encontrada'}), 404
        if photo.user_id != current_user_id:
            return jsonify({'msg': 'Sin permisos para eliminar esta foto'}), 403
        
        photos_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), '../../../public/accessibility_photos'
        )
        
        file_path = os.path.join(photos_dir, photo.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            
        db.session.delete(photo)
        db.session.commit()
        
        return jsonify({'msg': 'Foto eliminada'}), 200
            
    @staticmethod
    def get_wheelchair_map():
        rows = db.session.execute(
            select(AccessibilityReview.osm_id, AccessibilityReview.wheelchair)
        ).all()
        
        result = {r.osm_id: r.wheelchair for r in rows if r.wheelchair}
        
        return jsonify(result), 200