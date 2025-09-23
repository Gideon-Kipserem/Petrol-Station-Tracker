#!/usr/bin/env python3
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Standard library imports
from datetime import datetime, timedelta
from sqlalchemy import func, desc

# Remote library imports
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import Station, FuelType, Staff, Sale, FuelInventory, Pump

# Dashboard API Resource
class DashboardResource(Resource):
    def get(self):
        try:
            # Get query parameters
            time_range = request.args.get('range', '7d')
            
            # Calculate date range
            if time_range == '7d':
                start_date = datetime.utcnow() - timedelta(days=7)
            elif time_range == '30d':
                start_date = datetime.utcnow() - timedelta(days=30)
            elif time_range == '90d':
                start_date = datetime.utcnow() - timedelta(days=90)
            else:
                start_date = datetime.utcnow() - timedelta(days=7)
            
            # KPI Calculations
            total_stations = Station.query.filter_by(is_active=True).count()
            total_staff = Staff.query.filter_by(is_active=True).count()
            
            # Sales data for the time range
            sales_query = Sale.query.filter(Sale.sale_date >= start_date)
            total_revenue = db.session.query(func.sum(Sale.total_amount)).filter(Sale.sale_date >= start_date).scalar() or 0
            total_litres = db.session.query(func.sum(Sale.litres)).filter(Sale.sale_date >= start_date).scalar() or 0
            today_sales = Sale.query.filter(func.date(Sale.sale_date) == datetime.utcnow().date()).count()
            
            # Average price per litre
            avg_price = db.session.query(func.avg(Sale.price_per_litre)).filter(Sale.sale_date >= start_date).scalar() or 0
            
            # Recent sales (last 10)
            recent_sales = db.session.query(Sale).join(Station).join(FuelType).order_by(desc(Sale.sale_date)).limit(10).all()
            recent_sales_data = []
            for sale in recent_sales:
                time_diff = datetime.utcnow() - sale.sale_date
                if time_diff.seconds < 3600:
                    time_ago = f"{time_diff.seconds // 60} minutes ago"
                elif time_diff.days == 0:
                    time_ago = f"{time_diff.seconds // 3600} hours ago"
                else:
                    time_ago = f"{time_diff.days} days ago"
                
                recent_sales_data.append({
                    'id': sale.id,
                    'pump': f'Pump {sale.pump_number} - {sale.station.name}',
                    'fuelType': sale.fuel_type.name,
                    'litres': sale.litres,
                    'amount': sale.total_amount,
                    'time': time_ago
                })
            
            # Fuel type distribution
            fuel_type_data = []
            fuel_types = FuelType.query.all()
            for fuel_type in fuel_types:
                fuel_sales = db.session.query(func.sum(Sale.litres), func.sum(Sale.total_amount)).filter(
                    Sale.fuel_type_id == fuel_type.id,
                    Sale.sale_date >= start_date
                ).first()
                
                if fuel_sales[0]:  # If there are sales for this fuel type
                    percentage = (fuel_sales[0] / total_litres * 100) if total_litres > 0 else 0
                    fuel_type_data.append({
                        'name': fuel_type.name,
                        'value': round(percentage, 1),
                        'revenue': fuel_sales[1] or 0,
                        'color': fuel_type.color
                    })
            
            # Sales trends (last 7 days)
            sales_trends = []
            for i in range(7):
                date = datetime.utcnow().date() - timedelta(days=6-i)
                day_sales = Sale.query.filter(func.date(Sale.sale_date) == date).all()
                day_revenue = sum(sale.total_amount for sale in day_sales)
                sales_trends.append({
                    'date': date.strftime('%a'),
                    'sales': len(day_sales),
                    'revenue': day_revenue
                })
            
            # Top performing stations
            top_stations_query = db.session.query(
                Station.name,
                func.count(Sale.id).label('sales_count'),
                func.sum(Sale.total_amount).label('total_revenue')
            ).join(Sale).filter(Sale.sale_date >= start_date).group_by(Station.id).order_by(desc('total_revenue')).limit(5).all()
            
            top_stations = []
            for station in top_stations_query:
                top_stations.append({
                    'name': station.name,
                    'sales': station.sales_count,
                    'revenue': station.total_revenue
                })
            
            # Low stock alerts
            low_stock_alerts = []
            inventory_items = FuelInventory.query.all()
            for item in inventory_items:
                if item.is_low_stock:
                    low_stock_alerts.append({
                        'station': item.station.name,
                        'fuelType': item.fuel_type.name,
                        'level': round(item.stock_percentage, 1),
                        'threshold': round((item.minimum_threshold / item.capacity) * 100, 1)
                    })
            
            dashboard_data = {
                'totalRevenue': total_revenue,
                'totalLitres': total_litres,
                'totalStations': total_stations,
                'totalStaff': total_staff,
                'todaySales': today_sales,
                'avgPricePerLitre': round(avg_price, 2),
                'recentSales': recent_sales_data,
                'fuelTypeData': fuel_type_data,
                'salesTrends': sales_trends,
                'topStations': top_stations,
                'lowStockAlerts': low_stock_alerts
            }
            
            return dashboard_data, 200
            
        except Exception as e:
            return {'error': str(e)}, 500

# Stations Resource
class StationsResource(Resource):
    def get(self):
        stations = Station.query.filter_by(is_active=True).all()
        return [station.to_dict() for station in stations], 200
    
    def post(self):
        try:
            data = request.get_json()
            new_station = Station(
                name=data['name'],
                location=data['location'],
                address=data.get('address'),
                phone=data.get('phone'),
                manager_name=data.get('manager_name')
            )
            db.session.add(new_station)
            db.session.commit()
            return new_station.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400

class StationResource(Resource):
    def get(self, station_id):
        station = Station.query.get_or_404(station_id)
        return station.to_dict(), 200
    
    def patch(self, station_id):
        try:
            station = Station.query.get_or_404(station_id)
            data = request.get_json()
            
            for key, value in data.items():
                if hasattr(station, key):
                    setattr(station, key, value)
            
            db.session.commit()
            return station.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 400
    
    def delete(self, station_id):
        try:
            station = Station.query.get_or_404(station_id)
            station.is_active = False  # Soft delete
            db.session.commit()
            return {'message': 'Station deactivated successfully'}, 200
        except Exception as e:
            return {'error': str(e)}, 400

# Register API resources
api.add_resource(DashboardResource, '/api/dashboard')
api.add_resource(StationsResource, '/api/stations')
api.add_resource(StationResource, '/api/stations/<int:station_id>')

@app.route('/')
def index():
    return '<h1>Petrol Station Tracker API</h1>'

class PumpResource(Resource):
    def get_pump(self, id):
        if id:
            pump = Pump.query.get_or_404(id)
            return pump.to_dict()
        else:
            pumps = Pump.query.all()
            return [p.to_dict() for p in pumps]

    def post(self):
        data = request.get_json()

        new_pump = Pump(
            pump_number=data['pump'],
            fuel_type=data['fuel_type'],
            station_id=data['station_id']
        )
        db.session.add(new_pump)
        db.session.commit()

        return make_response(new_pump.to_dict(), 201)

    def patch(self, id):
        pump = Pump.query.get_or_404(id)
        data = request.get_json()

        if "pump_number" in data:
            pump.pump_number = data["pump_number"]
        if "fuel_type" in data:
            pump.fuel_type = data["fuel_type"]
        if "station_id" in data:
            pump.station_id = data["station_id"]
        db.session.commit()
        return pump.to_dict()

    def delete(self, id):
        pump = Pump.query.get_or_404(id)
        db.session.delete(pump)
        db.session.commit()
        return "", 204


class StaffResource(Resource):
    def get(self, id):
        if id:
            staff = Staff.query.get_or_404(id)
            return staff.to_dict()
        else:
            all_staff = Staff.query.all()
            return [s.to_dict() for s in all_staff]

    def post(self):
        data = request.get_json()
        staff = Staff(
            name=data["name"],
            role=data["role"],
            station_id=data["station_id"],
        )
        db.session.add(staff)
        db.session.commit()
        return staff.to_dict(), 201

    def patch(self, id):
        staff = Staff.query.get_or_404(id)
        data = request.get_json()
        if "name" in data:
            staff.name = data["name"]
        if "role" in data:
            staff.role = data["role"]
        if "station_id" in data:
            staff.station_id = data["station_id"]
        db.session.commit()
        return staff.to_dict()

    def delete(self, id):
        staff = Staff.query.get_or_404(id)
        db.session.delete(staff)
        db.session.commit()
        return "", 204


api.add_resource(PumpResource, "/api/pumps", "/api/pumps/<int:id>")
api.add_resource(StaffResource, "/api/staff", "/api/staff/<int:id>")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
