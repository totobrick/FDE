from model.powerSource import PowerSource
import random
import math 

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
        p = (g + random.uniform(-0.90, 0))

        prod = p if p > 0 else 0

        prodData = {
                "date": time,
                "actual_exploitation" : prod,
                "targeted_exploitation": 1,
                "production": prod * self.max_power,
        }

        self.addProdData(prodData)


    ######################################
    # Simulation complementary functions #
    ######################################
    def irradiance(self, minute):

        sunshine_start = 5 * 60   # 5:00 AM
        sunshine_end = 19 * 60    # 7:00 PM
        solar_noon = (sunshine_start + sunshine_end) / 2  # Noon
        peak_irradiance = 1.0  # Maximum irradiance at noon

        if minute < sunshine_start or minute > sunshine_end:
            return 0  # No irradiance at night

        # Normalize time (-1 to 1)
        normalized_time = (minute - solar_noon) / ((sunshine_end - sunshine_start) / 2)

        # Apply a cosine-based plateau function
        if abs(normalized_time) < 0.5:  # Peak period (flatter top)
            irradiance_value = peak_irradiance
        else:  # Rising and falling edges
            irradiance_value = peak_irradiance * math.cos((abs(normalized_time) - 0.5) * math.pi)

        return max(0, irradiance_value)  # Ensure no negative values