# from flask import Blueprint, request, jsonify
# from app import db
# from app.mod_attribute.models import Attribute, AttributeOption

# mod_attribute = Blueprint('attribute', __name__, url_prefix='/attribute')
# mod_option = Blueprint('option', __name__, url_prefix='/option')


# # GET : all attribute
# @mod_attribute.route('/')
# def index():
#     attribute = Attribute.query.all()
#     response = jsonify(attribute=[i.to_dict() for i in attribute])
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

# # GET : attribute by id
# @mod_attribute.route('/<int:attribute_id>/')
# def attribute(attribute_id):
#     attribute = Attribute.query.get_or_404(attribute_id)
#     response = jsonify(attribute.to_dict(rules=('-subcategories.attributes',)))
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

# # POST : create attribute
# @mod_attribute.post('/create/')
# def create():
#     attribute = Attribute(
#         name=request.json['name'],
#     )
#     db.session.add(attribute)
#     db.session.commit()
#     response = jsonify(attribute.to_dict())
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

# # PUT : edit attribute
# @mod_attribute.put('/<int:attribute_id>/')
# def edit(attribute_id):
#     attribute = Attribute.query.get_or_404(attribute_id)
#     attribute.name = request.json['name']
#     db.session.add(attribute)
#     db.session.commit()
#     response = jsonify(attribute.to_dict())
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

# # DELETE : delete attribute
# @mod_attribute.delete('/<int:attribute_id>/')
# def delete(attribute_id):
#     attribute = Attribute.query.get_or_404(attribute_id)
#     db.session.delete(attribute)
#     db.session.commit()
#     return '', 204