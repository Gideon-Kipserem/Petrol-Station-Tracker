from app import app, db
from models import Pump, Sale

with app.app_context():
    db.drop_all()
    db.create_all()

    pump1 = Pump(pump_number="01")
    pump2 = Pump(pump_number="02")
    db.session.add_all([pump1, pump2])
    db.session.commit()

    sale1 = Sale(fuel_type="Regular", litres=45.5, price_per_litre=1.45, total_amount=65.98, pump_id=pump1.id)
    sale2 = Sale(fuel_type="Premium", litres=30.0, price_per_litre=1.65, total_amount=49.50, pump_id=pump2.id)
    sale3 = Sale(fuel_type="Diesel", litres=60.2, price_per_litre=1.55, total_amount=93.31, pump_id=pump1.id)

    db.session.add_all([sale1, sale2, sale3])
    db.session.commit()

    print("Database seeded successfully")
