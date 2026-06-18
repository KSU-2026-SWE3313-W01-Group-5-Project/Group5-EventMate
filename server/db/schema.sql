-- Basic sql that defines the database structure for each table in our app
-- Each table should be 'dropped' or deleted if it already exists on server startup to get rid of conflicts

DROP TABLE IF EXISTS events;

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP
);