from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, Integer, Float, Date, DateTime, Time, ForeignKey
from api.models import db


class Trip(db.Model):
    __tablename__ = 'trips'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    original_trip_id: Mapped[int] = mapped_column(Integer, ForeignKey('trips.id'), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    cover_image: Mapped[str] = mapped_column(String(200), nullable=True)

    days: Mapped[list['TripDay']] = relationship('TripDay', backref='trip', cascade='all, delete-orphan', order_by='TripDay.day_number')
    forks: Mapped[list['Trip']] = relationship('Trip', foreign_keys='Trip.original_trip_id')

    def serialize(self, include_days: bool = False) -> dict:
        from api.models.user_model import User
        author = db.session.get(User, self.user_id)
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'author': {
                'firstname': author.firstname if author else None,
                'lastname': author.lastname if author else None
            },
            'title': self.title,
            'description': self.description,
            'is_public': self.is_public,
            'original_trip_id': self.original_trip_id,
            'fork_count': len(self.forks),
            'total_days': len(self.days),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'cover_image': f'/api/trips/cover/{self.cover_image}' if self.cover_image else None
        }
        if include_days:
            data['days'] = [day.serialize(include_places=True) for day in self.days]
        return data


class TripDay(db.Model):
    __tablename__ = 'trip_days'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    trip_id: Mapped[int] = mapped_column(Integer, ForeignKey('trips.id'), nullable=False)
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[datetime] = mapped_column(Date, nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    places: Mapped[list['TripDayPlace']] = relationship('TripDayPlace', backref='day', cascade='all, delete-orphan', order_by='TripDayPlace.order')

    def serialize(self, include_places: bool = False) -> dict:
        data = {
            'id': self.id,
            'trip_id': self.trip_id,
            'day_number': self.day_number,
            'date': self.date.isoformat() if self.date else None,
            'title': self.title,
            'notes': self.notes,
        }
        if include_places:
            data['places'] = [place.serialize() for place in self.places]
        return data


class TripDayPlace(db.Model):
    __tablename__ = 'trip_day_places'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    trip_day_id: Mapped[int] = mapped_column(Integer, ForeignKey('trip_days.id'), nullable=False)
    favorite_id: Mapped[int] = mapped_column(Integer, ForeignKey('user_favorites.id'), nullable=True)
    place_name: Mapped[str] = mapped_column(String(200), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    osm_id: Mapped[str] = mapped_column(String(50), nullable=True)
    sub_type: Mapped[str] = mapped_column(String(100), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    visit_time: Mapped[str] = mapped_column(Time, nullable=True)
    visit_time_end: Mapped[str] = mapped_column(Time, nullable=True)

    def serialize(self) -> dict:
        return {
            'id': self.id,
            'trip_day_id': self.trip_day_id,
            'favorite_id': self.favorite_id,
            'place_name': self.place_name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'osm_id': self.osm_id,
            'sub_type': self.sub_type,
            'order': self.order,
            'notes': self.notes,
            'visit_time': self.visit_time.strftime('%H:%M') if self.visit_time else None,
            'visit_time_end': self.visit_time_end.strftime('%H:%M') if self.visit_time_end else None
        }