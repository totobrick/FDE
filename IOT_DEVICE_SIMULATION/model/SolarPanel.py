from .ObjConnect import *
from .const import consts
import math

class SolarPanel(ObjConnect):

    def __init__(self, id, name):
        super().__init__(id, name)
        self.prod = 0
        self.prod_base = consts["SolarPanelConst"]["prod"]

    def irradiance(self, minute):

        sunshine_start = consts["SolarPanelConst"]["sunshine_start"]
        sunshine_end = consts["SolarPanelConst"]["sunshine_end"]

      
        if sunshine_start <= minute and minute <= sunshine_end:
         
            normalized_time = (minute - sunshine_start) / (sunshine_end - sunshine_start)

        
            irradiance_value = (1 - (normalized_time - 0.5) ** 2) 

            return max(0, irradiance_value)
        else:
            return 0  


    def simulate(self, time, dt):
        G = self.irradiance(time)
        P = self.prod_base * G 
        if P < 0:
            P = 0
        self.prod = P


