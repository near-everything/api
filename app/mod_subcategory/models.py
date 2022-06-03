from app import db, Base

class Subcategory(Base):
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Subcategory {self.name}>'
        