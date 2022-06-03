# Import flask dependencies
from flask import Blueprint, request, render_template, \
                  flash, g, session, redirect, url_for, jsonify

# Import the database object from the main app module
from app import db

# Import module forms
# from app.mod_category.forms import LoginForm

# Import module models (i.e. Catrogy)
from app.mod_category.models import Category

# Define the blueprint: 'auth', set its url prefix: app.url/auth
mod_category = Blueprint('category', __name__, url_prefix='/category')

# Set the route and accepted methods
# @mod_category.route('/signin/', methods=['GET', 'POST'])
# def signin():

#     # If sign in form is submitted
#     form = LoginForm(request.form)

#     # Verify the sign in form
#     if form.validate_on_submit():

#         user = User.query.filter_by(email=form.email.data).first()

#         if user and check_password_hash(user.password, form.password.data):

#             session['user_id'] = user.id

#             flash('Welcome %s' % user.name)

#             return redirect(url_for('auth.home'))

#         flash('Wrong email or password', 'error-message')

#     return render_template("auth/signin.html", form=form)


@mod_category.route('/')
def index():
    categories = Category.query.all()
    return render_template('category/index.html', categories=categories)

@mod_category.route('/raw/')
def raw():
    categories = Category.query.all()
    return jsonify(data=[i.to_dict() for i in categories])

@mod_category.route('/<int:category_id>/')
def category(category_id):
    category = Category.query.get_or_404(category_id)
    return render_template('category/category.html', category=category)

@mod_category.route('/create/', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        name = request.form['name']
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()

        return redirect(url_for('category.index'))

    return render_template('category/create.html')

@mod_category.route('/<int:category_id>/edit/', methods=('GET', 'POST'))
def edit(category_id):
    category = Category.query.get_or_404(category_id)

    if request.method == 'POST':
        name = request.form['name']

        category.name = name

        db.session.add(category)
        db.session.commit()

        return redirect(url_for('category.index'))

    return render_template('category/edit.html', category=category)

@mod_category.post('/<int:category_id>/delete/')
def delete(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return redirect(url_for('category.index'))