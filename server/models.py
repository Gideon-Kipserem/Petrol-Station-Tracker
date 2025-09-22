from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!



class Station(db.Model, SerializerMixin):
    __tablename__ = 'stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    location = db.Column(db.String(200), nullable=False)
    # created_at = db.Column(db.DateTime, server_default=db.func.now())
    # updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    pumps = db.relationship('Pump', backref='station',
                            lazy=True, cascade='all, delete-orphan')
    staff = db.relationship('Staff', backref='station',
                            lazy=True, cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-pumps.station', '-staff.station')

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 1:
            raise ValueError("Station name must be at least 1 character long")
        return name.strip()

    # @validates('location')
    # def validate_name(self, key, location):
    #     if not location or len(location.strip()) < 1:
    #         raise ValueError("Station location must be at least 1 character long")
    #     return location.strip()


class Pump(db.Model, SerializerMixin):
   pass


class Staff(db.Model, SerializerMixin):
    pass


