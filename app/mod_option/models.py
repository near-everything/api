# from sqlalchemy import ForeignKeyConstraint
# from app import db, Base

# class Association(Base):

#     __tablename__ = "association"

#     serialize_only = ('characteristic_id', 'option_id')

#     characteristic_id = db.Column(ForeignKeyConstraint(['subcategory_id', 'attribute_id'], ['characteristic.subcategory_id', 'characteristic.attribute_id']), primary_key=True)
#     option_id = db.Column(db.ForeignKey("option.id"), primary_key=True)

#     def __repr__(self):
#         return f'<Association between Characteristic {self.characteristic_id} and Option {self.option_id}>'

# class Option(Base):

#     __tablename__ = "option"

#     serialize_only = ('id', 'name', 'characteristics')

#     serialize_rules = ('-characteristics.options',)

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)
#     characteristics = db.relationship('Characteristic', secondary="association", 
# back_populates="options")

#     def __repr__(self):
#         return f'<Option {self.name}>'