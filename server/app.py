#!/usr/bin/env python3
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Station, Pump, Staff

# Views go here!


class StationResource(Resource):
    def get(self, id=None):
        if id:
            station = Station.query.get_or_404(id)
            return station.to_dict()
        stations = Station.query.all()

        return [s.to_dict() for s in stations]

    def post(self):
        data = request.get_json()
        new_station = Station(name=data["name"], location=data["location"])

        db.session.add(new_station)
        db.session.commit()
        return make_response(new_station.to_dict(), 201)

    def patch(self, id):
        station = Station.query.get_or_404(id)
        data = request.get_json()

        if "name" in data:
            station.name = data["name"]
        if "location" in data:
            station.location = data["location"]
        db.session.commit()
        return station.to_dict()

    def delete(self, id):
        station = Station.query.get_or_404(id)

        db.session.delete(station)
        db.session.commit()
        return "", 204


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


api.add_resource(StationResource, "/stations", "/stations/<int:id>")
api.add_resource(PumpResource, "/pumps", "/pumps/<int:id>")
api.add_resource(StaffResource, "/staff", "/staff/<int:id>")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
