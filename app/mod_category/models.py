from app import db, Base

class Category(Base):
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Category {self.name}>'
        