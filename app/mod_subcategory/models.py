from app import db, Base


subc_attr_relation_table = db.Table(
    "subc_attr_relation",
    db.Column("subcategory_id", db.ForeignKey("subcategory.id"), primary_key=True),
    db.Column("attribute_id", db.ForeignKey("attribute.id"), primary_key=True),
)

class Subcategory(Base):

    __tablename__ = "subcategory"

    serialize_only = ('id', 'name', 'category_id', 'attributes')

    serialize_rules = ('-attributes.subcategories',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    attributes = db.relationship('Attribute', secondary=subc_attr_relation_table, back_populates="subcategories")

    def __repr__(self):
        return f'<Subcategory {self.name}>'

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
