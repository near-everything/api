from app import db, Base

class Subcategory(Base):

    serialize_only = ('id', 'name', 'category_id')

    name = db.Column(db.String(255), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))

    def __repr__(self):
        return f'<Subcategory {self.name}>'
        