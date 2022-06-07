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
