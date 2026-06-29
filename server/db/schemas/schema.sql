/*
-- Event Tables Start --
*/

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP
);

/*
-- Event Tables End --
*/

/*
-- User Tables Start --
*/

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

/*
-- User Tables End --
*/