import random
from datetime import datetime
import time

class GridDemand():
    def __init__(self, population):
        self.population = population 
        self.demand = 0
        self.timeDemand = 0

    def simulate(self, time_, dt):
        time_of_day_factor = self.get_time_of_day_factor(time_%1440)
        
        self.demand = time_of_day_factor * self.population * 0.001
        
        random_fluctuation = random.uniform(-0.1, 0.1)
        self.demand *= (1 + random_fluctuation)

        self.timeDemand = time.time()
        
        if self.demand < 0:
            self.demand = 0

    def getDemand(self):
        return self.demand, self.timeDemand
    

    ######################################
    # Simulation complementary functions #
    ######################################

    def get_time_of_day_factor(self, minute):
        # Time periods with demand factors
        time_periods = [
            (0, 420, 0.6), 
            (420, 540, 1.4),
            (540, 720, 1.25), 
            (720, 840, 1.1),
            (840, 1020, 1.3),
            (1020, 1140, 1.5),
            (1140, 1260, 1.0),
            (1260, 1440, 0.6)
        ]


        if not (0 <= minute < 1440):
            print(f"Error: Invalid minute value {minute}")
            return 1.0  


        for i in range(len(time_periods) - 1):
            start_time, end_time, start_factor = time_periods[i]
            next_start_time, _, end_factor = time_periods[i + 1]

            if start_time <= minute < next_start_time:
                ratio = (minute - start_time) / (next_start_time - start_time)
                return start_factor + ratio * (end_factor - start_factor)

        return time_periods[-1][2]