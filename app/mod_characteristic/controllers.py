from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import db
from app.mod_attribute.models import Attribute
from app.mod_characteristic.models import Characteristic
from app.mod_subcategory.models import Subcategory

mod_characteristic = Blueprint('characteristic', __name__, url_prefix='/characteristic')

# GET : all characteristic
@mod_characteristic.route('/')
def index():
    characteristic = Subcategory.query.join(Characteristic).join(Attribute).filter((Characteristic.attribute_id == Attribute.id) & (Characteristic.subcategory_id == Subcategory.id)).all()
    response = jsonify(characteristic=[i.to_dict() for i in characteristic])
    return response

# GET : characteristic by id
@mod_characteristic.route('/<int:subcategory_id>/<int:attribute_id>/')
def characteristic(subcategory_id, attribute_id):
    characteristic = Subcategory.query.join(Characteristic).join(Attribute).filter((Characteristic.attribute_id == attribute_id) & (Characteristic.subcategory_id == subcategory_id)).first()
    response = jsonify(characteristic.to_dict(rules=('-subcategories.characteristics',)))
    return response

# POST : create characteristic
@mod_characteristic.post('/create/')
@cross_origin()
def create():
    characteristic = characteristic(
        subcategory_id=request.json['subcategory_id'],
        attribute_id=request.json['attribute_id'],
    )
    db.session.add(characteristic)
    db.session.commit()
    response = jsonify(characteristic.to_dict())
    return response

# DELETE : delete characteristic
@mod_characteristic.delete('/<int:subcategory_id>/<int:attribute_id>/')
def delete(subcategory_id, attribute_id):
    characteristic = Subcategory.query.join(Characteristic).join(Attribute).filter((Characteristic.attribute_id == attribute_id) & (Characteristic.subcategory_id == subcategory_id)).first()
    db.session.delete(characteristic)
    db.session.commit()
    return '', 204