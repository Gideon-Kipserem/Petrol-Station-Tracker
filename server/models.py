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


    pumps = db.relationship('Pump', backref='station',
                            cascade='all, delete-orphan')
    staff = db.relationship('Staff', backref='station',
                            cascade='all, delete-orphan')

 
    serialize_rules = ('-pumps.station', '-staff.station')

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 1:
            raise ValueError("Station name must be at least 1 character long")
        
        existing = Station.query.filter(Station.name == name.strip()).first()

        if existing and existing.id != getattr(self, "id", None):
            raise ValueError("Station name must be unique")
        return name.strip()

    # @validates('location')
    # def validate_name(self, key, location):
    #     if not location or len(location.strip()) < 1:
    #         raise ValueError("Station location must be at least 1 character long")
    #     return location.strip()


class Pump(db.Model, SerializerMixin):
    __tablename__ = 'pumps'

    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.String, nullable=False)
    fuel_type = db.Column(db.String, nullable=False)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id"))  

    station = db.relationship("Station", back_populates="pumps")
    sales = db.relationship('Sale', back_populates='pump', cascade='all, delete-orphan')

    serialize_rules = ('-station.pumps', '-sales.pump')

    @validates('pump_number')
    def validate_pump_number(self, key, pump_number):
        if not isinstance(pump_number, int) or pump_number <= 0:
            raise ValueError("Pump number must be a positive integer")
        return pump_number


class Staff(db.Model, SerializerMixin):
    pass
