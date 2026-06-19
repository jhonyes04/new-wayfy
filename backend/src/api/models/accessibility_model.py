from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey
from api.models import db


class AccessibilityReview(db.Model):
    __tablename__ = 'accessibility_reviews'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    osm_id: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)  # unique: un registro por lugar
    osm_type: Mapped[str] = mapped_column(String(10), nullable=False, default='node')
    place_name: Mapped[str] = mapped_column(String(200), nullable=True)

    last_modified_by_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=True)
    last_modified_by: Mapped['User'] = relationship('User', backref='accessibility_reviews')

    wheelchair: Mapped[str] = mapped_column(String(10), nullable=True)
    has_ramp: Mapped[bool] = mapped_column(Boolean, nullable=True)
    has_elevator: Mapped[bool] = mapped_column(Boolean, nullable=True)
    has_accessible_toilet: Mapped[bool] = mapped_column(Boolean, nullable=True)
    has_accessible_parking: Mapped[bool] = mapped_column(Boolean, nullable=True)
    automatic_door: Mapped[bool] = mapped_column(Boolean, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    photos: Mapped[list['AccessibilityPhoto']] = relationship(
        'AccessibilityPhoto', backref='review', cascade='all, delete-orphan'
    )

    def serialize(self):
        user = self.last_modified_by
        return {
            'id': self.id,
            'osm_id': self.osm_id,
            'osm_type': self.osm_type,
            'place_name': self.place_name,
            'last_modified_by_id': self.last_modified_by_id,
            'last_modified_by_name': f"{user.firstname} {user.lastname}" if user else None,
            'wheelchair': self.wheelchair,
            'has_ramp': self.has_ramp,
            'has_elevator': self.has_elevator,
            'has_accessible_toilet': self.has_accessible_toilet,
            'has_accessible_parking': self.has_accessible_parking,
            'automatic_door': self.automatic_door,
            'description': self.description,
            'photos': [p.serialize() for p in self.photos],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }


class AccessibilityPhoto(db.Model):
    __tablename__ = 'accessibility_photos'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    review_id: Mapped[int] = mapped_column(Integer, ForeignKey('accessibility_reviews.id'), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    caption: Mapped[str] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,  
            'url': f'/api/accessibility/photos/{self.filename}',
            'caption': self.caption,
            'created_at': self.created_at.isoformat(),
        }