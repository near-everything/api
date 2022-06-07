from app import db, Base
from app.mod_subcategory.models import subc_attr_relation_table


class Attribute(Base):

    __tablename__ = "attribute"

    serialize_only = ('id', 'name', 'options', 'subcategories')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    options = db.relationship('AttributeOption', backref='attribute')
    subcategories = db.relationship('Subcategory', secondary=subc_attr_relation_table, back_populates="attributes")

    def __repr__(self):
        return f'<Attribute {self.name}>'

class AttributeOption(Base):

    __tablename__ = "attribute_option"

    serialize_only = ('id', 'name', 'attribute_id')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'))

    def __repr__(self):
        return f'<Attribute Option {self.name}>'
