from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_migrate import Migrate

# Define the WSGI application object
app = Flask(__name__)

# Configurations
app.config.from_object('config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Base class
class Base(db.Model, SerializerMixin):

    __abstract__  = True

    id            = db.Column(db.Integer, primary_key=True)
    # date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
    # date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
    #                                        onupdate=db.func.current_timestamp())


# Import modules
from app.mod_category.controllers import mod_category as category_module
from app.mod_subcategory.controllers import mod_subcategory as subcategory_module
from app.mod_attribute.controllers import mod_attribute as attribute_module
from app.mod_attribute.controllers import mod_option as option_module

# Register blueprints
app.register_blueprint(category_module)
app.register_blueprint(subcategory_module)
app.register_blueprint(attribute_module)
app.register_blueprint(option_module)

# Build the database
db.create_all()