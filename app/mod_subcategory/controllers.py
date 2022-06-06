from flask import Blueprint, request, render_template, \
                  flash, g, session, redirect, url_for, jsonify
from app import db
from app.mod_subcategory.models import Subcategory

mod_subcategory = Blueprint('subcategory', __name__, url_prefix='/subcategory')


@mod_subcategory.route('/')
def index():
    subcategories = Subcategory.query.all()
    return render_template('subcategory/index.html', subcategories=subcategories)

@mod_subcategory.route('/raw/')
def raw():
    subcategories = Subcategory.query.all()
    response = jsonify(subcategories=[i.to_dict() for i in subcategories])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@mod_subcategory.route('/raw/<int:subcategory_id>/')
def rawAttributes():
    subcategories = Subcategory.query.all()
    response = jsonify(subcategories=[i.to_dict() for i in subcategories])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@mod_subcategory.route('/<int:subcategory_id>/')
def subcategory(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    return render_template('subcategory/subcategory.html', subcategory=subcategory)

@mod_subcategory.route('/create/', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        name = request.form['name']
        category_id = request.form['category_id']
        subcategory = Subcategory(name=name, category_id=category_id)
        db.session.add(subcategory)
        db.session.commit()

        return redirect(url_for('subcategory.index'))

    return render_template('subcategory/create.html')

@mod_subcategory.route('/<int:subcategory_id>/edit/', methods=('GET', 'POST'))
def edit(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)

    if request.method == 'POST':
        name = request.form['name']
        category_id = request.form['category_id']

        subcategory.name = name
        subcategory.category_id = category_id

        db.session.add(subcategory)
        db.session.commit()

        return redirect(url_for('subcategory.index'))

    return render_template('subcategory/edit.html', subcategory=subcategory)

@mod_subcategory.post('/<int:subcategory_id>/delete/')
def delete(subcategory_id):
    subcategory = Subcategory.query.get_or_404(subcategory_id)
    db.session.delete(subcategory)
    db.session.commit()
    return redirect(url_for('subcategory.index'))