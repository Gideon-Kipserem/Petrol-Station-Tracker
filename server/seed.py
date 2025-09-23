from app import app
from models import db, Pump, Sale
from datetime import datetime, timedelta

def seed_data():
    with app.app_context():
        # Clearing and creating tables
        db.drop_all()
        db.create_all()

        # Creating pumps
        pumps = [
            Pump(pump_number="01", fuel_type="Petrol"),
            Pump(pump_number="02", fuel_type="Diesel"),
            Pump(pump_number="03", fuel_type="Kerosene"),
        ]

        # Creating sales
        sales = [
            Sale(
                fuel_type="Petrol",
                litres=10.5,
                price_per_litre=120.0,
                total_amount=1260.0,
                pump_id=1,
                timestamp=datetime.utcnow() - timedelta(hours=2)
            ),
            Sale(
                fuel_type="Diesel",
                litres=15.2,
                price_per_litre=110.0,
                total_amount=1672.0,
                pump_id=2,
                timestamp=datetime.utcnow() - timedelta(hours=1)
            ),
            Sale(
                fuel_type="Kerosene",
                litres=8.0,
                price_per_litre=100.0,
                total_amount=800.0,
                pump_id=3,
                timestamp=datetime.utcnow()
            )
        ]

        db.session.add_all(pumps + sales)
        db.session.commit()
        print("✅ Sales data seeded successfully!")
        print(f" Created {len(pumps)} pumps and {len(sales)} sales")

if __name__ == '__main__':
    seed_data()