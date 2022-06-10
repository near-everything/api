from queue import Empty
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import db
from app.mod_subcategory.models import Association, Attribute, Characteristic, Option, Subcategory

mod_subcategory = Blueprint('subcategory', __name__, url_prefix='/subcategory')


# GET : all subcategories
@mod_subcategory.route('/')
def index():
    if request.args is Empty:
        subcategories = Subcategory.query.all()
    else:
        category_id = request.args.get('category_id')
        subcategories = Subcategory.query.filter_by(category_id=category_id)
    response = jsonify(subcategories=[i.to_dict() for i in subcategories])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@mod_subcategory.route('/characteristic')
def characteristic():
    # if request.args is Empty:
    characteristics = Subcategory.query.join(Characteristic).join(Attribute).filter((Characteristic.attribute_id == Attribute.id) & (Characteristic.subcategory_id == Subcategory.id)).all()
    # else:
    #     attribute_id = request.args.get('attribute_id')
    #     subcategory_id = request.args.get('subcategory_id')
    #     characteristics = Characteristic.query.filter_by(attribute_id=attribute_id, subcategory_id=subcategory_id)
    response = jsonify(characteristics=[i.to_dict() for i in characteristics])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@mod_subcategory.route('/association')
def association():
    if request.args is Empty:
        associations = Association.query.all()
    else:
        option_id = request.args.get('option_id')
        attribute_id = request.args.get('attribute_id')
        subcategory_id = request.args.get('subcategory_id')
        associations = Association.query.filter_by(option_id=option_id, attribute_id=attribute_id, subcategory_id=subcategory_id)
    response = jsonify(associations=[i.to_dict() for i in associations])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# GET : subcategory by id
@mod_subcategory.route('/<int:subcategory_id>/')
def subcategory(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    response = jsonify(subcategory.to_dict())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# POST : create subcategory
@mod_subcategory.post('/create/')
@cross_origin()
def create():
    subcategory = Subcategory(
        name=request.json['name'],
        category_id=request.json['category_id'],
    )
    db.session.add(subcategory)
    db.session.commit()
    response = jsonify(subcategory.to_dict())
    return response

# PUT : edit subcategory
@mod_subcategory.put('/<int:subcategory_id>/')
def edit(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    if 'name' in request.json:
        subcategory.name = request.json['name']
    if 'category_id' in request.json:
        subcategory.category_id = request.json['category_id']
    db.session.add(subcategory)
    db.session.commit()
    response = jsonify(subcategory.to_dict())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# DELETE : delete subcategory
@mod_subcategory.delete('/<int:subcategory_id>/')
def delete(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    db.session.delete(subcategory)
    db.session.commit()
    return '', 204