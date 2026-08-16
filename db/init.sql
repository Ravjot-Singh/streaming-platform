CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS channels (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_name VARCHAR(50) UNIQUE NOT NULL,
    stream_key   VARCHAR(64) UNIQUE NOT NULL,
    title        VARCHAR(255),
    description  TEXT,
    avatar_url   TEXT,
    is_live      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stream_sessions (
    id          SERIAL PRIMARY KEY,
    channel_id  INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at    TIMESTAMPTZ
);