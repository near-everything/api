from app import db, Base

class Attribute(Base):

    __tablename__ = "attribute"

    serialize_only = ('id', 'name', 'subcategories')

    serialize_rules = ('-subcategories.attributes',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    subcategories = db.relationship('Subcategory', secondary="characteristic", back_populates="attributes")

    def __repr__(self):
        return f'<Attribute {self.name}>'
