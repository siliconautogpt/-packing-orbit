const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

// Database file path in database/ folder
const dbPath = path.join(__dirname, 'packing_orbit.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode
db.exec('PRAGMA journal_mode = WAL;');

// Initialize core tables
db.exec(`
  -- System & Firm Settings Table
  CREATE TABLE IF NOT EXISTS firm_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Malegaon Powerloom Business Master Records
  CREATE TABLE IF NOT EXISTS system_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    version TEXT NOT NULL,
    industry TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Dynamic Navigation Menus Table
  CREATE TABLE IF NOT EXISTS nav_menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1
  );

  -- Users Master Table
  -- Admins: Capacity 1 to 5
  -- Employees (Packing/Baling Labour): Capacity max 3 active
  -- Customers (Malegaon Grey Cloth Weavers): Unlimited
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'employee', 'customer')) NOT NULL,
    password_hash TEXT NOT NULL,
    party_name TEXT DEFAULT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Dynamic Auth Sessions Store
  CREATE TABLE IF NOT EXISTS auth_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Login Activity Logs (IST Timestamps for audit & Admin view)
  CREATE TABLE IF NOT EXISTS login_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    identifier TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    login_time_ist TEXT NOT NULL,
    ip_address TEXT DEFAULT '127.0.0.1',
    user_agent TEXT,
    firm_id INTEGER DEFAULT NULL,
    firm_name TEXT DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Multi-Firm Licensing Table (Owner / Testing / Lifetime Purchased)
  -- brand_name is ALWAYS forced from system_info.app_name and is non-editable.
  CREATE TABLE IF NOT EXISTS firms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firm_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT DEFAULT NULL,
    address TEXT DEFAULT NULL,
    city TEXT DEFAULT 'Malegaon',
    gstin TEXT DEFAULT NULL,
    license_type TEXT CHECK(license_type IN ('owner', 'testing', 'lifetime')) NOT NULL,
    license_key TEXT UNIQUE NOT NULL,
    brand_name TEXT NOT NULL,
    brand_locked INTEGER NOT NULL DEFAULT 1,
    license_fee INTEGER NOT NULL DEFAULT 0,
    amc_fee INTEGER NOT NULL DEFAULT 0,
    amc_due_date TEXT DEFAULT NULL,
    status TEXT CHECK(status IN ('active', 'suspended', 'expired')) NOT NULL DEFAULT 'active',
    notes TEXT DEFAULT NULL,
    created_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Ledger entries (Ledger > Create) — admin-created, firm-scoped
  CREATE TABLE IF NOT EXISTS ledger_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firm_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    mobile TEXT NOT NULL,
    party_name TEXT NOT NULL,
    customer_code TEXT NOT NULL,
    token TEXT NOT NULL,
    type TEXT CHECK(type IN ('Cotton', 'Roti', 'PC')) NOT NULL,
    quality TEXT NOT NULL,
    takha_bales INTEGER NOT NULL,
    created_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(firm_id) REFERENCES firms(id) ON DELETE CASCADE,
    FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Records that live UNDER a ledger entry (block delete, follow edits)
  CREATE TABLE IF NOT EXISTS ledger_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firm_id INTEGER NOT NULL,
    ledger_id INTEGER NOT NULL,
    note TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ledger_id) REFERENCES ledger_entries(id) ON DELETE CASCADE,
    FOREIGN KEY(firm_id) REFERENCES firms(id) ON DELETE CASCADE
  );

  -- Transports for Outward dispatch (firm-scoped, admin-managed)
  CREATE TABLE IF NOT EXISTS transports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firm_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    vehicle_no TEXT DEFAULT NULL,
    gstin TEXT DEFAULT NULL,
    address TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(firm_id) REFERENCES firms(id) ON DELETE CASCADE,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Inward entries (one inward = 1 bale, max 30 at a time)
  CREATE TABLE IF NOT EXISTS inward_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firm_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    customer_code TEXT NOT NULL,
    token TEXT NOT NULL,
    type TEXT NOT NULL,
    quality TEXT NOT NULL,
    bale_numbers INTEGER NOT NULL CHECK(bale_numbers BETWEEN 1 AND 30),
    inward_no TEXT DEFAULT NULL,
    inward_at TEXT DEFAULT NULL,
    takha_per_bale INTEGER DEFAULT NULL,
    total_takha INTEGER DEFAULT NULL,
    created_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(firm_id) REFERENCES firms(id) ON DELETE CASCADE,
    FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Each inward bale stored separately (number or alphanumeric) for easy retrieve
  CREATE TABLE IF NOT EXISTS inward_bales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inward_id INTEGER NOT NULL,
    firm_id INTEGER NOT NULL,
    bale_number TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(inward_id) REFERENCES inward_entries(id) ON DELETE CASCADE,
    FOREIGN KEY(firm_id) REFERENCES firms(id) ON DELETE CASCADE
  );
`);

// Lightweight migration: older databases may not have the firm columns yet
function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn('login_logs', 'firm_id', 'INTEGER DEFAULT NULL');
ensureColumn('login_logs', 'firm_name', 'TEXT DEFAULT NULL');

// Customer accounts are linked to their licensed firm (banking-style admin registration)
ensureColumn('users', 'firm_id', 'INTEGER DEFAULT NULL');

ensureColumn('inward_entries', 'inward_no', 'TEXT DEFAULT NULL');
ensureColumn('inward_entries', 'inward_at', 'TEXT DEFAULT NULL');
ensureColumn('inward_entries', 'takha_per_bale', 'INTEGER DEFAULT NULL');
ensureColumn('inward_entries', 'total_takha', 'INTEGER DEFAULT NULL');


// Seed default firm metadata if not already seeded
const checkInfo = db.prepare('SELECT COUNT(*) as count FROM system_info').get();
if (checkInfo.count === 0) {
  const insert = db.prepare(`
    INSERT INTO system_info (app_name, tagline, version, industry)
    VALUES (?, ?, ?, ?)
  `);
  insert.run(
    'Packing Orbit',
    'a packing automation',
    'v0.4.0',
    'Malegaon Powerloom Textile Industry'
  );
}

// Seed default Menu
const checkMenu = db.prepare('SELECT COUNT(*) as count FROM nav_menus').get();
if (checkMenu.count === 0) {
  const insertMenu = db.prepare(`
    INSERT INTO nav_menus (key_name, label, icon, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  insertMenu.run('dashboard', 'Dashboard', 'layout-dashboard', 1);
}

module.exports = db;
