import json
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, Integer
from api.models import db

class User(db.Model):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    selected_mobility: Mapped[str] = mapped_column(Text, default="[]")
    avatar: Mapped[str] = mapped_column(String[255], nullable=True, default="default_avatar.png")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    
    def serialize(self) -> dict:
        avatar_public_path = '/public/avatar/'
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'selected_mobility': json.loads(self.selected_mobility),
            'avatar': f'{avatar_public_path}{self.avatar}',
            'is_active': self.is_active,
            'is_admin': self.is_admin
        }