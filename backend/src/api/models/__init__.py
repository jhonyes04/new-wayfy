from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

from api.models.user_model import User, UserFavorite
from api.models.accessibility_model import AccessibilityReview, AccessibilityPhoto
from api.models.trip_model import Trip, TripDay, TripDayPlace
from api.models.place_model import Place