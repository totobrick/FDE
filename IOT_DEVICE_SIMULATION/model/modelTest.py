import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
import matplotlib.gridspec as gridspec

import time
from model.simulation.Nuclear import Nuclear
from model.simulation.SolarPanel import SolarPanel
from model.simulation.GridDemand import GridDemand
from model.simulation.WindTurbine import WindTurbine
from model.simulation.HydroelectricDam import HydroelectricDam
from model.simulation.BatteryStorage import BatteryStorage

grid = GridDemand(population=100000)
tab = []
for i in range(1):
    tab.append(Nuclear(i, "")) 

for i in range(2):
    tab.append(SolarPanel(i, "")) 

for i in range(20):
    tab.append(WindTurbine(i, ""))

for i in range(1):
    tab.append(HydroelectricDam(i, ""))


for i in range(1):
    tab.append(BatteryStorage(i, ""))


plt.ion()  

fig = plt.figure(figsize=(10, 8))
gs = gridspec.GridSpec(10, 1, figure=fig)

# Main plot will occupy most of the space
ax = fig.add_subplot(gs[:7, 0])  # rows 0-6


x_data = []  
y_data_total = []  
y_data_nuc = [] 
y_data_solar = [] 
y_data_grid = [] 
y_data_wind = [] 
y_data_hydro = [] 


sliders = []
ax_slider_pos = 0.05 

def create_slider(facility, ax_slider_pos):
    ax_slider = plt.axes([0.15, ax_slider_pos, 0.7, 0.03], facecolor='lightgoldenrodyellow')
    slider = Slider(ax_slider, f'{facility.name} Adjustment', 0, 1, valinit=0.5)
    
    def update(val):
        facility.setTarget(slider.val)

    slider.on_changed(update)
    sliders.append(slider)

for i, facility in enumerate(tab):
    if type(facility) is Nuclear:
        create_slider(facility, ax_slider_pos)
        ax_slider_pos += 0.05 

    if type(facility) is HydroelectricDam:
        create_slider(facility, ax_slider_pos)
        ax_slider_pos += 0.05 

    if type(facility) is BatteryStorage:
        create_slider(facility, ax_slider_pos)
        ax_slider_pos += 0.05  

dt = 10 #10minutes
iteration = 0
data = {}
data["total_production"] = 0
data["total_grid"] = 0


config = {
    "Nuclear": {"color": "green", "label": "Production Nucléaire (MW)"},
    "SolarPanel": {"color": "yellow", "label": "Production Totale Panneau solaire (MW)"},
    "total_grid": {"color": "red", "label": "Demande de la Grille (MW)"},
    "WindTurbine": {"color": "lightblue", "label": "Production Eolienne (MW)"},
    "HydroelectricDam": {"color": "darkblue", "label": "Production barrage (MW)"},
    "total_production": {"color": "blue", "label": "Production Totale (MW)"},
    "BatteryStorage": {"color": "orange", "label": "Battery Totale (MW)"}
}

#Bof doublon
for facility in tab:
    data[type(facility).__name__] = 0

dataHistory = {}
for elt in data:
    print(elt)
    dataHistory[elt] = []
dataHistory["total_production"] = []
dataHistory["total_grid"] = []

time_text = fig.text(0.5, 0.01, "", fontsize=12, color='red', ha='center')

while True:
    #reset
    for elt in data:
        data[elt] = 0


    #Simulation
    for facility in tab:
        facility.simulate(iteration, dt) 
        data["total_production"] += facility.getLastProd()["production"]
        data[type(facility).__name__] += facility.getLastProd()["production"]
        if type(facility) == BatteryStorage:
            print(int(facility.getLastProd()["production"]), " - ", int(facility.getLastProd()["charge"]))
            
        
    grid.simulate(iteration, dt)
    data["total_grid"] = grid.getDemand()

    #Prepare plot
    #fig.clear()
    ax.clear() 
    max_length = (1440 * 5) / dt

    x_data.append(iteration)
    if len(x_data) > max_length:
        x_data.pop(0)

    for elt in data:
        dataHistory[elt].append(data[elt])

        if len(dataHistory[elt]) > max_length:
            dataHistory[elt].pop(0)

        if(config.get(elt)): #Cas ou type non prévu
            ax.plot(x_data, dataHistory[elt], label=config[elt]["label"], color=config[elt]["color"])  
    
    #print(dataHistory["HydroelectricDam"][-1])

    ax.set_xlabel('Temps / Itération')
    ax.set_ylabel('Production / Demande (MW)')
    ax.legend()


    time_text.set_text(f"Hour : {round((iteration/60)%24)}h{round(iteration%60)}  ")


    plt.draw()


    plt.pause(0.001)

    iteration += dt 