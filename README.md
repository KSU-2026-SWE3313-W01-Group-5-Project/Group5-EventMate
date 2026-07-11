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

#### `npm run runSchema`
Runs the schema on its own.

- Used for initial database creation on a fresh clone.

### When running both scripts below, leave the {} out of the command:
#### `npm run truncateDb -- --table={table}`
Clears all data from the database but does not delete or reset tables
You can now truncate by table if you do not want to clear all data from the entire database.
Alternatively, you can also run 'npm run truncateDb -- --all' to truncate the full database.

#### `npm run syncEvents -- --mode={mode}`
This command pulls events and fills the database from the external api (ticketmaster). The specific modes are as follows:
- music (syncs 200 events from each individual subcategory from the music general category from ticketmaster)
- sports (same as above but for sports categories)
- arts (same as above but for arts & theatre categories)
- quick (syncs just 200 events from each general category (200 music type, 200 sports type, 200 arts type))
- full (syncs 200 events from each subcategory)