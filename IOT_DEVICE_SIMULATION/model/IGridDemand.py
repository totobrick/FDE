from fastapi import FastAPI, Request, HTTPException
from model.simulation.GridDemand import GridDemand
import uvicorn
import secrets
import threading
import time

class IGridDemand:
    def __init__(self, id, port, population, apiKey=secrets.token_hex(16) ):
        self.app = FastAPI()
        self.apiKey = apiKey
        self.id = id
        self.port = port
        self.grid = GridDemand(population) 
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

            return self.grid.getDemand() #todo
        

        @self.app.get("/getDemand")
        def getStatus(request: Request):
            #self.checkToken(request)
            demand, timeDemand = self.grid.getDemand()
            response = {
                "date": timeDemand, "cons": demand, 
            }
            return response

        

    def runSimulation(self) :
        while True:
            self.grid.simulate(self.time, 5)
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


