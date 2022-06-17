from dotenv import load_dotenv

load_dotenv()
# Statement for enabling the development environment
DEBUG = True

# Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  

# Define the database - we are working with
# SQLite for this example
SQL_USERNAME=os.environ["SQL_USERNAME"]
SQL_PASSWORD=os.environ["SQL_PASSWORD"]
SQL_URL=os.environ["SQL_URL"]
SQL_PORT=os.environ["SQL_PORT"]
SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{SQL_USERNAME}:{SQL_PASSWORD}@{SQL_URL}:{SQL_PORT}/everything'
DATABASE_CONNECT_OPTIONS = { }
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Application threads. A common general assumption is
# using 2 per available processor cores - to handle
# incoming requests using one and performing background
# operations using the other.
THREADS_PER_PAGE = 2

# Enable protection agains *Cross-site Request Forgery (CSRF)*
CSRF_ENABLED     = True

# Use a secure, unique and absolutely secret key for
# signing the data. 
CSRF_SESSION_KEY = "secret"

# Secret key for signing cookies
SECRET_KEY = "secret"

CORS_HEADERS = 'Content-Type'