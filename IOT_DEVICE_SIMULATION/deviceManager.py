import os
import subprocess
from datetime import datetime


config = [
    {"type": "Nuclear", "name": "NuclearPowerPlant_01", "apiKey": "key1"},
    {"type": "Nuclear", "name": "NuclearPowerPlant_02", "apiKey": "key2"},
    {"type": "Nuclear", "name": "NuclearPowerPlant_03", "apiKey": "key3"},
    {"type": "SolarPanel", "name": "SolarPanel_01", "apiKey": "key4"}
]


code_template = """
import sys
import os

#Add model to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
print()

from model.nuclearPlant.nuclearInterface import INuclearPowerPlant

print("Creating power source and API {id}.")
powerPlant = INuclearPowerPlant({id}, "{name}", "{apiKey}")
powerPlant.run()
"""

code_template_bis = """
import sys
import os

#Add model to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
print()

from model.new.IPowerSource import IPowerSource
from model.new.simulation.{type} import {type}

print("Creating power source and API {id}.")

plant = {type}("{name}", "IDF")

API = IPowerSource(plant, {id} ,"{apiKey}")
API.run()
"""

output_dir = "IOT_DEVICE_SIMULATION/.tmp/generated_files"
log_dir = "IOT_DEVICE_SIMULATION/.tmp/log"


process = []


if not os.path.exists(output_dir):
    os.makedirs(output_dir)

if not os.path.exists(log_dir):
    os.makedirs(log_dir)


def generate_files(config):
    for i, plant in enumerate(config):  
        filename = f"{output_dir}/power_plant_{i}.py"  
        
        generated_code = code_template_bis.format(
            id=i,
            name=plant['name'],
            type=plant['type'],
            apiKey=plant['apiKey']
        )
        
        with open(filename, 'w') as file:
            file.write(generated_code)
            print(f"Generated file: {filename}")


def launch_all_power_plants():
    for i in range(len(config)):
        script_filename = f"{output_dir}/power_plant_{i}.py"

        try:
            log_filename = f"{log_dir}/log_{i}.txt"
            print(f"Launching {script_filename}...")
            with open(log_filename, "a") as log:
                log.write(f"\n\n#################### Starting {datetime.today().strftime('%Y-%m-%d %H:%M:%S')} ###############\n")
                process.append(subprocess.Popen(["python", "-u", script_filename], stdout=log, stderr=subprocess.STDOUT))
                #-u option make stdout not buffered

        except Exception as e:
            print(f"Error launching {script_filename}: {e}")



generate_files(config)

launch_all_power_plants()

input("Press any input to terminate all APIs.")

print(process)
for i, api in enumerate(process):
    try:
        print(f"Force killing API {api.pid}")
        api.kill()
        api.wait(timeout=5)
        log_filename = f"{log_dir}/log_{i}.txt"
        with open(log_filename, "a") as log:
            log.write(f"\n#################### End {datetime.today().strftime('%Y-%m-%d %H:%M:%S')} ###############\n")

    except Exception as e:
        print(f"Error terminating API {api.pid}: {e}")

print("All APIs exited.")

exit(0)
