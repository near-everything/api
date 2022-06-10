from app import db, Base

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
