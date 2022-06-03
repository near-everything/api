import os
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] ="mysql+pymysql://sqluser:password@localhost:3306/everything"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Category {self.name}>'

@app.route('/')
def index():
    categories = Category.query.all()
    return render_template('index.html', categories=categories)

@app.route('/<int:category_id>/')
def category(category_id):
    category = Category.query.get_or_404(category_id)
    return render_template('category.html', category=category)

@app.route('/create/', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        name = request.form['name']
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()

        return redirect(url_for('index'))

    return render_template('create.html')

@app.route('/<int:category_id>/edit/', methods=('GET', 'POST'))
def edit(category_id):
    category = Category.query.get_or_404(category_id)

    if request.method == 'POST':
        name = request.form['name']

        category.name = name

        db.session.add(category)
        db.session.commit()

        return redirect(url_for('index'))

    return render_template('edit.html', category=category)

@app.post('/<int:category_id>/delete/')
def delete(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return redirect(url_for('index'))