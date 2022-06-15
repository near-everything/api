from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_migrate import Migrate
from flask_cors import CORS
import logging

def create_app() -> Flask:
    appvar = Flask(__name__)
    appvar.config.from_object('config')
    CORS(appvar, resources={r'/.*': {'origins': '*'}}, supports_credentials=True)
    return appvar

app = create_app()
logging.getLogger('flask_cors').level = logging.DEBUG

with app.app_context():
    cors = CORS(app)
    db = SQLAlchemy(app)
    migrate = Migrate(app, db)

    class Base(db.Model, SerializerMixin):

        __abstract__  = True

        id            = db.Column(db.Integer, primary_key=True)

    # Import modules
    from app.mod_category.controllers import mod_category as category_module
    from app.mod_subcategory.controllers import mod_subcategory as subcategory_module
    from app.mod_attribute.controllers import mod_attribute as attribute_module
    from app.mod_characteristic.controllers import mod_characteristic as characteristic_module
    from app.mod_option.controllers import mod_option as option_module
    # Register blueprints
    app.register_blueprint(category_module)
    app.register_blueprint(subcategory_module)
    app.register_blueprint(attribute_module)
    app.register_blueprint(characteristic_module)
    app.register_blueprint(option_module)
    db.create_all()

# Configurations

# Base class
class Base(db.Model, SerializerMixin):

    __abstract__  = True

    # date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
    # date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
    #                                        onupdate=db.func.current_timestamp())






# Build the database
