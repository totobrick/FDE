# FDE - IoT Device Simulation & Server

## 📌 Overview
This project consists of 3 main components:
1. **Main serv (Node.js-based)**
2. **IoT Device Simulation (Python-based)**
3. **IoT Server (Node.js-based)**

Each component requires specific dependencies to be installed before running.

Running the whole project will required to launch all 3 components

---

## 🚀 IoT Device Simulation (Python)
### **Purpose**
This component is responsible for IoT simulation, specifically simulating power plants as REST APIs.

### **Functionality**
The APIs currently provide three endpoints:
1. `/` - Returns the type of power plant, its ID, and name.
2. `/getStatus` - Returns data about the power plant, e.g., `{ "date": 12354686, "prod": 413.53, "target": 0.5, "usage": 0.25 }`
3. `/setTarget` - Allows modification of the power plant's production target.

### **Prerequisites**
1. Install **Python** (if not already installed) → [Download Python](https://www.python.org/downloads/)
2. Install the required modules:
   ```sh
   pip install fastapi uvicorn
   ```

### **Running the IoT Simulation**
After installing the dependencies, run `deviceManager.py`. To stop all simulations and APIs, simply provide any input in the script.

---

## 🌐 IoT Server (Node.js)
### **Purpose**
This component is responsible for requesting all APIs of the IoT devices to update the database.

### **Prerequisites**
1. Install **Node.js** (if not already installed) → [Download Node.js](https://nodejs.org/)
2. Go in the iot-serv directory:
   ```
   cd iot-serv
   ```
3. Install the required dependencies:
   ```sh
   npm install
   ```

### **Running the IoT Server**
After installing the dependencies, start the Express.js server:
```sh
node serv.js
```

### Database
This module connect to the database. 
For dev: make sur mysql is on running no your computer. (with wamp for windows) 
For the database, use the exported one in the database folder. If you enconter any trouble related to the connection with the database, checks the credentials of the database.

**Note:** Make sure you are in the `iot-serv` folder before running the command.

---

## 🌐 IoT Client (Node.js)
### **Purpose**
Acessing the website.

### **Prerequisites**
1. Install **Node.js** (if not already installed) → [Download Node.js](https://nodejs.org/)
2. Go in the prod directory
```sh
cd prod
```
3. Install the required dependencies with:
   ```sh
   npm install
   ```

### **Running the IoT Client**
After installing the dependencies, start the Express.js server:
```sh
node server.js
```

---
