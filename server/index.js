const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const db = require('../database/db');

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '..', 'client');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function getISTTimestamp() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().replace('T', ' ').substring(0, 19) + ' IST';
}

// License keys are generated ONLY on the server (never trusted from the client)
function generateLicenseKey() {
  const part = () => crypto.randomBytes(2).toString('hex').toUpperCase();
  let key;
  do {
    key = `PO-${part()}-${part()}-${part()}`;
  } while (db.prepare('SELECT 1 FROM firms WHERE license_key = ?').get(key));
  return key;
}

function getOriginalBrandName() {
  const info = db.prepare('SELECT app_name FROM system_info ORDER BY id DESC LIMIT 1').get();
  return (info && info.app_name) ? info.app_name : 'Packing Orbit';
}

// Inward numbers are generated ONLY on the server (unique per inward entry)
// Format: IN-DDMMYYYY-0001 (serial restarts at 0001 each day)
function generateInwardNo() {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const dd = String(ist.getUTCDate()).padStart(2, '0');
  const mm = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = ist.getUTCFullYear();
  const prefix = `IN-${dd}${mm}${yyyy}-`;

  const existing = db.prepare('SELECT inward_no FROM inward_entries WHERE inward_no LIKE ?').all(prefix + '%');
  let maxSerial = 0;
  existing.forEach((row) => {
    const tail = String(row.inward_no).split('-').pop();
    if (!/^\d+$/.test(tail)) return;
    const n = parseInt(tail, 10);
    if (n > maxSerial) maxSerial = n;
  });

  return prefix + String(maxSerial + 1).padStart(4, '0');
}

// Inward date/time display — DDMMYYYY hh:mm:ss AM/PM (IST)
function getISTInwardDateTime() {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const dd = String(ist.getUTCDate()).padStart(2, '0');
  const mm = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = ist.getUTCFullYear();
  let h = ist.getUTCHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const hh = String(h).padStart(2, '0');
  const mi = String(ist.getUTCMinutes()).padStart(2, '0');
  const ss = String(ist.getUTCSeconds()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss} ${ampm}`;
}

// Financial context — Indian FY (April-March) + Monday-Saturday week
function getFinancialContext() {
  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const startYear = m >= 4 ? y : y - 1;
  const fmt = (d) => `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`;

  const day = now.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() + mondayOffset);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 5);

  // 3-4 special weeks per year can extend the Saturday end by 3-5 days
  const extensions = []; // e.g. [{ date: '28-11-2026', extraDays: 3 }]
  const ext = extensions.find((item) => item.date === fmt(end));
  if (ext) end.setUTCDate(end.getUTCDate() + ext.extraDays);

  const years = [];
  for (let i = -2; i <= 2; i++) {
    years.push(`${startYear + i}-${startYear + i + 1}`);
  }

  return {
    financialYear: `${startYear}-${startYear + 1}`,
    financialYears: years,
    fyStart: `01-04-${startYear}`,
    fyEnd: `31-03-${startYear + 1}`,
    weekStart: fmt(start),
    weekEnd: fmt(end),
    extensionDays: ext ? ext.extraDays : 0
  };
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function getAuthUser(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace('Bearer ', '').trim() : null;
  if (!token) return null;

  return db.prepare(`
    SELECT u.id, u.identifier, u.full_name, u.role, u.party_name, u.is_active, s.token
    FROM auth_sessions s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
  `).get(token);
}

// Router & Server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API: Financial context (FY + Week) ---
  if (pathname === '/api/financial/context' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: getFinancialContext() }));
    return;
  }

  // --- API: System Info ---
  if (pathname === '/api/info' && req.method === 'GET') {
    try {
      const info = db.prepare('SELECT * FROM system_info ORDER BY id DESC LIMIT 1').get();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: info }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Navigation Menus ---
  if (pathname === '/api/menus' && req.method === 'GET') {
    try {
      const menus = db.prepare('SELECT * FROM nav_menus WHERE is_active = 1 ORDER BY sort_order ASC').all();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: menus }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: PUBLIC - Active Firms (for Login Firm Selection) ---
  if (pathname === '/api/firms/active' && req.method === 'GET') {
    try {
      const firms = db.prepare(`
        SELECT id, firm_name, license_type
        FROM firms
        WHERE status = 'active'
        ORDER BY firm_name ASC
      `).all();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: firms }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: Unified Login (Option A) ---
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { identifier, password, firmId, financialYear, weekStart, weekEnd } = await parseJsonBody(req);

      if (!identifier || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Mobile Number ya Username aur Password enter kijiye.' }));
        return;
      }

      const user = db.prepare('SELECT * FROM users WHERE identifier = ?').get(identifier.trim());

      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Yeh user register nahi hai.' }));
        return;
      }

      if (user.is_active !== 1) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Yeh account Admin ne deactivate / remove kar diya hai.' }));
        return;
      }

      if (user.password_hash !== password.trim()) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Galat Password ya PIN! Kripya check karein.' }));
        return;
      }

      // --- Paid-testing firm selection (required whenever active firms exist) ---
      const activeFirmCount = db.prepare("SELECT COUNT(*) as count FROM firms WHERE status = 'active'").get().count;
      let selectedFirm = null;

      if (activeFirmCount > 0) {
        const firmIdNum = parseInt(firmId, 10);
        if (!firmIdNum) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Kripya pehle firm select karein.' }));
          return;
        }

        selectedFirm = db.prepare(`
          SELECT id, firm_name, license_type
          FROM firms
          WHERE id = ? AND status = 'active'
        `).get(firmIdNum);

        if (!selectedFirm) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Selected firm active nahi hai ya uski license suspend/expired hai.' }));
          return;
        }
      }

      // Customers are firm-bound — a customer cannot log in under another firm
      if (user.role === 'customer' && user.firm_id && selectedFirm && user.firm_id !== selectedFirm.id) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Yeh customer doosri firm se linked hai. Apni firm select karein.' }));
        return;
      }

      const istTime = getISTTimestamp();
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Browser';

      db.prepare(`
        INSERT INTO login_logs
          (user_id, identifier, full_name, role, login_time_ist, ip_address, user_agent, firm_id, firm_name,
           financial_year, week_start, week_end)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, user.identifier, user.full_name, user.role, istTime, ip, userAgent,
        selectedFirm ? selectedFirm.id : null,
        selectedFirm ? selectedFirm.firm_name : null,
        financialYear || null, weekStart || null, weekEnd || null
      );

      const token = crypto.randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO auth_sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
        .run(user.id, token, expiresAt);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Login kamyab!',
        token,
        loginTimeIST: istTime,
        user: {
          id: user.id,
          identifier: user.identifier,
          fullName: user.full_name,
          role: user.role,
          partyName: user.party_name,
          loginTimeIST: istTime,
          firmId: selectedFirm ? selectedFirm.id : null,
          firmName: selectedFirm ? selectedFirm.firm_name : null,
          licenseType: selectedFirm ? selectedFirm.license_type : null
        }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: Get Authenticated User Profile ---
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ authenticated: false }));
        return;
      }

      const lastLog = db.prepare(`
        SELECT login_time_ist, firm_id, firm_name FROM login_logs 
        WHERE user_id = ? 
        ORDER BY id DESC LIMIT 1
      `).get(authUser.id);

      let firmName = null;
      let licenseType = null;
      if (lastLog && lastLog.firm_id) {
        const firm = db.prepare(`
          SELECT firm_name, license_type FROM firms 
          WHERE id = ? AND status = 'active'
        `).get(lastLog.firm_id);
        if (firm) {
          firmName = firm.firm_name;
          licenseType = firm.license_type;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        authenticated: true,
        user: {
          id: authUser.id,
          identifier: authUser.identifier,
          fullName: authUser.full_name,
          role: authUser.role,
          partyName: authUser.party_name,
          loginTimeIST: lastLog ? lastLog.login_time_ist : 'Recently logged in',
          firmId: lastLog ? lastLog.firm_id : null,
          firmName: firmName,
          licenseType: licenseType
        }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ authenticated: false, error: err.message }));
    }
    return;
  }

  // --- API: Logout ---
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader ? authHeader.replace('Bearer ', '').trim() : null;
      if (token) {
        db.prepare('DELETE FROM auth_sessions WHERE token = ?').run(token);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - View Login Audit Logs ---
  if (pathname === '/api/admin/login-logs' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can view login audit logs.' }));
        return;
      }

      const logs = db.prepare('SELECT * FROM login_logs ORDER BY id DESC LIMIT 50').all();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: logs }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Manage Employees (Packing Labours - Capacity: 3) ---
  if (pathname === '/api/admin/employees' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }

      const employees = db.prepare('SELECT id, identifier, full_name, role, is_active, created_at FROM users WHERE role = ? ORDER BY is_active DESC, id ASC').all('employee');
      const activeCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ? AND is_active = 1').get('employee').count;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: employees, activeCount, maxCapacity: 3 }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Add New Labour ---
  if (pathname === '/api/admin/employees/add' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }

      const { mobileNumber, fullName, pin } = await parseJsonBody(req);
      if (!mobileNumber || !fullName || !pin) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Mobile number, labour ka naam aur PIN zaroori hain.' }));
        return;
      }

      const activeCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ? AND is_active = 1').get('employee').count;
      if (activeCount >= 3) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false, 
          message: 'Labour limit full hai (Maximum 3 active labours). Kisi purane labour ko "Remove / Left" karke slot khali karein.' 
        }));
        return;
      }

      const insert = db.prepare('INSERT INTO users (identifier, full_name, role, password_hash, is_active) VALUES (?, ?, ?, ?, ?)');
      insert.run(mobileNumber.trim(), fullName.trim(), 'employee', pin.trim(), 1);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Naya packing labour kamyabi se add ho gaya!' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message.includes('UNIQUE') ? 'Yeh mobile number already registered hai.' : err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Toggle Labour Status ---
  if (pathname === '/api/admin/employees/toggle-status' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }

      const { employeeId, newStatus } = await parseJsonBody(req);
      
      if (newStatus === 1) {
        const activeCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ? AND is_active = 1').get('employee').count;
        if (activeCount >= 3) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Maximum 3 active packing labours allowed.' }));
          return;
        }
      }

      db.prepare('UPDATE users SET is_active = ? WHERE id = ? AND role = ?').run(newStatus, employeeId, 'employee');
      if (newStatus === 0) {
        db.prepare('DELETE FROM auth_sessions WHERE user_id = ?').run(employeeId);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: newStatus === 1 ? 'Labour reactivate ho gaya!' : 'Labour remove/deactivate ho gaya (Job chhod di).' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Register Firm Customer (banking-style, PIN auto-generated) ---
  if (pathname === '/api/admin/customers/register' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can register customers.' }));
        return;
      }

      const { mobileNumber, partyName, firmId } = await parseJsonBody(req);
      const mobile = String(mobileNumber || '').trim();
      if (!/^\d{10}$/.test(mobile)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Valid 10-digit customer mobile number zaroori hai.' }));
        return;
      }

      const firm = db.prepare("SELECT id, firm_name FROM firms WHERE id = ? AND status = 'active'").get(parseInt(firmId, 10));
      if (!firm) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Active licensed firm nahi mila.' }));
        return;
      }

      // PIN is generated by the system and saved in DB; admin can view/share it later
      const pin = String(crypto.randomInt(100000, 1000000));
      const label = String(partyName || '').trim() || mobile;

      db.prepare(`
        INSERT INTO users (identifier, full_name, role, password_hash, party_name, is_active, firm_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(mobile, label, 'customer', pin, label, 1, firm.id);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Customer ${mobile} registered for ${firm.firm_name}. PIN: ${pin}`,
        pin,
        firmName: firm.firm_name
      }));
    } catch (err) {
      const isDuplicate = err.message.includes('UNIQUE');
      res.writeHead(isDuplicate ? 400 : 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: isDuplicate ? 'Yeh mobile number already registered hai.' : err.message
      }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Firm Customers list (PIN visible to admin) ---
  if (pathname === '/api/admin/customers' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can view customers.' }));
        return;
      }

      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      let sql = `
        SELECT u.id, u.identifier, u.full_name, u.party_name, u.password_hash AS pin,
               u.is_active, u.firm_id, u.created_at, f.firm_name
        FROM users u
        LEFT JOIN firms f ON u.firm_id = f.id
        WHERE u.role = 'customer'
      `;
      const params = [];
      if (firmId) {
        sql += ' AND u.firm_id = ?';
        params.push(firmId);
      }
      sql += ' ORDER BY u.id DESC LIMIT 200';

      const customers = db.prepare(sql).all(...params);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: customers }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Ledger Create (firm-scoped) ---
  if (pathname === '/api/admin/ledger' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can create ledger entries.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const customerId = parseInt(body.customerId, 10);
      const customerCode = String(body.customerCode || '').trim();
      const token = String(body.token || '').trim();
      const type = String(body.type || '').trim();
      const quality = String(body.quality || '').trim();
      const takhaBales = parseInt(body.takhaBales, 10);
      const firmId = parseInt(body.firmId, 10);

      if (!customerId || !customerCode || !token || !quality || !takhaBales || takhaBales < 1) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Saari required fields (Customer, Code, Token, Type, Quality, Takha/Bales) bharin.' }));
        return;
      }
      if (!['Cotton', 'Roti', 'PC'].includes(type)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Type sirf Cotton, Roti ya PC ho sakta hai.' }));
        return;
      }

      const firm = db.prepare("SELECT id, firm_name FROM firms WHERE id = ? AND status = 'active'").get(firmId);
      if (!firm) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Active licensed firm nahi mila.' }));
        return;
      }

      const customer = db.prepare(`
        SELECT id, identifier, full_name, party_name FROM users
        WHERE id = ? AND role = 'customer' AND firm_id = ? AND is_active = 1
      `).get(customerId, firmId);
      if (!customer) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Customer is firm se linked nahi hai ya inactive hai.' }));
        return;
      }

      const result = db.prepare(`
        INSERT INTO ledger_entries
          (firm_id, customer_id, mobile, party_name, customer_code, token, type, quality, takha_bales, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        firmId, customer.id, customer.identifier,
        customer.party_name || customer.full_name,
        customerCode, token, type, quality, takhaBales, authUser.id
      );

      const entry = db.prepare('SELECT * FROM ledger_entries WHERE id = ?').get(result.lastInsertRowid);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Ledger entry create ho gayi!',
        data: entry
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Ledger list (firm-scoped) ---
  if (pathname === '/api/admin/ledger' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can view ledger entries.' }));
        return;
      }

      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      let sql = `
        SELECT l.*,
               (SELECT COUNT(*) FROM ledger_records r WHERE r.ledger_id = l.id) AS record_count
        FROM ledger_entries l
      `;
      const params = [];
      if (firmId) {
        sql += ' WHERE l.firm_id = ?';
        params.push(firmId);
      }
      sql += ' ORDER BY l.id DESC LIMIT 300';

      const entries = db.prepare(sql).all(...params);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: entries }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Ledger update (Edit / Alter) ---
  if (pathname === '/api/admin/ledger/update' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can edit ledger entries.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const id = parseInt(body.id, 10);
      const firmId = parseInt(body.firmId, 10);
      const customerId = parseInt(body.customerId, 10);
      const customerCode = String(body.customerCode || '').trim();
      const token = String(body.token || '').trim();
      const type = String(body.type || '').trim();
      const quality = String(body.quality || '').trim();
      const takhaBales = parseInt(body.takhaBales, 10);

      if (!id || !customerId || !customerCode || !token || !quality || !takhaBales || takhaBales < 1) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Saari required fields bharin.' }));
        return;
      }
      if (!['Cotton', 'Roti', 'PC'].includes(type)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Type sirf Cotton, Roti ya PC ho sakta hai.' }));
        return;
      }

      const entry = db.prepare('SELECT * FROM ledger_entries WHERE id = ? AND firm_id = ?').get(id, firmId);
      if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ledger entry nahi mila.' }));
        return;
      }

      const customer = db.prepare(`
        SELECT id, identifier, full_name, party_name FROM users
        WHERE id = ? AND role = 'customer' AND firm_id = ? AND is_active = 1
      `).get(customerId, firmId);
      if (!customer) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Customer is firm se linked nahi hai.' }));
        return;
      }

      db.prepare(`
        UPDATE ledger_entries
        SET customer_id = ?, mobile = ?, party_name = ?, customer_code = ?,
            token = ?, type = ?, quality = ?, takha_bales = ?, created_by = ?
        WHERE id = ? AND firm_id = ?
      `).run(
        customer.id, customer.identifier, customer.party_name || customer.full_name,
        customerCode, token, type, quality, takhaBales, authUser.id, id, firmId
      );

      // Records under this ledger stay linked to the SAME ledger after edit/alter
      const linkedRecords = db.prepare('SELECT COUNT(*) as count FROM ledger_records WHERE ledger_id = ?').get(id).count;
      if (linkedRecords > 0) {
        db.prepare('UPDATE ledger_records SET firm_id = ? WHERE ledger_id = ?').run(firmId, id);
      }

      const updated = db.prepare(`
        SELECT l.*, (SELECT COUNT(*) FROM ledger_records r WHERE r.ledger_id = l.id) AS record_count
        FROM ledger_entries l WHERE l.id = ?
      `).get(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: linkedRecords > 0
          ? `Ledger entry update ho gayi! Is ledger ke andar ${linkedRecords} records hain — sab isi updated ledger ke under hain.`
          : 'Ledger entry update ho gayi! Is ledger ke andar koi record nahi hai.',
        data: updated
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Ledger delete ---
  if (pathname === '/api/admin/ledger/delete' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can delete ledger entries.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const id = parseInt(body.id, 10);
      const firmId = parseInt(body.firmId, 10);
      if (!id || !firmId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Entry ID aur firm zaroori hai.' }));
        return;
      }

      // Pehle database search — agar is ledger ke andar records hain to delete nahi karein
      const recordCount = db.prepare('SELECT COUNT(*) as count FROM ledger_records WHERE ledger_id = ?').get(id).count;
      if (recordCount > 0) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: `Yeh ledger delete nahi ho sakta — iske andar ${recordCount} record(s) maujood hain. Pehle records hatayein.`
        }));
        return;
      }

      const result = db.prepare('DELETE FROM ledger_entries WHERE id = ? AND firm_id = ?').run(id, firmId);
      if (!result.changes) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ledger entry nahi mila ya doosri firm ka hai.' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Ledger entry delete ho gayi!' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Add a record under a ledger entry ---
  if (pathname === '/api/admin/ledger/records' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can add ledger records.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const ledgerId = parseInt(body.ledgerId, 10);
      const firmId = parseInt(body.firmId, 10);
      const note = String(body.note || '').trim();

      const entry = db.prepare('SELECT id, firm_id FROM ledger_entries WHERE id = ? AND firm_id = ?').get(ledgerId, firmId);
      if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ledger entry nahi mila.' }));
        return;
      }

      const result = db.prepare(`
        INSERT INTO ledger_records (firm_id, ledger_id, note) VALUES (?, ?, ?)
      `).run(firmId, ledgerId, note || null);

      const record = db.prepare('SELECT * FROM ledger_records WHERE id = ?').get(result.lastInsertRowid);
      const count = db.prepare('SELECT COUNT(*) as count FROM ledger_records WHERE ledger_id = ?').get(ledgerId).count;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Ledger ke under record add ho gaya. Ab is ledger mein ${count} record(s) hain.`,
        data: record
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - List records under a ledger ---
  if (pathname === '/api/admin/ledger/records' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can view ledger records.' }));
        return;
      }
      const ledgerId = parseInt(url.searchParams.get('ledgerId'), 10);
      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      const records = db.prepare(`
        SELECT id, note, created_at FROM ledger_records
        WHERE ledger_id = ? AND firm_id = ? ORDER BY id DESC
      `).all(ledgerId, firmId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: records }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Delete a ledger record ---
  if (pathname === '/api/admin/ledger/records/delete' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can delete ledger records.' }));
        return;
      }
      const body = await parseJsonBody(req);
      const id = parseInt(body.id, 10);
      const firmId = parseInt(body.firmId, 10);
      const result = db.prepare('DELETE FROM ledger_records WHERE id = ? AND firm_id = ?').run(id, firmId);
      if (!result.changes) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Record nahi mila.' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Record delete ho gaya!' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Transports list (firm-scoped, Outward) ---
  if (pathname === '/api/admin/transports' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can view transports.' }));
        return;
      }
      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      let sql = 'SELECT * FROM transports';
      const params = [];
      if (firmId) { sql += ' WHERE firm_id = ?'; params.push(firmId); }
      sql += ' ORDER BY id DESC LIMIT 200';
      const transports = db.prepare(sql).all(...params);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: transports }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Add transport (Outward) ---
  if (pathname === '/api/admin/transports/add' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can add transports.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const name = String(body.name || '').trim();
      const mobile = String(body.mobile || '').trim();
      const firmId = parseInt(body.firmId, 10);

      if (!name || !/^\d{10}$/.test(mobile)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Transport name aur 10-digit mobile zaroori hai.' }));
        return;
      }

      const firm = db.prepare("SELECT id, firm_name FROM firms WHERE id = ? AND status = 'active'").get(firmId);
      if (!firm) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Active licensed firm nahi mila.' }));
        return;
      }

      const result = db.prepare(`
        INSERT INTO transports (firm_id, name, mobile, vehicle_no, gstin, address, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        firmId, name, mobile,
        String(body.vehicleNo || '').trim() || null,
        String(body.gstin || '').trim() || null,
        String(body.address || '').trim() || null,
        authUser.id
      );

      const transport = db.prepare('SELECT * FROM transports WHERE id = ?').get(result.lastInsertRowid);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Transport "${name}" add ho gaya!`, data: transport }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: INWARD customers list (Admin + Employee, no PIN exposed) ---
  if (pathname === '/api/inward/customers' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || !['admin', 'employee'].includes(authUser.role)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }
      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      const customers = db.prepare(`
        SELECT id, identifier, party_name, full_name
        FROM users
        WHERE role = 'customer' AND is_active = 1 AND firm_id = ?
        ORDER BY id DESC LIMIT 200
      `).all(firmId);
      const data = customers.map((c) => ({
        id: c.id,
        mobile: c.identifier,
        partyName: c.party_name || c.full_name
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: INWARD options from Ledger Create data (Admin + Employee) ---
  if (pathname === '/api/inward/options' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || !['admin', 'employee'].includes(authUser.role)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }
      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      const customerId = parseInt(url.searchParams.get('customerId'), 10);
      const rows = db.prepare(`
        SELECT customer_code, token, type, quality, takha_bales
        FROM ledger_entries
        WHERE firm_id = ? AND customer_id = ?
        ORDER BY id DESC LIMIT 500
      `).all(firmId, customerId);

      const unique = (key) => [...new Set(rows.map((r) => r[key]).filter(Boolean))];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          rows,
          customerCodes: unique('customer_code'),
          tokens: unique('token'),
          types: unique('type'),
          qualities: unique('quality')
        }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: INWARD add (Admin + Employee), max 30 bales at a time ---
  if (pathname === '/api/inward/add' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || !['admin', 'employee'].includes(authUser.role)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const firmId = parseInt(body.firmId, 10);
      const customerId = parseInt(body.customerId, 10);
      const customerCode = String(body.customerCode || '').trim();
      const token = String(body.token || '').trim();
      const type = String(body.type || '').trim();
      const quality = String(body.quality || '').trim();
      const baleList = Array.isArray(body.baleNumbers)
        ? body.baleNumbers.map((v) => String(v).trim()).filter(Boolean)
        : [];

      if (!customerId || !customerCode || !token || !type || !quality) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Saari required fields bharin.' }));
        return;
      }
      if (baleList.length < 1 || baleList.length > 30) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Minimum 1 aur maximum 30 bale numbers daalein.' }));
        return;
      }
      if (baleList.some((b) => b.length > 12) || new Set(baleList).size !== baleList.length) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Bale numbers 12 characters se chhote aur unique hone chahiye.' }));
        return;
      }

      const customer = db.prepare(`
        SELECT id, identifier, party_name, full_name FROM users
        WHERE id = ? AND role = 'customer' AND firm_id = ? AND is_active = 1
      `).get(customerId, firmId);
      if (!customer) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Customer is firm se linked nahi hai.' }));
        return;
      }

      const inwardNo = generateInwardNo();
      const inwardAt = getISTInwardDateTime();

      // Ledger me quality-wise har bale ke takha record hain — unse total takha nikaltein hain
      const ledger = db.prepare(`
        SELECT takha_bales FROM ledger_entries
        WHERE firm_id = ? AND customer_id = ? AND customer_code = ?
          AND token = ? AND type = ? AND quality = ?
        ORDER BY id DESC LIMIT 1
      `).get(firmId, customer.id, customerCode, token, type, quality);
      const takhaPerBale = ledger ? ledger.takha_bales : 0;
      const totalTakha = takhaPerBale * baleList.length;

      const result = db.prepare(`
        INSERT INTO inward_entries
          (firm_id, customer_id, customer_code, token, type, quality, bale_numbers, inward_no, inward_at,
           takha_per_bale, total_takha, financial_year, week_start, week_end, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        firmId, customer.id, customerCode, token, type, quality, baleList.length,
        inwardNo, inwardAt, takhaPerBale, totalTakha,
        body.financialYear || null, body.weekStart || null, body.weekEnd || null,
        authUser.id
      );

      const inwardId = result.lastInsertRowid;
      const insertBale = db.prepare(`
        INSERT INTO inward_bales (inward_id, firm_id, bale_number) VALUES (?, ?, ?)
      `);
      baleList.forEach((b) => insertBale.run(inwardId, firmId, b));

      const entry = db.prepare('SELECT * FROM inward_entries WHERE id = ?').get(inwardId);
      const bales = db.prepare('SELECT bale_number FROM inward_bales WHERE inward_id = ? ORDER BY id ASC').all(inwardId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Inward ${inwardNo} save ho gaya — ${baleList.length} bale(s).`,
        data: { entry, bales: bales.map((b) => b.bale_number) }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: INWARD list with bale numbers (Admin + Employee) ---
  if (pathname === '/api/inward/list' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || !['admin', 'employee'].includes(authUser.role)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
        return;
      }
      const firmId = parseInt(url.searchParams.get('firmId'), 10);
      const entries = db.prepare(`
        SELECT i.*, u.identifier AS mobile, u.party_name
        FROM inward_entries i
        LEFT JOIN users u ON i.customer_id = u.id
        WHERE i.firm_id = ?
        ORDER BY i.id DESC LIMIT 200
      `).all(firmId);

      const baleStmt = db.prepare('SELECT bale_number FROM inward_bales WHERE inward_id = ? ORDER BY id ASC');
      const data = entries.map((e) => ({
        ...e,
        bales: baleStmt.all(e.id).map((b) => b.bale_number)
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Clear Test Customer Data (Post-Project Reset) ---
  if (pathname === '/api/admin/clear-test-customers' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can clear testing customer data.' }));
        return;
      }

      db.exec(`
        DELETE FROM auth_sessions WHERE user_id IN (SELECT id FROM users WHERE role = 'customer');
        DELETE FROM users WHERE role = 'customer';
      `);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Tamam testing customer login records clear ho gaye!' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Update firm customer (Edit / Alter) ---
  if (pathname === '/api/admin/customers/update' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can edit customers.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const id = parseInt(body.id, 10);
      const firmId = parseInt(body.firmId, 10);
      const mobile = String(body.mobileNumber || '').trim();
      const partyName = String(body.partyName || '').trim();
      const pin = String(body.pin || '').trim();

      if (!id || !firmId || !/^\d{10}$/.test(mobile) || !partyName) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Customer ID, 10-digit mobile aur party name zaroori hai.' }));
        return;
      }
      if (pin && !/^\d{4,6}$/.test(pin)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'PIN 4 se 6 digits ka hona chahiye.' }));
        return;
      }

      const customer = db.prepare(`
        SELECT id, identifier, full_name, party_name, password_hash FROM users
        WHERE id = ? AND role = 'customer' AND firm_id = ?
      `).get(id, firmId);
      if (!customer) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Customer is firm mein nahi mila.' }));
        return;
      }

      const duplicate = db.prepare('SELECT id FROM users WHERE identifier = ? AND id <> ?').get(mobile, id);
      if (duplicate) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Yeh mobile number doosre user se already registered hai.' }));
        return;
      }

      const newPin = pin || customer.password_hash;
      db.prepare(`
        UPDATE users
        SET identifier = ?, full_name = ?, party_name = ?, password_hash = ?
        WHERE id = ?
      `).run(mobile, partyName, partyName, newPin, id);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Customer "${partyName}" update ho gaya!`,
        data: { id, identifier: mobile, partyName, pin: newPin }
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - List Firms / Licenses ---
  if (pathname === '/api/admin/firms' && req.method === 'GET') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can view firm licenses.' }));
        return;
      }

      const firms = db.prepare('SELECT * FROM firms ORDER BY id DESC').all();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: firms,
        brand: getOriginalBrandName(),
        maxLifetime: null
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Create Firm / License ---
  if (pathname === '/api/admin/firms' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can create firm licenses.' }));
        return;
      }

      const body = await parseJsonBody(req);
      const firmName = String(body.firmName || '').trim();
      const ownerName = String(body.ownerName || '').trim();
      const mobile = String(body.mobile || '').replace(/[\s-]/g, '');
      const email = String(body.email || '').trim();
      const address = String(body.address || '').trim();
      const city = String(body.city || 'Malegaon').trim() || 'Malegaon';
      const gstin = String(body.gstin || '').trim().toUpperCase();
      const licenseType = String(body.licenseType || '').trim();
      const notes = String(body.notes || '').trim();
      const amcDueDate = String(body.amcDueDate || '').trim();

      // --- Protective server-side validation (never trust the browser) ---
      if (firmName.length < 2 || ownerName.length < 2) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Firm ka naam aur owner ka naam zaroori hai (minimum 2 characters).' }));
        return;
      }
      if (!/^[0-9]{10}$/.test(mobile)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Mobile number 10 digit ka hona chahiye.' }));
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Email format sahi nahi hai.' }));
        return;
      }
      if (!['owner', 'testing', 'lifetime'].includes(licenseType)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'License type valid nahi hai.' }));
        return;
      }
      if (amcDueDate && !/^\d{4}-\d{2}-\d{2}$/.test(amcDueDate)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'AMC due date YYYY-MM-DD format mein honi chahiye.' }));
        return;
      }

      const duplicate = db.prepare('SELECT id FROM firms WHERE mobile = ? AND status != ?').get(mobile, 'expired');
      if (duplicate) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Is mobile number par pehle se ek active firm license hai.' }));
        return;
      }

      // Owner & Testing firms are ALWAYS free. Only Lifetime can carry fees.
      const isFreeType = licenseType === 'owner' || licenseType === 'testing';
      const licenseFee = isFreeType ? 0 : Math.max(0, parseInt(body.licenseFee, 10) || 0);
      const amcFee = isFreeType ? 0 : Math.max(0, parseInt(body.amcFee, 10) || 0);

      // Brand name is permanently locked to the original system brand.
      const brandName = getOriginalBrandName();
      const licenseKey = generateLicenseKey();

      const insert = db.prepare(`
        INSERT INTO firms
          (firm_name, owner_name, mobile, email, address, city, gstin, license_type,
           license_key, brand_name, brand_locked, license_fee, amc_fee, amc_due_date,
           status, notes, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, 'active', ?, ?)
      `);
      insert.run(
        firmName, ownerName, mobile, email || null, address || null, city, gstin || null,
        licenseType, licenseKey, brandName, licenseFee, amcFee, amcDueDate || null,
        notes || null, authUser.id
      );

      const created = db.prepare('SELECT * FROM firms WHERE license_key = ?').get(licenseKey);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: isFreeType
          ? `${licenseType === 'owner' ? 'Owner' : 'Testing'} firm license free of charge create ho gaya!`
          : 'Lifetime firm license create ho gaya!',
        data: created
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message.includes('UNIQUE') ? 'License key duplicate ho gayi, dobara try karein.' : err.message }));
    }
    return;
  }

  // --- API: ADMIN ONLY - Toggle Firm License Status ---
  if (pathname === '/api/admin/firms/toggle-status' && req.method === 'POST') {
    try {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Admins can change license status.' }));
        return;
      }

      const { firmId, newStatus } = await parseJsonBody(req);
      if (!['active', 'suspended'].includes(newStatus)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid license status.' }));
        return;
      }

      const firm = db.prepare('SELECT id, license_type FROM firms WHERE id = ?').get(firmId);
      if (!firm) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Firm license nahi mila.' }));
        return;
      }

      db.prepare('UPDATE firms SET status = ? WHERE id = ?').run(newStatus, firmId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: newStatus === 'active' ? 'Firm license activate ho gaya.' : 'Firm license suspend ho gaya.'
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // --- STATIC FILES (client/) ---
  let filePath = path.join(CLIENT_DIR, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(CLIENT_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Server Internal Error');
        return;
      }
      // Always revalidate so UI fixes show up without stale browser cache
      const isHtml = ext === '.html' || path.extname(filePath) === '';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': isHtml
          ? 'no-store, no-cache, must-revalidate, max-age=0'
          : 'no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Packing Orbit Server running smoothly!`);
  console.log(`📡 Local Access (Phone): http://localhost:${PORT}`);
  console.log(`🌐 Network Access (PC / Wi-Fi): http://<YOUR_PHONE_IP>:3000`);
  console.log(`💾 Database: SQLite (database/packing_orbit.db)`);
  console.log(`==================================================\n`);
});
