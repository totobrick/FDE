from model.powerSource import PowerSource
import random 

class Nuclear(PowerSource):  
    def __init__(self, name, area):
        super().__init__(name, area)

        #Simulation const
        self.max_power = 1600 
        self.min_exploitable = 0.25 
        self.targeted_exploitation = 0.5 
        self.actual_exploitation = 0.25 
        self.adjustment_rate = 0.0005 

    

    def setTarget(self, target):
        self.targeted_exploitation = target 

    def getInfo(self):
        info = {
            "type": "Nuclear",
            "name": self.name,
            "area": self.area,
            "max_prod": self.max_power,
            "min_prod": self.min_exploitable
        }

        return info

    def simulate(self, time, dt):
        for i in range(dt) :
            if self.actual_exploitation < self.targeted_exploitation:
                self.actual_exploitation += (self.targeted_exploitation - self.actual_exploitation) * self.adjustment_rate
            elif self.actual_exploitation > self.targeted_exploitation:

                self.actual_exploitation -= (self.actual_exploitation - self.targeted_exploitation) * self.adjustment_rate


            if self.actual_exploitation < 0:
                self.actual_exploitation = 0
            elif self.actual_exploitation > 1:
                self.actual_exploitation = 1 


            prod = 0 if self.actual_exploitation < self.min_exploitable else max(0, (self.max_power * self.actual_exploitation) * random.uniform(0.975, 1.025))

            prodData = {
                "production" : prod,
                "targeted_exploitation" : self.targeted_exploitation,   
                "actual_exploitation" : self.actual_exploitation,
            }

            self.addProdData(prodData)