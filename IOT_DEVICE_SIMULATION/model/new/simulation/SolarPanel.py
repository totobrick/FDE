from ..powerSource import PowerSource

class SolarPanel(PowerSource):  
    def __init__(self, name, area):
        super().__init__(name, area)

        #Simulation const
        self.max_power = 300 
        self.actif = True

    def setTarget(self, target: bool):
        self.actif = target 

    def getInfo(self):
        info = {
            "type": "Solar Panel",
            "name": self.name,
            "area": self.area,
            "max_prod": self.max_power,
        }

        return info

    def simulate(self, time, dt):
        g = self.irradiance(time%1440)
        p = self.max_power * g

        prod = p if p > 0 else 0

        prodData = {
                "date": time,
                "production" : prod
        }

        self.addProdData(prodData)


    ######################################
    # Simulation complementary functions #
    ######################################
    def irradiance(self, minute):

        sunshine_start = 6 * 60
        sunshine_end = 18 * 60

      
        if sunshine_start <= minute and minute <= sunshine_end:
         
            normalized_time = (minute - sunshine_start) / (sunshine_end - sunshine_start)

        
            irradiance_value = (1 - (normalized_time - 0.5) ** 2) 

            return max(0, irradiance_value)
        else:
            return 0  