output_dir = "IOT_DEVICE_SIMULATION/.tmp/generated_files"
log_dir = "IOT_DEVICE_SIMULATION/.tmp/log"

code_template = """
import sys
import os

#Add model to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
print()

from model.IPowerSource import IPowerSource
from model.simulation.{type} import {type}

print("Creating power source and API {id}.")

plant = {type}("{name}", "IDF")

API = IPowerSource(plant, {id}, {port} ,"{apiKey}")
API.run()
"""

