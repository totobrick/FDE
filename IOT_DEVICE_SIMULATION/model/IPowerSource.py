from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .powerSource import PowerSource
import uvicorn
import secrets
import threading
import time

class IPowerSource:
    def __init__(self, ps:PowerSource, id, port, apiKey=secrets.token_hex(16)):
        self.app = FastAPI()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.apiKey = apiKey
        self.powerSource = ps
        self.id = id
        self.port = port

        self.time = 0

        self.initializeRoute()

    def checkToken(self, request):
        auth_header = request.headers.get("Authorization")
    
        if auth_header is None or auth_header != f"{self.apiKey}":
            raise HTTPException(status_code=401, detail="Unauthorized")


    def initializeRoute(self) :
        @self.app.get("/getInfo")
        def read_root(request: Request):
            #self.checkToken(request)


            return self.powerSource.getInfo()
        

        @self.app.get("/getProdData")
        def getStatus(request: Request):
            #self.checkToken(request)
            
            return self.powerSource.getLastProd()
        

        @self.app.get("/setTarget")
        def setTarget(request: Request, targetedValue: float):
            #self.checkToken(request)

            if targetedValue < 0 or targetedValue > 1:
                raise HTTPException(status_code=400, detail="Bad Request: Value must be between 0 and 1")

            self.powerSource.setTarget(targetedValue)
            return {"status_code": 200, "message": "Ok"}
        

    def runSimulation(self) :
        while True:
            self.powerSource.simulate(self.time, 5)
            self.time += 100
            time.sleep(5)


    def run(self):
        print("Launching simulation.")
        thread = threading.Thread(target=self.runSimulation, daemon=True)
        thread.start()

        print("Launching API.")
        port = self.port
        try:
            uvicorn.run(self.app, host="127.0.0.1", port=port)
        except OSError as e:
            print(f"Port {port} is likely already in use. API launching aborted.")
            print(f"Error: {e}")


