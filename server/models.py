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
    


    pumps = db.relationship('Pump', back_populates='station',
                            cascade='all, delete-orphan')
    staff = db.relationship('Staff', back_populates='station',
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
    def validate_pump_number(self, key, value):
        if not value.lower().startswith("pump"):
            raise ValueError("Pump_number must start with 'Pump' e.g 'Pump 3'" )
        return value


class Staff(db.Model, SerializerMixin):
    __tablename__ = "staff"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = False)
    role = db.Column(db.String(9), nullable = False)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id"))

    station = db.relationship("Station", back_populates="staff")
    sales  = db.relationship("SaleStaff", back_populates="staff", cascade = "all, delete-orphan")

    serialize_rules = ("-station.staff",)



    #####################################
    # TEST MODELS, DELETE BEFORE MERGE
class Sale(db.Model):
    __tablename__ = "sales"
    id = db.Column(db.Integer, primary_key=True)
    pump_id = db.Column(db.Integer, db.ForeignKey("pumps.id"))
    pump = db.relationship("Pump", back_populates="sales")

class SaleStaff(db.Model):
    __tablename__ = "sale_staff"
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey("sales.id"))
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.id"))
    staff = db.relationship("Staff", back_populates="sales") 


