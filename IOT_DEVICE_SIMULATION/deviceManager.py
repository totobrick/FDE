import os
import subprocess
from datetime import datetime
from config import CONFIG



output_dir = "IOT_DEVICE_SIMULATION/.tmp/generated_files"
log_dir = "IOT_DEVICE_SIMULATION/.tmp/log"

code_template_plant = """
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

code_template_gridDemand = """
import sys
import os

#Add model to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
print()

from model.IGridDemand import IGridDemand

print("Creating Sensors and API {id}.")

API = IGridDemand({id}, {port}, {population},"{apiKey}")
API.run()
"""




process = []

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

if not os.path.exists(log_dir):
    os.makedirs(log_dir)


def generate_files(config):
    filenames = []
    for i, plant in enumerate(config):  
        filename = f"{output_dir}/{plant['type']}_{i}.py"  
        filenames.append(filename)

        if(plant['type']=="GridDemand") :
            generated_code = code_template_gridDemand.format(
                id=i,
                name=plant['name'],
                type=plant['type'],
                population=plant['population'],
                port=plant['port'],
                apiKey=plant['apiKey']
            )
        else :
            generated_code = code_template_plant.format(
                id=i,
                name=plant['name'],
                type=plant['type'],
                port=plant['port'],
                apiKey=plant['apiKey']
            )
        
        with open(filename, 'w') as file:
            file.write(generated_code)
            
            print(f"Generated file: {filename}")

    return filenames


def launch_all_power_plants(config, filenames):
    for i in range(len(config)):
        script_filename = filenames[i]

        try:
            log_filename = f"{log_dir}/log_{i}.txt"
            print(f"Launching {script_filename}...")
            with open(log_filename, "a") as log:
                log.write(f"\n\n#################### Starting {datetime.today().strftime('%Y-%m-%d %H:%M:%S')} ###############\n")
                process.append(subprocess.Popen(["python", "-u", script_filename], stdout=log, stderr=subprocess.STDOUT))
                #-u option make stdout not buffered

        except Exception as e:
            print(f"Error launching {script_filename}: {e}")


filenames = generate_files(CONFIG) #see config.py
print(filenames)

launch_all_power_plants(CONFIG, filenames)

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
