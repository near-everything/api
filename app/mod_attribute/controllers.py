from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import db
from app.mod_attribute.models import Attribute

mod_attribute = Blueprint('attribute', __name__, url_prefix='/attribute')

# GET : all attribute
@mod_attribute.route('/')
def index():
    attributes = Attribute.query.all()
    response = jsonify(attributes=[i.to_dict() for i in attributes])
    return response

# GET : attribute by id
@mod_attribute.route('/<int:attribute_id>/')
def attribute(attribute_id):
    attribute = Attribute.query.get_or_404(attribute_id)
    response = jsonify(attribute.to_dict(rules=('-subcategories.attributes',)))
    return response

# POST : create attribute
@mod_attribute.post('/create/')
def create():
    attribute = Attribute(
        name=request.json['name'],
        label=request.json['label'],
        isMulti=request.json['isMulti']
    )
    db.session.add(attribute)
    db.session.commit()
    response = jsonify(attribute.to_dict())
    return response

# PUT : edit attribute
@mod_attribute.put('/<int:attribute_id>/')
def edit(attribute_id):
    attribute = Attribute.query.get_or_404(attribute_id)
    if 'name' in request.json:
        attribute.name = request.json['name']
    if 'label' in request.json:
        attribute.label=request.json['label'],
    if 'isMulti' in request.json:
        attribute.isMulti=request.json['isMulti']
    db.session.add(attribute)
    db.session.commit()
    response = jsonify(attribute.to_dict())
    return response

# DELETE : delete attribute
@mod_attribute.delete('/<int:attribute_id>/')
def delete(attribute_id):
    attribute = Attribute.query.get_or_404(attribute_id)
    db.session.delete(attribute)
    db.session.commit()
    return '', 204