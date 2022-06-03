# Everything API

The entry point to communicating with the ecosystem of everything.

*IN PROGRESS*

#
## Usage

**Prerequisites**:
  * [Python](https://www.python.org/downloads/)
  * [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  * [Visual Studio Code](https://code.visualstudio.com)
  * [VS Code Extension: SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools)
  * [SQLTools MySQL Driver](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)


### Getting Started 

1. Clone the repository
```bash
git clone https://github.com/near-everything/api.git
```

2. Navigate to the directory and create a virtual environment
```bash
cd api
python3 -m venv venv/
source venv/bin/activate
```

3. Install packages
```bash
pip install -r requirements.txt
```

4. Start the docker container that will host the mySQL database
```bash
docker-compose up -d
```

5. Run application
```bash
export FLASK_APP=app
export FLASK_ENVIRONMENT=development
flask run
```

6. Open interface in browser via http://127.0.0.1:5000. This should show the contents of the database


# 
### Interacting with the Database via SQLTools

In order to connect to the database via SQLTools and do fun stuff, we need to create a new user with all permissions.

Step into the docker container
```bash
docker exec -it api-mysql-1 mysql -u root -p
```
This will prompt a password, enter `localeverything`. This password can be found in [docker-compose.yml](/docker-compose.yml).

Upon successful login, you'll find yourself in a mySQL command client.

Create the new user (sqluser) and assign priveleges with the following commands:
```sql
CREATE USER 'sqluser'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'sqluser'@'%';
FLUSH PRIVILEGES;
```

Now we can connect to the database via SQLTools.

Open VSCode and open the SQLTools Plugin (found on the left tool bar):

Add a New Connection
Select mySQL

And now populate with the following values:

![Connection Assistant](/docs/connection-assistant.png)

The username and password are of the user we just created in the mySQL command client
```
username: sqluser
password: password
```

Test and save the connection, then connect to the database.
If successful, this should bring up everything-dev.session.sql.

Run the "DESCRIBE Category" Block.

