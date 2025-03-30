from ..powerSource import PowerSource

class Nuclear(PowerSource):  
    def __init__(self, name, area):
        super().__init__(name, area)

        #Simulation const
        self.max_power = 1650 
        self.min_exploitable = 0.25 
        self.targeted_exploitation = 0.5 
        self.actual_exploitation = 0.25 
        self.adjustment_rate = 0.0005 

    

    def setTarget(self, target):
        self.targeted_exploitation = target 

    def getInfo(self):
        info = {
            "type": "nuclear power plant",
            "name": self.name,
            "area": self.area,
            "max_prod": self.max_power,
            "min_prod": self.min_exploitable
        }

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

            prod = 0 if self.actual_exploitation < self.min_exploitable else self.max_power * self.actual_exploitation

            prodData = {
                "date": 0,
                "targeted_exploitation" : self.targeted_exploitation,
                "actual_exploitation" : self.actual_exploitation,
                "production" : prod
            }

            self.addProdData(prodData)