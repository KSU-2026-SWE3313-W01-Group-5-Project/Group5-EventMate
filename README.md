# EventMate - Project Setup Guide
What we are using to build this app:  
Frontend: React (Vite)  
Backend: Node.js + Express  
Database: PostgreSQL  
API: Rest + Axios  
Auth: JWT + bcrypt (hashing passwords)  

**DISCLAIMER**: the file layout of the project might look really complicated at the beginning, but I will explain what each file/module/part does in detail to anyone that wants to hear about it. I am aiming to have this project be very organized from the start so we can minimize junk code as much as possible. I promise it is not as complicated as it may look.  

I am going through the process of adding comments to every file/piece of code I have written so far to explain how everything works, atleast at a basic level

## Getting Started
### 1. Clone the Repo (we should have gotten everyone setup with this, but just in case)  
```
git clone <repo-url> (url is accessed by clicking the green Code button and copying the SSH url) 
cd EventMate
```

### 2. Install dependencies (one of the most important steps)
**Frontend**
```
cd client
npm install
```
**Backend**
```
cd ../server
npm install
```

### 3. Running the project (open two terminals, one for backend, one for frontend)
**Starting the backend**
```
cd server
npm run dev
```
Runs on (open in a web browser, api endpoints can be added to the end to see different tables): 
> http://localhost:3000  
> API Example: http://localhost:3000/api/events

**Staring the frontend**
```
cd client
npm run dev
```
Runs on (also in a web browser):
> http://localhost:5173

### 4. Setting up Environment Variables
I think this section will be best to go over in a call to be honest, it's not very complicated but there are some details that are important

### 5. Setting up the database
This one is also a good section go over in call, the software you use will change depending on Windows/Mac, so...

---

Eventually it might be cool to add a to-do list at the bottom of this readme, but we can also use the kanban i created in our github org, whatever works