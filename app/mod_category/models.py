from app import db, Base

class Category(Base):

    __tablename__ = "category"

    serialize_only = ('id', 'name')

    name = db.Column(db.String(255), nullable=False)
    subcategories = db.relationship('Subcategory')

    def __repr__(self):
        return f'<Category {self.name}>'