from fastapi import FastAPI, Request, HTTPException
from .powerSource import PowerSource
import uvicorn
import secrets
import threading
import time

class IPowerSource:
    def __init__(self, ps:PowerSource, id, apiKey=secrets.token_hex(16)):
        self.app = FastAPI()
        self.apiKey = apiKey
        self.powerSource = ps
        self.id = id

        self.initializeRoute()

    def checkToken(self, request):
        auth_header = request.headers.get("Authorization")
    
        if auth_header is None or auth_header != f"{self.apiKey}":
            raise HTTPException(status_code=401, detail="Unauthorized")


    def initializeRoute(self) :
        @self.app.get("/getInfo")
        def read_root(request: Request):
            self.checkToken(request)


            return self.powerSource.getInfo()
        

        @self.app.get("/getProdData")
        def getStatus(request: Request):
            self.checkToken(request)
            
            return self.powerSource.getLastProd()
        

        @self.app.get("/setTarget")
        def setTarget(request: Request, targetedValue: float):
            self.checkToken(request)

            if targetedValue < 0 or targetedValue > 1:
                raise HTTPException(status_code=400, detail="Bad Request: Value must be between 0 and 1")

            self.powerSource.setTarget(targetedValue)
            return {"status_code": 200, "message": "Ok"}
        

    def runSimulation(self) :
        while True:
            self.powerSource.simulate(0, 5)
            #print("Prod:", self.getProd())
            time.sleep(2)


    def run(self):
        print("Launching simulation.")
        thread = threading.Thread(target=self.runSimulation, daemon=True)
        thread.start()

        print("Launching API.")
        uvicorn.run(self.app, host="127.0.0.1", port=8000+self.id)


