# MVP : Minimum Viable Product

## 📌 Overview
The MVP is about all the website structure and front.
It concerns :
   - HTML web page
   - PHP for request to the database
   - CSS for the style

## Installation
### node.js and npm
MESSAGE A ARTHUR : je n'ai pas pu retraiter ce point car j'ai passé plus de temps que prévu mais voici néanmoins ce que je peux dire.

Requests in our web pages are done in node.js
To **install node.js (and npm)** on Windows :
   - go to : https://nodejs.org/en/download
   - select the last LTS version (LTS is more stable than Current version) for Windows using "fnm" with "npm"
   - download clicking on "Windows installer (.msi)"
   - follow the information of the installer

After installation : 
   - open a PowerShell terminal
   - type : ```node -v```, if your version is not written there is a problem
   - type : ```npm -v```, if your version is not written there is a problem

### MySQL
To install mysql : 
   - open your PowerShell terminal
   - type : ```npm install mysql``` (in the good directory, I don't know where actually, I will say you very soon)



### General & database
To use the website and install it, please launch your Windows OS and read the next steps :
   1. Launch Windows
   2. in **C:\wamp64\www** : clone this git repository (necessary for wampserver to acces to the project). A directory "\FDE" will appear
   3. launch **WampServer64** : if you don't have the app, install it
   4. Install (temporary) database :
      - on your browser, write in URL : **"localhost"**
      - click on : **"PhpMyAdmin X.X.X"** (X.X.X is the version of php)
      if it does not work : try to write **"http://localhost/phpmyadmin/"** in the URL field
      - PhpMyAdmin connection : 
         - login : **"root"**
         - password : **""** (nothing)
      - click on "Import" at the top
      - choose this file in the project : ".../www/FDE/Database/**fde_database.sql**"

Now the database is installed and you can use the website.

**Information** : we have actually a new database but the old is in */Database/OLD_database/* because web pages are still based on this old database. It will change in a few time ...

### Email
Emails are sent to the user when :
   - he wants to create an account
   - he forgots his password

You have to put the key file named "**.env**" in : ...\www\FDE\cy-love-main\Mails  

ATTENTION : This file is ignored for push and commit because he includes sensitive informations about the email address use such as :
   - sender email adress
   - password of this email adress
If you want the file, please ask Thomas to send you the file in private.

## Website main pages
index.php : main page  
login.php : page of login  
register.php : page of register  
search.php : use to search something (not used now)  

session_lifespan.js  
+session_lifespan.php  
+logout_session_expired.php : used for auto disconnection after 10 minutes of inactivity  


header.php : top of all pages (with logos and nav menu)
account_icon_bar.php : nav menu (on the left) for connected peaople




# FDE - IoT Device Simulation & Server

## 📌 Overview
This project consists of X main components:
1. **Main serv (Node.js-based)**
2. **IoT Device Simulation (Python-based)**
3. **IoT Server (Node.js-based)**

Each component requires specific dependencies to be installed before running.

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
2. Install the required dependencies:
   ```sh
   npm install axios express
   ```

### **Running the IoT Server**
After installing the dependencies, start the Express.js server:
```sh
node server.js
```

**Note:** Make sure you are in the `iot-device` folder before running the command.

---