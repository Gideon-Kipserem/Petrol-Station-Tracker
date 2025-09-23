from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Pump(db.Model):
    __tablename__ = "pumps"

    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.String(50), nullable=False, unique=True)

    sales = db.relationship("Sale", backref="pump", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "pump_number": self.pump_number
        }