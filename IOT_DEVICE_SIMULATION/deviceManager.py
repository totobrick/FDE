import os
import subprocess
from datetime import datetime
from config import CONFIG
from const import *


process = []

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

if not os.path.exists(log_dir):
    os.makedirs(log_dir)


def generate_files(config):
    for i, plant in enumerate(config):  
        filename = f"{output_dir}/power_plant_{i}.py"  
        
        generated_code = code_template.format(
            id=i,
            name=plant['name'],
            type=plant['type'],
            port=plant['port'],
            apiKey=plant['apiKey']
        )
        
        with open(filename, 'w') as file:
            file.write(generated_code)
            print(f"Generated file: {filename}")


def launch_all_power_plants(config):
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


generate_files(CONFIG) #see config.py

launch_all_power_plants(CONFIG)

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
