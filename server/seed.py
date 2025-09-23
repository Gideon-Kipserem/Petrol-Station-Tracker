#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc, uniform
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Station, FuelType, Staff, Sale, FuelInventory

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create Fuel Types
        fuel_types = [
            FuelType(name='Diesel', price_per_litre=147.32, color='#3B82F6'),
            FuelType(name='Unleaded', price_per_litre=141.50, color='#10B981'),
            FuelType(name='Premium', price_per_litre=157.20, color='#F59E0B')
        ]
        
        for fuel_type in fuel_types:
            db.session.add(fuel_type)
        db.session.commit()
        
        # Create Stations
        station_names = [
            'Downtown Station',
            'Highway Junction',
            'Mall Plaza',
            'Airport Terminal',
            'Suburb Center'
        ]
        
        stations = []
        for i, name in enumerate(station_names):
            station = Station(
                name=name,
                location=fake.city(),
                address=fake.address(),
                phone=fake.phone_number(),
                manager_name=fake.name(),
                is_active=True
            )
            stations.append(station)
            db.session.add(station)
        db.session.commit()
        
        # Create Staff
        positions = ['Manager', 'Attendant', 'Cashier', 'Supervisor']
        for station in stations:
            # Each station gets 3-6 staff members
            for _ in range(randint(3, 6)):
                staff = Staff(
                    name=fake.name(),
                    email=fake.email(),
                    phone=fake.phone_number(),
                    position=rc(positions),
                    station_id=station.id,
                    hire_date=fake.date_between(start_date='-2y', end_date='today'),
                    is_active=True
                )
                db.session.add(staff)
        db.session.commit()
        
        # Create Fuel Inventory for each station
        for station in stations:
            for fuel_type in fuel_types:
                inventory = FuelInventory(
                    station_id=station.id,
                    fuel_type_id=fuel_type.id,
                    current_stock=uniform(500, 5000),  # Random stock level
                    capacity=5000,  # 5000L capacity
                    minimum_threshold=uniform(800, 1200),  # Random threshold
                    last_refill_date=fake.date_between(start_date='-30d', end_date='today')
                )
                db.session.add(inventory)
        db.session.commit()
        
        # Create Sales (last 30 days)
        all_staff = Staff.query.all()
        for _ in range(500):  # Generate 500 sales records
            staff_member = rc(all_staff)
            fuel_type = rc(fuel_types)
            litres = uniform(10, 100)  # 10-100 litres per sale
            price_per_litre = fuel_type.price_per_litre + uniform(-5, 5)  # Small price variation
            
            sale = Sale(
                station_id=staff_member.station_id,
                fuel_type_id=fuel_type.id,
                staff_id=staff_member.id,
                pump_number=randint(1, 6),
                litres=round(litres, 2),
                price_per_litre=round(price_per_litre, 2),
                total_amount=round(litres * price_per_litre, 2),
                payment_method=rc(['Cash', 'Card', 'Mobile']),
                sale_date=fake.date_time_between(start_date='-30d', end_date='now')
            )
            db.session.add(sale)
        
        db.session.commit()
        print("Seed completed successfully!")
        print(f"Created {len(stations)} stations")
        print(f"Created {len(fuel_types)} fuel types")
        print(f"Created {Staff.query.count()} staff members")
        print(f"Created {FuelInventory.query.count()} inventory records")
        print(f"Created {Sale.query.count()} sales records")
