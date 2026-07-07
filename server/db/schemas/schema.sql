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
)

/*
-- User Tables End --
*/