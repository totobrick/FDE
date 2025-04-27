from model.powerSource import PowerSource
import random 

class HydroelectricDam(PowerSource):
    def __init__(self, name, area):
        super().__init__(name, area)
        
        self.max_power = 1000  
        self.flow_to_power_factor = 0.1  

        # Water storage in the dam (
        self.maxWater = 5000000
        self.water_volume = 100  
        self.water_used_per_second = 0 
        self.waterIn_per_sec = 500
        self.target_exploitation = 0

        self.max_flow_rate = 5000


    def getInfo(self):
        info = {
            "type": "HydroelectricDam",
            "name": self.name,
            "area": self.area,
            "max_prod": self.max_power,
        }
        return info

    def setTarget(self, targeted):
        """ Set the flow rate in m³/s (can be controlled) """
        self.target_exploitation = targeted
        self.water_used_per_second = targeted * self.max_flow_rate

    def hydro_power_curve(self, flow_rate):
        inflow = random.gauss(self.waterIn_per_sec, self.waterIn_per_sec * 0.5)
        inflow = max(0, inflow)  

        self.water_volume += inflow


        power = self.flow_to_power_factor * min(self.water_volume, flow_rate)
        return power 

    def simulate(self, time, dt):
        
        production = self.hydro_power_curve(self.water_used_per_second)
                
        self.water_volume -= self.water_used_per_second

        if(self.water_volume<0):
                self.water_volume=0
        elif (self.water_volume>self.maxWater) :
             self.water_volume = self.maxWater

        

        prodData = {
                "production": production,
                "targeted_exploitation": self.target_exploitation,
                "actual_exploitation": production, #todo

                #Complementary data
                "opt": self.water_volume,
        }

        self.addProdData(prodData)