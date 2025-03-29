from ..ObjConnect import ObjConnect

class Nuclear(ObjConnect):  
    def __init__(self, id, name):
        super().__init__(id, name)


        self.max_power = 1650 
        self.min_exploitable = 0.25 
        self.targeted_exploitation = 0.5 
        self.actual_exploitation = 0.25 
        self.adjustment_rate = 0.0005 

        self.lastDataDate = 45


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

    def getProd(self):
        if self.actual_exploitation < self.min_exploitable:
            return 0

        return self.max_power * self.actual_exploitation 