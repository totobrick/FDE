import random
from datetime import datetime
from .ObjConnect import ObjConnect

class GridDemand(ObjConnect):
    def __init__(self, id, name, population):
        super().__init__(id, name)
        self.population = population 
        self.demand = 0

    def get_time_of_day_factor(self, minute):
        

        time_periods = [
            (0, 360, 0.6), 
            (360, 540, 1.4),
            (540, 720, 1.1), 
            (720, 840, 0.9),
            (840, 1020, 1.0),
            (1020, 1140, 1.5),
            (1140, 1320, 1.0),
            (1320, 1440, 0.6)
        ]

        for i in range(1, len(time_periods)):
            start_time, end_time, start_factor = time_periods[i - 1]
            end_time, _, end_factor = time_periods[i]
            
            if start_time <= minute and minute < end_time:
                ratio = (minute - start_time) / (end_time - start_time)
                demand_factor = start_factor + ratio * (end_factor - start_factor)
                return demand_factor

        print("Error", minute)
        return 1
        

        
    def simulate(self, time, dt):
        time_of_day_factor = self.get_time_of_day_factor(time)
        
        self.demand = time_of_day_factor * self.population * 0.001
        
        random_fluctuation = random.uniform(-0.1, 0.1)
        self.demand *= (1 + random_fluctuation)
        
        if self.demand < 0:
            self.demand = 0

    def getDemand(self):
        return self.demand