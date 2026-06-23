import json
from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from api.models import db

class User(db.Model):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    firstname: Mapped[str] = mapped_column(String(50), nullable=True)
    lastname: Mapped[str] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    selected_mobility: Mapped[str] = mapped_column(Text, default="[]")
    avatar: Mapped[str] = mapped_column(String(255), nullable=True, default="default_avatar.png")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    favorites: Mapped[list['UserFavorite']] = relationship(
        'UserFavorite',
        backref='user',
        cascade='all, delete-orphan'
    )
    
    def serialize(self, include_favorites: bool = False) -> dict:
        avatar_public_path = '/api/users/avatar/'
        data = {
            'id': self.id,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'email': self.email,
            'selected_mobility': json.loads(self.selected_mobility),
            'avatar': f'{avatar_public_path}{self.avatar}',
            'is_active': self.is_active,
            'is_admin': self.is_admin,
        }
        
        if include_favorites:
            data['favorites'] = [fav.serialize() for fav in self.favorites]
        
        return data

        
class UserFavorite(db.Model):
    __tablename__ = 'user_favorites'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    osm_id: Mapped[str] = mapped_column(String(50), nullable=False)
    place_name: Mapped[str] = mapped_column(String(200), nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    __table_args__ = (
        UniqueConstraint('user_id', 'osm_id', name='unique_user_favorite'),
    )
    
    def serialize(self) -> dict:
        return {
            'id': self.id,
            'osm_id': self.osm_id,
            'place_name': self.place_name,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'created_at': self.created_at.isoformat()
        }