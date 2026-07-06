# EventMate 
## Backend Scripts & Utilities

This section documents all custom backend scripts and utilities built to manage, seed, and maintain the database and server environment.

### Available Scripts

#### `npm run dev`
Starts the backend server in development mode using nodemon.

- Watches for file changes
- Automatically restarts server
- Runs on: http://localhost:3000

#### `npm run resetDb`
Resets the database by dropping and recreating all tables.

- Clears all existing data and reruns the schema
- Mainly used when changes to the schema are made

#### `npm run runSeed`
Seeds the database with initial test data.

#### `npm run truncateDb`
Clears all data from the database but does not delete or reset tables

#### `npm run runSchema`
Runs the schema on its own. 

- Used for initial database creation on a fresh clone.  

---
## Recent Updates / Commit Log

This section is used to document recent changes to the project in a structured format.

---

### Commit Title: Added a bunch of comments to every frontend component so far
**Date:** 2026-07-06

#### What changed:
- Added informative comments to all frontend components
- Improved consistency of explanations across UI components, modals, pages, and context files

#### Why this change was made:
- To improve code readability and help group mates understand every part of the frontend system
- To improve the quality of the frontend codebase and get some practice with regular commenting of files

#### Files changed:
- All major frontend components (Navbar, Modals, Settings pages, Auth components, etc.)
- Context and service files where relevant

#### Notes / Side Effects:
- No functional changes were made.