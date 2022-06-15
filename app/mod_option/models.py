from app import db, Base

class Option(Base):

    __tablename__ = "option"

    serialize_only = ('id', 'name', 'label', 'attribute_id')

    # serialize_rules = ('-subcategories.attributes',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    label = db.Column(db.String(255), nullable=False)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'))

    def __repr__(self):
        return f'<Option {self.name}>'
