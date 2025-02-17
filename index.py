from app import app
from utils.db import db
from Routes.Categorias import categorias


with app.app_context():
    db.create_all()
    

if __name__ == "__main__":
    app.run(debug=True)