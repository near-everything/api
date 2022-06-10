from queue import Empty
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import db
from app.mod_subcategory.models import Subcategory

mod_subcategory = Blueprint('subcategory', __name__, url_prefix='/subcategory')

# GET : all subcategories
@mod_subcategory.route('/')
def index():
    category_id = request.args.get('category_id')
    if category_id is not None:
        subcategories = Subcategory.query.filter_by(category_id=category_id)
    else:
        subcategories = Subcategory.query.all()
    response = jsonify(subcategories=[i.to_dict() for i in subcategories])
    return response

# GET : subcategory by id
@mod_subcategory.route('/<int:subcategory_id>/')
def subcategory(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    response = jsonify(subcategory.to_dict())
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
    return response

# DELETE : delete subcategory
@mod_subcategory.delete('/<int:subcategory_id>/')
def delete(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    db.session.delete(subcategory)
    db.session.commit()
    return '', 204