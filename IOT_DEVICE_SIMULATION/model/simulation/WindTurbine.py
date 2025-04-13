from model.powerSource import PowerSource
import random
import math

class WindTurbine(PowerSource):  
    def __init__(self, name, area):
        super().__init__(name, area)

        # Simulation constants
        self.max_power = 3 * 25  # in MW, typical for modern wind turbines There are regrouped by grp of 25
        self.min_wind_speed = 10  # m/s, below this turbine doesn't produce
        self.max_wind_speed = 20  # m/s, above this turbine shuts down
        self.rated_wind_speed = 12  # m/s, where max power is reached
        self.targeted_exploitation = 1

    def getInfo(self):
        info = {
            "type": "wind turbine",
            "name": self.name,
            "area": self.area,
            "max_prod": self.max_power,
            "min_wind_speed": self.min_wind_speed,
            "max_wind_speed": self.max_wind_speed,
            "rated_wind_speed": self.rated_wind_speed
        }

        return info

    def wind_power_curve(self, wind_speed):
        if wind_speed < self.min_wind_speed or wind_speed > self.max_wind_speed:
            return 0
        elif wind_speed < self.rated_wind_speed:
            # Using a cubic relation between wind speed and power
            return self.max_power * ((wind_speed - self.min_wind_speed) / (self.rated_wind_speed - self.min_wind_speed)) ** 3
        else:
            return self.max_power

    def simulate(self, time, dt):
        for i in range(dt):
            # Simulate wind speed (in m/s) with slight variability
            wind_speed = random.gauss(15, 15)  # Mean 8 m/s, std dev 2

            # Ensure wind speed stays in a physical range
            wind_speed = max(0, min(wind_speed, self.max_wind_speed + 5))

            production = self.wind_power_curve(wind_speed) * random.uniform(0.95, 1.05)

            prodData = {
                "targeted_exploitation" : self.targeted_exploitation,
                "production" : production,
                "actual_exploitation" : self.targeted_exploitation,
            }

            self.addProdData(prodData)