from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import db
from app.mod_option.models import Option

mod_option = Blueprint('option', __name__, url_prefix='/option')

# GET : all option
@mod_option.route('/')
def index():
    options = Option.query.all()
    response = jsonify(options=[i.to_dict() for i in options])
    return response

# GET : option by id
@mod_option.route('/<int:option_id>/')
def option(option_id):
    option = Option.query.get_or_404(option_id)
    response = jsonify(option.to_dict(rules=('-subcategories.options',)))
    return response

# POST : create option
@mod_option.post('/create/')
def create():
    option = Option(
        name=request.json['name'],
        label=request.json['label'],
        attribute_id=request.json['attribute_id'],
    )
    db.session.add(option)
    db.session.commit()
    response = jsonify(option.to_dict())
    return response

# DELETE : delete option
@mod_option.delete('/<int:option_id>/')
def delete(option_id):
    option = Option.query.get_or_404(option_id)
    db.session.delete(option)
    db.session.commit()
    return '', 204