import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
import time
from model.simulation.Nuclear import Nuclear
from model.simulation.SolarPanel import SolarPanel
from model.simulation.GridDemand import GridDemand


grid = GridDemand(population=10000000)
tab = []
for i in range(5):
    tab.append(Nuclear(i, "")) 

for i in range(20):
    tab.append(SolarPanel(i, "")) 



plt.ion()  
fig, ax = plt.subplots()


x_data = []  
y_data_total = []  
y_data_nuc = [] 
y_data_solar = [] 
y_data_grid = [] 


sliders = []
ax_slider_pos = 0.05 

def create_slider(facility, ax_slider_pos):
    ax_slider = plt.axes([0.15, ax_slider_pos, 0.7, 0.03], facecolor='lightgoldenrodyellow')
    slider = Slider(ax_slider, f'{facility.name} Adjustment', 0.1, 1, valinit=0.5)
    
    def update(val):
        facility.targeted_exploitation = slider.val

    slider.on_changed(update)
    sliders.append(slider)

for i, facility in enumerate(tab):
    if type(facility) is Nuclear:
        create_slider(facility, ax_slider_pos)
        ax_slider_pos += 0.05  

dt = 50
iteration = 0
while True:
    total_production = 0  
    total_nuc = 0
    total_solar = 0

   
    for facility in tab:
        facility.simulate(iteration, dt) 
        total_production += facility.getLastProd()["production"]
        if type(facility) is Nuclear:
            total_nuc += facility.getLastProd()["production"]
        elif type(facility) is SolarPanel:
            total_solar += facility.getLastProd()["production"]

    grid.simulate(iteration, dt)

    x_data.append(iteration)
    y_data_nuc.append(total_nuc)
    y_data_solar.append(total_solar)
    y_data_total.append(total_production)
    y_data_grid.append(grid.getDemand())

    max_length = (1440 * 5) / dt
    if len(x_data) > max_length:
        x_data.pop(0)
        y_data_nuc.pop(0)
        y_data_solar.pop(0)
        y_data_total.pop(0)
        y_data_grid.pop(0)

    ax.clear() 
    ax.plot(x_data, y_data_total, label='Production Totale (MW)', color="blue")  
    ax.plot(x_data, y_data_solar, label='Production Totale Panneau solaire (MW)', color="yellow") 
    ax.plot(x_data, y_data_nuc, label='Production Nucléaire (MW)', color="green") 
    ax.plot(x_data, y_data_grid, label='Demande de la Grille (MW)', color="red") 
    ax.set_xlabel('Temps / Itération')
    ax.set_ylabel('Production / Demande (MW)')
    ax.legend()

    ax.text(0, 0.25, f"Time : {round((iteration/60)%24)}h{round(iteration%60)}  ", fontsize=12, color='red', ha='center')


    plt.draw()


    plt.pause(0.001)

    iteration += dt 