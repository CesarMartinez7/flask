from utils.db import db
from Models.Categorias import Categorias


class CategoriasQuery:
    @staticmethod
    def obtener_categorias():
        return Categorias.query.all()
        
    