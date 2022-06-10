from sqlalchemy import ForeignKeyConstraint
from app import db, Base

class Association(Base):

    __tablename__ = "association"

    serialize_only = ('option_id', 'subcategory_id', 'attribute_id')

    option_id = db.Column(db.ForeignKey("option.id"), primary_key=True)
    subcategory_id = db.Column(db.Integer, primary_key=True, nullable=False)
    attribute_id = db.Column(db.Integer, primary_key=True, nullable=False)
    ForeignKeyConstraint(['subcategory_id', 'attribute_id'], ['characteristic.subcategory_id', 'characteristic.attribute_id'])

    def __repr__(self):
        return f'<Association between Characteristic {self.characteristic_id} and Option {self.option_id}>'

class Characteristic(Base):

    __tablename__ = "characteristic"

    serialize_only = ('subcategory_id', 'attribute_id', 'options')

    serialize_rules = ('-options.characteristics',)

    subcategory_id = db.Column(db.ForeignKey("subcategory.id"), primary_key=True)
    attribute_id = db.Column(db.ForeignKey("attribute.id"), primary_key=True)
    options = db.relationship("Option", secondary="association", primaryjoin=("and_(Characteristic.subcategory_id==Association.subcategory_id, Characteristic.attribute_id==Association.attribute_id)"), back_populates="characteristics")

    def __repr__(self):
        return f'<Characteristic of Attribute {self.attribute_id} of Subcategory {self.subcategory_id}>'

class Option(Base):

    __tablename__ = "option"

    serialize_only = ('id', 'name', 'characteristics')

    serialize_rules = ('-characteristics.options',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    characteristics = db.relationship('Characteristic', secondary="association", secondaryjoin=("Option.id==Association.option_id"),
back_populates="options")

    def __repr__(self):
        return f'<Option {self.name}>'

class Attribute(Base):

    __tablename__ = "attribute"

    serialize_only = ('id', 'name', 'subcategories')

    serialize_rules = ('-subcategories.attributes',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    subcategories = db.relationship('Subcategory', secondary="characteristic", back_populates="attributes")

    def __repr__(self):
        return f'<Attribute {self.name}>'

class Subcategory(Base):

    __tablename__ = "subcategory"

    serialize_only = ('id', 'name', 'category_id', 'attributes')

    serialize_rules = ('-attributes.subcategories',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    attributes = db.relationship('Attribute', secondary="characteristic", back_populates="subcategories")

    def __repr__(self):
        return f'<Subcategory {self.name}>'
