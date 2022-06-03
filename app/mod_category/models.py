# Import the database object (db) from the main application module
# We will define this inside /app/__init__.py in the next sections.
from app import db

# Define a base model for other database tables to inherit
class Base(db.Model):

    __abstract__  = True

    id            = db.Column(db.Integer, primary_key=True)
    # date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
    # date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
    #                                        onupdate=db.func.current_timestamp())

# Define a Category model
class Category(Base):
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Category {self.name}>'
        