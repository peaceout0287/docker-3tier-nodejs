
This is a simple project using **Docker containers** with **Node.js** and **MySQL**.

## **Steps to Set Up and Run the Project**  

### **1. Clone the Repository**  
Run the following command to clone the project to your local machine:  
```sh
git clone <project-name.git>
```

### **2. Navigate to the Project Directory**  
```sh
cd <project-name>
```

### **3. Build and Start the Containers**  
Use Docker Compose to build and run the project in detached mode:  
```sh
docker-compose up --build -d
```

### **4. Verify Container Logs**  
Check the logs to ensure the containers are running properly:  
```sh
docker-compose logs app
docker-compose logs mysql
```
(*Note: Ensure `docker` and `docker-compose` are installed on your system.*)

### **5. Test in a Web Browser**  
Once the containers are running, open the following URL in your browser to test the application:  
[http://localhost:80/users/](http://localhost:80/users/)

