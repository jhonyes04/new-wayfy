from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey
from api.models import db

class Place(db.Model):
    __tablename__ = 'places'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    sub_type: Mapped[str] = mapped_column(String(100), nullable=True)
    place_label: Mapped[str] = mapped_column(String(100), nullable=True)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='pending')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    def serialize(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'sub_type': self.sub_type,
            'place_label': self.place_label,
            'created_by': self.created_by,
            'status': self.status,
            'created_at': self.created_at
        }