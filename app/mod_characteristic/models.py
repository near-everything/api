from app import db, Base

class Characteristic(Base):

    __tablename__ = "characteristic"

    serialize_only = ('subcategory_id', 'attribute_id')

    serialize_rules = ('-options.characteristics',)

    subcategory_id = db.Column(db.ForeignKey("subcategory.id"), primary_key=True)
    attribute_id = db.Column(db.ForeignKey("attribute.id"), primary_key=True)

    def __repr__(self):
        return f'<Attribute {self.attribute_id} has a Characteristic with Subcategory {self.subcategory_id}>'

