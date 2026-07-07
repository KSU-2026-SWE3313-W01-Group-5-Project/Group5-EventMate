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

This section is used to document recent changes to the project in a structured format and so everyone can find the changes in one place.

---

<summary><b>2026-07-07: Backend functionality added for event preferences & minor refactoring of frontend API files</b></summary>

#### What changed:
- Added in the full functionality for the user event preferences settings page so user's can actually save their filter now
- Added in a new table to the database called user_preferences that is a reference to the users table
- Installed a new package called Sharp that the backend now uses to resize user's uploaded images to be 512x512 squares


- Moved all user API functions to the user services file
- Reduced redundancy within the API functions by creating a pattern  API 'object'

---

<details>
<summary><b>2026-07-06: Added a bunch of comments to every frontend component so far</b></summary>

#### What changed:
- Added informative comments to all frontend components
- Improved consistency of explanations across UI components, modals, pages, and context files
</details>