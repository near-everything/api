from app import db, Base

class Attribute(Base):

    __tablename__ = "attribute"

    serialize_only = ('id', 'name', 'label', 'isMulti', 'subcategories', 'options')

    serialize_rules = ('-subcategories.attributes',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    label = db.Column(db.String(255), nullable=False)
    isMulti = db.Column(db.Boolean)
    subcategories = db.relationship('Subcategory', secondary="characteristic", back_populates="attributes")
    options = db.relationship('Option')

    def __repr__(self):
        return f'<Attribute {self.name}>'
