from abc import ABC, abstractmethod

class PowerSource:
    def __init__(self, name, area):
        self.prodData = []
        self.historySize = 10
        self.area = area
        self.name = name

    def addProdData(self, prod: dict):
        self.prodData.append(prod)

        if(len(self.prodData) > self.historySize):
            self.prodData = self.prodData[-self.historySize:]

    def getLastProd(self):
        if len(self.prodData)>0:
            return self.prodData[-1]
        return None
    
    def getProdAfterSelectedTime(self, time):
        #todo
        print("TODO")
        pass

    @abstractmethod
    def getInfo(self):
        raise NotImplementedError("La méthode getInfo() doit être implémentée dans la classe dérivée")
    
    @abstractmethod
    def simulate(self, time, dt):
        raise NotImplementedError("La méthode simulate() doit être implémentée dans la classe dérivée")
    
    @abstractmethod
    def setTarget(self):
        raise NotImplementedError("La méthode setTaget() doit être implémentée dans la classe dérivée")

