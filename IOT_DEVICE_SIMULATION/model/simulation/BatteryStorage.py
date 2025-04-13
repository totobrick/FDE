from model.powerSource import PowerSource

class BatteryStorage(PowerSource):  
    def __init__(self, name, area):
        super().__init__(name, area)

        self.capacity = 1000         
        self.current_charge = 500   
        self.charge_rate = 50       
        self.efficiency = 0.95       
        self.target_power = 0  
        self.targeted_exploitation = 0     

    def setTarget(self, target):
        self.targeted_exploitation = max(min(target, 1), 0)

    def getInfo(self):
        return {
            "type": "BatteryStorage",
            "name": self.name,
            "area": self.area,

            #Complementary data
            "efficiency":  self.efficiency,
            "capacity": self.capacity,
            "current_charge": self.current_charge,
            "charge_rate": self.charge_rate,
        }

    def simulate(self, time, dt):
        
        prod = (self.targeted_exploitation - 0.5) * self.charge_rate

        if prod > self.current_charge:
            prod = self.current_charge

        self.current_charge = max(min(self.current_charge - prod, self.capacity), 0)

        if(prod>0) :
            prod *= self.efficiency

        
        self.addProdData({
            "production": prod, # positive: gave energy, negative: absorbed
            "targeted_exploitation": self.targeted_exploitation,
            "actual_exploitation": prod/self.charge_rate,

            #Complementary data
            "opt": self.current_charge #charge
        })