from app import db, Base

class Category(Base):
    
    serialize_only = ('id', 'name', 'subcategories')
    # serialize_rules = ('-subcategories.category_id')

    name = db.Column(db.String(255), nullable=False)
    subcategories = db.relationship('Subcategory', backref='category')
    

    def __repr__(self):
        return f'<Category {self.name}>'
