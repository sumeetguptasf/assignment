-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- NOT Required with defaultFn: 'uuidv4'

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('SuperAdmin', 'Admin', 'Subscriber');
  END IF;
END$$;

CREATE TABLE "users" (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    middlename VARCHAR(255),
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role user_role NOT NULL DEFAULT 'Subscriber',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create "usercredentials" table
CREATE TABLE "usercredentials" (
  "id" UUID NOT NULL,
  "userid" UUID NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_usercredentials_userid"
    FOREIGN KEY ("userid") REFERENCES "users"("id")
    ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();