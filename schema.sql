-- Migration for existing DB: ALTER TABLE items ADD COLUMN deleteToken TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'sell',
  price REAL NOT NULL DEFAULT 0,
  description TEXT,
  contact TEXT,
  images TEXT DEFAULT '[]',
  metro TEXT DEFAULT '',
  address TEXT DEFAULT '',
  deleteToken TEXT DEFAULT '',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
