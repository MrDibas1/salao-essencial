-- Cloudflare D1 Schema para Salão Essencial

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  birthDate TEXT,
  email TEXT,
  instagram TEXT,
  notes TEXT,
  avatarUrl TEXT,
  status TEXT DEFAULT 'active',
  isDemo INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_clients_updatedAt ON clients (updatedAt DESC);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  clientId TEXT NOT NULL,
  clientName TEXT NOT NULL,
  date TEXT NOT NULL,
  professional TEXT NOT NULL,
  procedureType TEXT NOT NULL,
  customProcedureName TEXT,
  description TEXT NOT NULL,
  generalNotes TEXT,
  hasColorInfo INTEGER DEFAULT 0,
  colorFormula TEXT,
  photoUrls TEXT,
  isDemo INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appointments_clientId ON appointments (clientId);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (date DESC);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  line TEXT,
  category TEXT NOT NULL,
  shadeNumber TEXT,
  unit TEXT NOT NULL,
  notes TEXT,
  imageUrl TEXT,
  isDemo INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
