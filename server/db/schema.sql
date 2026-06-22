-- Basic sql that defines the database structure for each table in our app
-- Each table should be 'dropped' or deleted if it already exists on server startup to get rid of conflicts

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,

    created_at TIMESTAMP DEFAULT NOW()
)