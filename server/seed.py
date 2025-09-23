#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Station, Pump, Staff

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here! #############DELETE THIS BEFORE MERGE###########
        db.drop_all()
        db.create_all()
        
        Pump.query.delete()
        Staff.query.delete()
        Station.query.delete()
        db.session.commit()

        # --- Seed Stations ---
        stations = []
        for _ in range(3):  # create 3 stations
            station = Station(
                name=fake.company(),
                location=fake.city()
            )
            db.session.add(station)
            stations.append(station)
        db.session.commit()

        # --- Seed Pumps ---
        pumps = []
        for station in stations:
            for i in range(randint(2, 4)):  # 2–4 pumps per station
                pump = Pump(
                    pump_number=f"Pump {i+1}",
                    fuel_type=rc(["Petrol", "Diesel", "Kerosene"]),
                    station_id=station.id
                )
                db.session.add(pump)
                pumps.append(pump)
        db.session.commit()

        # --- Seed Staff ---
        roles = ["attendant", "manager", "cashier"]
        for station in stations:
            for _ in range(randint(2, 3)):  # 2–3 staff per station
                staff = Staff(
                    name=fake.name(),
                    role=rc(roles),
                    station_id=station.id
                )
                db.session.add(staff)
        db.session.commit()

        print("Seeding completed!")


