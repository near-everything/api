from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import db
from app.mod_category.models import Category

mod_category = Blueprint('category', __name__, url_prefix='/category')

# GET : all categories
@mod_category.route('/')
def index():
    categories = Category.query.all()
    response = jsonify(categories=[i.to_dict() for i in categories])
    return response

# GET : category by id
@mod_category.route('/<int:category_id>/')
def category(category_id):
    category = Category.query.get_or_404(category_id)
    response = jsonify(category.to_dict(rules=('-subcategories.attributes',)))
    return response

# POST : create category
@mod_category.post('/create/')
@cross_origin()
def create():
    category = Category(
        name=request.json['name'],
    )
    db.session.add(category)
    db.session.commit()
    response = jsonify(category.to_dict(rules=('-subcategories.attributes',)))
    return response

# PUT : edit category
@mod_category.put('/<int:category_id>/')
def edit(category_id):
    category = Category.query.get_or_404(category_id)
    category.name = request.json['name']
    db.session.add(category)
    db.session.commit()
    response = jsonify(category.to_dict(rules=('-subcategories.attributes',)))
    return response

# DELETE : delete category
@mod_category.delete('/<int:category_id>/')
def delete(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return '', 204