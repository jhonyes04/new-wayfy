import json
import os
from flask import jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from sqlalchemy import select
from api.models import db, User
from werkzeug.utils import secure_filename
from datetime import timedelta

bcrypt = Bcrypt()

class UserController:
    @staticmethod
    def register(data: dict):
        required_fields = ['firstname', 'lastname', 'email', 'password', 'confirmPassword']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({'msg': 'Faltan datos obligatorios para el registro'}), 400
        
        if data['password'] != data['confirmPassword']:
            return jsonify({'msg': 'Las contraseñas no coinciden'}), 400
        
        mobility_list = data.get('selectedMobility', [])
        
        if not isinstance(mobility_list, list) or len(mobility_list) < 1:
            return jsonify({'msg': 'Debe seleccionar al menos una opción de movilidad'}), 400
        
        existing_user = db.session.execute(select(User).filter_by(email = data['email'])).scalar_one_or_none()
        if existing_user:
            return jsonify({'msg': 'El correo electrónico ya está registrado'}), 400
        
        hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        new_user = User(
            firstname = data['firstname'],
            lastname = data['lastname'],
            email = data['email'],
            password = hashed_pw,
            selected_mobility = json.dumps(mobility_list),
            avatar = data.get('avatar', 'default_avatar.png'),
            is_active = True,
            is_admin = False
        )
        
        try:
            db.session.add(new_user)
            db.session.commit()
            
            expires = timedelta(hours=1)
            token = create_access_token(
                identity=str(new_user.id),
                expires_delta=expires,
                additional_claims={
                    'firstname': new_user.firstname,
                    'lastname': new_user.lastname,
                    'email': new_user.email,
                    'avatar': f'/public/avatar/{new_user.avatar}',
                    'is_active': new_user.is_active,
                    'is_admin': new_user.is_admin
                }
            )
            
            return jsonify({
                'msg': 'Usuario registrado correctamente',
                'token': token,
                'expiresIn': int(expires.total_seconds()),
                'user': new_user.serialize()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error interno del servidor', 'error': str(e)}), 500
        

    @staticmethod
    def login(data: dict):
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'msg': 'Email o contraseña requeridos'}), 400
        
        user = db.session.execute(select(User).filter_by(email = data['email'])).scalar_one_or_none()
        
        if not user or not bcrypt.check_password_hash(user.password, data['password']):
            return jsonify({'msg': 'Credenciales incorrectas'}), 401
        
        if not user.is_active:
            return jsonify({'msg': 'Cuenta inactiva'})
        
        expires = timedelta(hours=1)
        token = create_access_token(
            identity=str(user.id), 
            expires_delta=expires,
            additional_claims={
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.email,
                'avatar': f'/public/avatar/{user.avatar}',
                'is_active': user.is_active,
                'is_admin': user.is_admin,
            }
        )
        
        return jsonify({
            'msg': 'Autenticación existosa',
            'token': token,
            'expiresIn': int(expires.total_seconds()),
            'user': user.serialize()
        }), 200
        
    @staticmethod
    def get_all():
        try:
            users =db.session.execute(select(User)).scalar().all()
            
            return jsonify({
                'total': len(users),
                'users': [user.serialize() for user in users]
            }), 200
        except Exception as e:
            return jsonify({'msg': 'Error al obtener usuarios', 'error': str(e)}), 500
        
    @staticmethod
    def get_by_id(user_id: int):
        user = db.session.execute(select(User).filter_by(id=user_id)).scalar_one_or_none()
        
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 400
        
        return jsonify(user.serialize()), 200
    
    @staticmethod
    def update(user_id: int, data: dict, current_user_id: int, current_user_is_admin: bool):
        if not current_user_is_admin:
            if int(user_id) != int(current_user_id):
                return jsonify({'msg': 'No tienes permiso para actualizar este usuario'}), 403
        
        user = db.session.execute(select(User).filter_by(id=user_id)).scalar_one_or_none()
        
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        
        try:
            if 'firstname' in data:
                user.firstname = data['firstname']
                
            if 'lastname' in data:
                user.lastname = data['lastname']
                
            if 'email' in data:
                existing = db.session.execute(select(User).filter_by(email=data['email'])).scalar_one_or_none()
                
                if existing and existing.id != user.id:
                    return jsonify({'msg': 'El correo ya está en uso'}), 400
                
                user.email = data['email']
                
            if 'selectedMobility' in data:
                if not isinstance(data['selectedMobility'], list):
                    return jsonify({'msg': 'Accesibilidad debe ser una lista'}), 400
                
                user.selected_mobility = json.dumps(data['selectedMobility'])
                
            db.session.commit()
            
            return jsonify({
                'msg': 'Usuario actualizado correctamente',
                'user': user.serialize()
            }), 200
                
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al actualizar usuario', 'error': str(e)}), 500
        
    @staticmethod
    def delete(user_id: int, current_user_id: int, current_user_is_admin: bool):
        if not current_user_is_admin:
            if int(user_id != int(current_user_id)):
                return jsonify({'msg': 'No tienes permiso para eliminar este usuario'}), 403
        else:
            if int(user_id) == int(current_user_id):
                return jsonify({'msg': 'Un administrador no puede eliminar su propia cuenta'}), 403
        
        user = db.session.execute(select(User).filter_by(id=user_id)).scalar_one_or_none()
        
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        
        try:
            db.session.delete(user)
            db.session.commit()
            
            return jsonify({'msg': 'Usuario eliminado correctamente'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al eliminar usuario', 'error': str(e)}), 500
    
    @staticmethod
    def update_avatar(current_user_id: str, file_object):
        ALLOWED_EXTENSIONS = {'png', 'jpg',  'jpeg'}
        
        if not file_object or file_object.filename == '':
            return jsonify({'msg': 'No se ha seleccionado ningún archivo de imagen'}), 400
        
        file_extension = file_object.filename.rsplit('.', 1)[-1].lower()
        
        if file_extension not in ALLOWED_EXTENSIONS:
            return jsonify({'msg': 'Formato de imagen no permitido. Usa PNG, JPG o JPEG'}), 400
        
        user = db.session.execute(select(User).filter_by(id=int(current_user_id))).scalar_one_or_none()
        
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        
        try:
            base_dir = os.path.abspath(os.path.dirname(__file__))
            public_avatar_dir = os.path.join(base_dir, '../../..', 'public', 'avatar')
            
            os.makedirs(public_avatar_dir, exist_ok=True)
            
            if user.avatar and 'default_avatar.png' not in user.avatar:
                old_filename = user.avatar.split('/')[-1]
                old_file_path = os.path.join(public_avatar_dir, old_filename)
                
                if (os.path.exists(old_file_path)):
                    os.remove(old_file_path)
                    
            clean_filename = secure_filename(f'avatar_user_{current_user_id}.{file_extension}')
            new_file_path = os.path.join(public_avatar_dir, clean_filename)
            
            file_object.save(new_file_path)
            
            user.avatar = clean_filename
            db.session.commit()
            
            return jsonify({
                'msg': 'Avatar actualizado correctamente',
                'user': user.serialize()
            }), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'msg': 'Error al procesar el reemplazo del archivo', 'error': str(e)}), 500
        