from flask import Blueprint, request, jsonify
from app import db
from app.mod_subcategory.models import Subcategory

mod_subcategory = Blueprint('subcategory', __name__, url_prefix='/subcategory')


# GET : all subcategories
@mod_subcategory.route('/')
def index():
    subcategories = Subcategory.query.all()
    response = jsonify(subcategories=[i.to_dict() for i in subcategories])
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
def create():
    subcategory = Subcategory(
        name=request.json['name'],
        category_id=request.json['category_id'],
    )
    db.session.add(subcategory)
    db.session.commit()
    response = jsonify(subcategory.to_dict())
    response.headers.add("Access-Control-Allow-Origin", "*")
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