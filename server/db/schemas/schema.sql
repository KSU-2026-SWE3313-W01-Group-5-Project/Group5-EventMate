/*
-- User Tables Start --
*/

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    public_id UUID DEFAULT gen_random_uuid() UNIQUE,

    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,

    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    profile_picture_url TEXT DEFAULT 'default-profile.png',
    bio VARCHAR(150),
    interests TEXT[] DEFAULT '{}',
    city TEXT,
    state TEXT,

    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY,

    auto_filter_enabled BOOLEAN DEFAULT FALSE,

    event_types TEXT[] DEFAULT '{}',
    music_categories TEXT[] DEFAULT '{}',
    sports_categories TEXT[] DEFAULT '{}',
    arts_categories TEXT[] DEFAULT '{}',

    max_distance INT,
    city_filter TEXT,
    state_filter TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/*
-- User Tables End --
*/

/*
-- EventDetails.jsx Tables Start --
*/

CREATE TABLE venues (
    id TEXT PRIMARY KEY,
    name TEXT,

    city TEXT,
    state TEXT,
    country TEXT,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

CREATE TABLE events (
    id TEXT PRIMARY KEY,
    canonical_key TEXT,

    name TEXT NOT NULL,
    description TEXT NOT NULL,

    timezone TEXT,
    status TEXT,

    image_url TEXT,

    venue_id TEXT,

    segment TEXT,
    genre TEXT,
    subgenre TEXT,

    occurrences TIMESTAMPTZ[] NOT NULL DEFAULT '{}',

    last_seen_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (venue_id) REFERENCES venues(id)
);

CREATE TABLE event_registrations (
    user_id INT NOT NULL,
    event_id TEXT NOT NULL,

    PRIMARY KEY (user_id, event_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

/*
-- EventDetails.jsx Tables End --
*/

/*
-- Connections Tables Start --
*/

CREATE TABLE connections (
    id SERIAL PRIMARY KEY,

    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,

    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    connection_id INT NOT NULL,

    sender_id INT NOT NULL,
    content TEXT NOT NULL,

    sent_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (connection_id) REFERENCES connections(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

/*
-- Connections Tables End --
*/

/*
-- Extra Tables Start --
*/

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,

    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id)
);

/*
-- Extra Tables End --
*/