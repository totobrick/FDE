from abc import ABC, abstractmethod
import secrets

class ObjConnect(ABC):
    def __init__(self, id, name): 
        self.id = id
        self.name = name
        self.apiKey = secrets.token_hex(16)

        
        self.area = ""
        self.prod = 0
       

    @abstractmethod
    def simulate(self, time, dt):
        raise NotImplementedError("La méthode simulate() doit être implémentée dans la classe dérivée")

    def getProd(self):
        return self.prod