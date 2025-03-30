from .nuclear import Nuclear
from fastapi import FastAPI, Request, HTTPException
import uvicorn
import secrets
import threading
import time

class INuclearPowerPlant(Nuclear):
    def __init__(self, id, name, apiKey=secrets.token_hex(16)):
        super().__init__(id, name)
        self.app = FastAPI()
        self.apiKey = apiKey

        self.initializeRoute()

        print(
            f"""
            ############################################
            #        Nuclear Power Plant created       #
            ############################################
            -id : {self.id}
            -name : {self.name}
            -apiKey : {self.apiKey}
            """
        )




    def initializeRoute(self) :
        @self.app.get("/")
        def read_root():
            return {f"Nuclear Power Plant {self.id} : {self.name}."}
        
        @self.app.get("/getStatus")
        def getStatus(request: Request):
            auth_header = request.headers.get("Authorization")
    
            if auth_header is None or auth_header != f"{self.apiKey}":
                raise HTTPException(status_code=401, detail="Unauthorized")
            
            return {
                    "id": self.id,
                    "date": self.lastDataDate,
                    "prod": self.getProd(),
                    "target" : self.targeted_exploitation,
                    "usage" : self.actual_exploitation
                    }
        

        @self.app.get("/setTarget")
        def setTarget(request: Request, targetedValue: float):
            auth_header = request.headers.get("Authorization")
    
            if auth_header is None or auth_header != f"Bearer {self.apiKey}":
               raise HTTPException(status_code=401, detail="Unauthorized")

            if targetedValue < 0 or targetedValue > 1:
                raise HTTPException(status_code=400, detail="Bad Request: Value must be between 0 and 1")

            self.targeted_exploitation = targetedValue
            return {"status_code": 200, "message": "Ok"}
        
    def runSimulation(self) :
        while True:
            self.simulate(0, 5)
            #print("Prod:", self.getProd())
            time.sleep(2)

    def run(self):
        print("Launching simulation.")
        thread = threading.Thread(target=self.runSimulation, daemon=True)
        thread.start()

        print("Launching API.")
        uvicorn.run(self.app, host="127.0.0.1", port=8000+self.id)


