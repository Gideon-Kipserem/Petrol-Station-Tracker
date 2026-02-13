from app import app
from models import db, Station, Pump, Staff, Sale, User
from datetime import datetime
import random
from werkzeug.security import generate_password_hash

with app.app_context():
    db.drop_all()
    db.create_all()

    # Create default admin user
    admin_user = User(
        name="Admin User",
        email="admin@petroltracker.com",
        password_hash=generate_password_hash("admin123"),
        role="admin",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    # Create a manager user
    manager_user = User(
        name="John Manager",
        email="manager@petroltracker.com",
        password_hash=generate_password_hash("manager123"),
        role="manager",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    # Create a regular user
    regular_user = User(
        name="Jane User",
        email="user@petroltracker.com",
        password_hash=generate_password_hash("user123"),
        role="user",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.session.add_all([admin_user, manager_user, regular_user])
    db.session.commit()

    # Create stations
    stations = [
        Station(name="Downtown Station", location="123 Main St, Downtown", is_active=True),
        Station(name="Highway Station", location="456 Highway Rd, Outskirts", is_active=True),
        Station(name="Mall Station", location="789 Shopping Center, Mall District", is_active=True),
        Station(name="Airport Station", location="321 Airport Rd, Terminal Area", is_active=True),
        Station(name="Westlands Station", location="654 Westlands Ave, Westlands", is_active=True),
        Station(name="Karen Station", location="987 Karen Rd, Karen", is_active=True),
        Station(name="Industrial Station", location="147 Industrial Area, Factory Zone", is_active=True)
    ]
    db.session.add_all(stations)
    db.session.commit()

    # Create pumps for each station
    pumps = []
    fuel_types = ['Regular', 'Premium', 'Diesel']
    for i, station in enumerate(stations):
        # Each station gets 2-4 pumps
        num_pumps = random.randint(2, 4)
        for j in range(num_pumps):
            pump = Pump(
                pump_number=f"{i+1:02d}{j+1:02d}",
                fuel_type=random.choice(fuel_types),
                station_id=station.id
            )
            pumps.append(pump)
    
    db.session.add_all(pumps)
    db.session.commit()

    # Create staff for each station
    staff_members = []
    roles = ['Manager', 'Senior Attendant', 'Attendant', 'Cashier', 'Security Guard']
    names = [
        'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis',
        'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Ivy Taylor', 'Jack Anderson',
        'Kate Thomas', 'Liam Jackson', 'Mia White', 'Noah Harris', 'Olivia Martin',
        'Paul Thompson', 'Quinn Garcia', 'Ruby Martinez', 'Sam Robinson', 'Tina Clark'
    ]
    
    name_index = 0
    for i, station in enumerate(stations):
        # Each station gets 2-3 staff members
        num_staff = random.randint(2, 3)
        for j in range(num_staff):
            if name_index < len(names):
                name = names[name_index]
                name_index += 1
            else:
                name = f"Staff Member {name_index}"
                name_index += 1
            
            staff = Staff(
                name=name,
                role=roles[j % len(roles)],
                station_id=station.id,
                email=f"{name.lower().replace(' ', '.')}.{i}.{j}@petroltracker.com",
                phone=f"+254{random.randint(700000000, 799999999)}",
                hire_date=datetime.utcnow(),
                is_active=True
            )
            staff_members.append(staff)
    
    db.session.add_all(staff_members)
    db.session.commit()

    # Create sales
    sales = []
    for _ in range(25):
        pump = random.choice(pumps)
        litres = round(random.uniform(10.0, 80.0), 1)
        price_per_litre = round(random.uniform(120.0, 180.0), 2)  # KES prices
        total_amount = round(litres * price_per_litre, 2)
        
        sale = Sale(
            fuel_type=pump.fuel_type,
            litres=litres,
            price_per_litre=price_per_litre,
            total_amount=total_amount,
            pump_id=pump.id,
            sale_timestamp=datetime.utcnow()
        )
        sales.append(sale)
    
    db.session.add_all(sales)
    db.session.commit()

    print("Database seeded successfully!")
    print(f"Created {len(stations)} stations")
    print(f"Created {len(pumps)} pumps")
    print(f"Created {len(staff_members)} staff members")
    print(f"Created {len(sales)} sales")
    print(f"Created 3 users (admin, manager, user)")
    print("\nDefault login credentials:")
    print("Admin: admin@petroltracker.com / admin123")
    print("Manager: manager@petroltracker.com / manager123")
    print("User: user@petroltracker.com / user123")
