# Universal Project Continuity Rules & Policies
**Project Name:** Packing Orbit  
**Project Path:** `/storage/emulated/0/Download/Project/Packing Orbit`  
**Timezone Standard:** Indian Standard Time (IST / UTC+05:30)  
**Business Domain / Industry:** Malegaon Textile & Powerloom Industry (100% Grey Cloth Baling & Packing Firm)

---

## 1. Mandatory Rule for All AI Assistants & Agents
> **CRITICAL DIRECTIVE:**  
> This file is the single source of truth for project continuity. Any AI assistant (including Antigravity, Claude CLI, OpenAI Codex / ChatGPT, Open Code, Gemini, or any CLI/web agent), across any new chat, resumed session, or fresh context window, **MUST read this file first before taking any action or writing any code.**

1. **First Action on Every Session / New Chat:**
   - Always read and inspect `Universal_Project_Continuity_Rules & Policies.md`.
   - Check the **Current Project State**, **Active Version**, and the **Last Action Taken**.
   - Resume execution precisely from the exact point where the project was previously paused or left off. Never overwrite existing progress without checking this history.

2. **Project Environment & Constraints:**
   - **Environment:** Android device via Termux / Linux app environment.
   - **Root Policy:** Never execute `su` or root actions unless explicitly requested by the user.
   - **Package Management:** Use `pnpm` by default for Node.js modules.
   - **Package Installations:** Never auto-install system packages (`pkg`, `apt`) without user approval.
   - **Target Deployment:** Mobile-friendly Web Application initially tested on PC/Mobile browser via Termux, later wrapped into an Android app.

---

## 2. Mandatory Authentication Gate on App Launch
> **MANDATORY SECURITY & ACCESS RULE DEFINED BY USER:**

1. **Direct Launch into Login Screen:**
   - Whenever the application is opened, launched, or reloaded, **it must strictly display the Login Screen first**.
   - No user (whether Admin, Labour Employee, or Customer Party) can view the Dashboard, Labour Management, or firm records without authenticating.
   - Auto-persistence across window launches is disabled. Every fresh session requires credentials.
2. **Post-Authentication Reveal:**
   - Only upon successful credential validation does the system unlock and render the protected role-based Dashboard.
   - Clicking **Logout** immediately wipes the active session and locks the app back to the primary Login Screen.

---

## 3. Multi-Role Capacity, Malegaon Industry & Testing Customer Protocol
> **MANDATORY BUSINESS RULES DEFINED BY USER:**

1. **6 Admins Logins (Firm Owners, Partners, Munim Ji):**
   - Accounts: `admin` (Firm Owner / Main), `admin1` to `admin5`.
   - Password: `admin123`.

2. **3 Employees (Strictly Packing & Baling Labours):**
   - **Capacity: Exactly 3 Active Labours**.
   - Current active roster includes Shahzad Raja (`9309384084`), Babu Lal (`9800000001`), and Irfan Bhai (`9800000002`).
   - Admins can deactivate / mark any labour as `Left / Inactive` (revokes access instantly) and hire replacement labours up to the 3-active limit.

3. **Customer Logins: 100% Malegaon Grey Cloth Weaving Parties:**
   - Weavers send only **grey cloth** for **bale (Ganth) packing**.
   - User creates customer accounts on demand during testing (`POST /api/customers/register`).
   - **Post-Project Database Cleaning Policy:** Admin has a dedicated action (`POST /api/admin/clear-test-customers`) to wipe out all testing customer logins and their temporary records with a single click once testing is complete, leaving master admin and labour accounts intact.

4. **Login Audit Logs & IST Timestamp Display:**
   - Every single login (Admin, Labour, Customer) is recorded into `login_logs` with the exact **IST timestamp** (`YYYY-MM-DD HH:MM:SS IST`).
   - Every user's active session banner displays their username, role, and exact IST login time.
   - **Admins have full access** to view real-time audit logs of all user logins across the firm.

---

## 4. Typography, Layout & Mobile Modal Standards
> **MANDATORY DESIGN & TYPOGRAPHY SYSTEM:**

1. **No Hero/Marketing Clutter Policy:** Real business web app UI with zero decorative filler text.
2. **Mobile Dialog Box Guidelines:** All modal dialog boxes fit mobile screens (`max-width: 350px`, centered, `box-sizing: border-box`) with **Cancel / Back** buttons.
3. **Database SQLite Prepared Statement Parameterization Rule:** Parameterized placeholders (`?`) only.

---

## 5. Full-Stack Co-Development & Unified Testing Command Policy
> **MANDATORY ARCHITECTURE & DEVELOPMENT RULE:**

1. **Simultaneous Co-Development:** Frontend, Backend, and Database developed together in sync.
2. **Single Unified Test Command:**
   ```bash
   cd "/storage/emulated/0/Download/Project/Packing Orbit" && pnpm dev
   ```
   *(Or `node server/index.js`)* on port 3000.

---

## 6. Project Directory Tree Structure
```text
Packing Orbit/
├── Universal_Project_Continuity_Rules & Policies.md   # Master continuity & rules file
├── package.json                                       # Root package config & unified dev script
├── .npmrc                                             # Android storage link configuration
├── assets/                                            # Static media, logos, design files
├── client/                                            # Frontend Web Application (Mobile-friendly UI)
│   ├── index.html                                     # Mandatory Login Gate & Protected Dashboard
│   ├── style.css                                      # Standardized type scale, login gate & modal mobile styling
│   └── app.js                                         # Dynamic auth gate, session isolation & admin controller
├── server/                                            # Backend API & Business logic
│   └── index.js                                       # Unified HTTP server & API endpoints
├── database/                                          # DB schemas, migrations & local DB storage
│   ├── db.js                                          # SQLite database connection & schema
│   └── packing_orbit.db                               # Local SQLite database file (WAL mode)
└── docs/                                              # Specifications, flowcharts & guides
```

---

## 7. Date & Time Stamping Protocol (IST)
- Every single modification, feature addition, milestone completion, session pause, or session resume **must be logged** in this document under the **Changelog & Activity Log** section below.
- Timestamp format must strictly follow Indian Standard Time (IST):  
  `YYYY-MM-DD HH:MM:SS [IST]` (e.g., `2026-11-24 15:23:00 IST`).
- All versions must use Semantic Versioning (`vMAJOR.MINOR.PATCH`, e.g., `v0.1.0`).

---

## 8. Current Project State & Resume Point

- **Current Version:** `v0.36.1` (Stamp Seal — 16 Degree Tilt)
- **Status:** Paused / Awaiting Next User Instructions
- **Active Phase:** Phase 5 - Core Grey Cloth Production & Packing Workflow
- **Last Action Taken:** 
  1. Converted application entry into a **Mandatory Login Gate**: opening the web app now always presents the Login form first.
  2. Dashboard, Labour roster, and audit logs are completely hidden/locked until authenticated.
  3. **Fix (v0.11.0):** Refresh no longer logs out — silent session restore via `/api/auth/me` with firm info; only manual Logout logs out.
  4. **Login Page Cleanup:** Credentials (6 Admins + 3 Labours) moved from open hint cards into a `<select>` dropdown with auto-fill; auth-card max-width fixed to `350px` per mobile modal standard.
  5. **Fix (v0.5.2):** Project header kept visible on login screen; only sidebar & backdrop are hidden until authentication.
  6. **Fix (v0.5.3):** Login page field order changed — `Select Account (Quick Login)` dropdown now appears **first**, followed by Mobile Number/Username and Password fields.
  7. **Fix (v0.5.4):** Current Login Status indicator added in header — blinking filled circle shows role (Admin / Packing Labour / Grey Cloth Party) when logged in, or "No Active Session" (grey dot) when not logged in.
  8. **Fix (v0.5.5):** Quick Account Select dropdown redesigned — proper padding, 0.85rem font size, left user icon, right dropdown arrow, focus states, optgroup styling for Admins & Labours sections.
  9. **Fix (v0.5.6):** Dropdown width constrained to `max-width: 100%` with `box-sizing: border-box`, `min-height: 44px`, font size reduced to `0.85rem`, options text with `text-overflow: ellipsis`.
  10. **Fix (v0.5.7):** Replaced native `<select>` with custom dropdown component — opens within form bounds only (max-height 260px scrollable list), never full screen. Click outside or Escape to close. Auto-fill on selection intact.
  11. **Fix (v0.5.8):** Admin dashboard compacted — admin card title 0.85rem, user banner h4 0.82rem, data table 0.75rem, table padding reduced, `white-space: nowrap` + `text-overflow: ellipsis` on all dashboard text to prevent wrapping, modal titles 0.9rem, sidebar nav 0.8rem, stats values 0.78rem.
  12. **Fix (v0.5.9):** Labour Staff Management and User Login Audit Logs cards made **collapsible/expandable** — click header to toggle, rotate arrow indicator, `white-space: nowrap` + `text-overflow: ellipsis` on titles to prevent overflow, header-actions grouped with toggle arrow.
  13. **Fix (v0.6.0):** Fixed button toggle conflict — `event.stopPropagation()` on Add Labour & Refresh buttons so clicking them doesn't trigger card collapse. Header restructured.
  14. **Fix (v0.6.1):** Header overlap fixed — `header-left` changed to `flex: 1` + `min-width: 0` + `overflow: hidden`.
  15. **Fix (v0.6.2):** Header brand name text cutting fixed — removed `min-width: 0` from `brand-name`/`brand-tagline`, replaced with `max-width: 100%`.
  16. **Fix (v0.6.3):** Header layout fixed — `header-left` set to `flex-shrink: 0`, brand-group max-width 180px, `justify-content: space-between` separates left/right sections.
  17. **Fix (v0.6.4):** Cache busting added — CSS link changed to `style.css?v=2` so browser loads fresh CSS instead of cached old version.
  18. **Fix (v0.6.5):** Header CSS completely rewritten — `header-container` has `padding: 0 0.5rem`, `header-left` and `header-right` both `flex-shrink: 0` with `gap: 0.5rem`/`0.3rem`, `brand-group` max-width `130px`, brand-name `1rem` font size, `justify-content: space-between` ensures left brand and right badges never overlap. CSS version bumped to `?v=3`.
  19. **Fix (v0.6.6) — ROOT CAUSE FOUND:** The admin card stylesheet re-declared the generic `.header-left` selector (line ~681) with `flex-direction: column; flex: 1;`, which silently overrode the header's own `.header-left` rule (row layout). This forced the menu button and brand into a column and caused the overlap the whole time. Selector scoped to `.admin-card-header .header-left`, so header `.header-left` now stays a horizontal row. Added `@media (max-width: 480px)` safety rules (brand shrinks, tagline hidden, right badge capped at 55%). CSS link bumped to `?v=4`.
  20. **Fix (v0.6.7):** The blinking **Live** status dot had disappeared from the main/landing/login-page header because the logged-out branch of `renderAppUI()` replaced the whole `#authHeaderContainer` innerHTML with only the "Protected" lock badge. Restored the `header-status` (pulsing green dot + "Live") alongside the "Protected" badge in the logged-out state. Added `#authHeaderContainer { display:flex; align-items:center; gap:0.3rem; }` so both badges sit neatly side by side. Cache-busted `style.css?v=5` and `app.js?v=5`.
  21. **Feature (v0.6.8):** Added a **Pricing** option in the header (visible to everyone, logged in or out) that opens a standalone Pricing page. Business model: **Lifetime one-time license + mandatory annual AMC (Annual Maintenance Charges)**. Two plan cards (Lifetime Subscription, Annual AMC), feature lists, renewal note, and a contact/WhatsApp CTA. Rates are **configurable** via `PRICING_CONFIG` at the top of `client/app.js` (currently placeholders `₹XX,XXX` / `₹X,XXX`). Added a Pricing item in the sidebar, a Back button to return to the previous view (login gate or dashboard), and responsive single-column layout on mobile. Cache-busted `style.css?v=6` / `app.js?v=6`; DB `system_info.version` updated to `v0.6.8`.
  22. **Feature (v0.6.9):** Added a **header tabs menu directly below the header** with 5 tabs: **Home, Download, Pricing, Help, Contacts**. Home returns to login gate (logged out) or dashboard (logged in); Pricing opens the existing Pricing page; Download, Help and Contacts are styled placeholder pages ("Coming Soon") with a Back to Home button. Contacts page shows configurable phone/email (`PRICING_CONFIG`). Active tab is highlighted, tabs scroll horizontally on mobile, and sidebar `top` offset updated to `96px` to sit below the taller header. Cache-busted `style.css?v=7` / `app.js?v=7`; DB `system_info.version` updated to `v0.6.9`.
  23. **Feature (v0.7.0) — Multi-Firm Licensing & Permanent Brand Lock:**
     - New `firms` table stores each licensed firm: firm name, owner, mobile, address, GSTIN, license type, license key, brand, fees, AMC due date, status.
     - License types: **Owner (Free ₹0)**, **Testing (Free ₹0)**, **Lifetime Purchased (paid + annual AMC)**. Owner and Testing fees are forced to 0 on the server.
     - Admin-only **Firm & License Management** card with **+ Create Firm** form: highly validated (firm/owner min 2 chars, 10-digit mobile, email format, license type whitelist, AMC date format, duplicate-mobile check), server-generated license key `PO-XXXX-XXXX-XXXX`, required brand-permanence confirmation checkbox.
     - **Original brand is permanently locked**: server ignores any client-supplied brand and always stores `system_info.app_name` with `brand_locked = 1`.
     - **License Copy / Certificate** modal for each firm, printable/save-as-PDF, always showing the original **Packing Orbit** brand, licensed firm name, license key, fees/AMC, issue date and non-transfer terms.
     - Permanent non-removable **"Powered by Packing Orbit · Original Brand — License Protected"** footer added to the application.
     - Admin-only endpoints: `GET /api/admin/firms`, `POST /api/admin/firms`, `POST /api/admin/firms/toggle-status` (activate/suspend).
     - Cache-busted `style.css?v=8` / `app.js?v=8`; DB `system_info.version` updated to `v0.7.0`.
  24. **Fix (v0.7.1):** The long **Create Firm & License** modal was cutting off its top fields because `.modal-dialog-box` had no height limit while the backdrop used flex centering. Fixed by giving `.modal-dialog-box` `max-height: calc(100dvh - 24px)` (with `100vh` fallback), `overflow-y: auto`, `overscroll-behavior: contain` and touch scrolling, and making `.modal-backdrop` scrollable. All form fields are now reachable by scrolling and nothing is hidden above the viewport. Cache-busted `style.css?v=9` / `app.js?v=9`; DB version `v0.7.1`.
  25. **Feature (v0.7.2):** Because the app is now in **paid testing** and an admin has created a firm, the login form now requires **firm selection**:
      - New **Select Firm (Paid License)** custom dropdown is the first field on the login form.
      - Public endpoint `GET /api/firms/active` returns only **active** firms (id, firm name, license type) — no license keys exposed.
      - Login now sends `firmId`; the server **requires** a valid active firm whenever any active firm exists, otherwise rejects with "Kripya pehle firm select karein."
      - Suspended/expired firms cannot be selected/used for login.
      - Selected firm is stored in `login_logs.firm_id` / `login_logs.firm_name` (DB migration added columns) and returned in the login response; the dashboard banner shows `| Firm: <name>`.
      - Cache-busted `style.css?v=10` / `app.js?v=10`; DB `system_info.version` updated to `v0.7.2`.
  26. **Feature (v0.7.3):** Admin dashboard ab sirf **ek Admin Control Panel entry card** show karta hai. Jab us card par click karte hain to alag **Admin Control Panel page** khulti hai jahan teeno developed admin cards rehte hain: **Labour Staff Management**, **User Login Audit Logs**, aur **Firm & License Management**. Panel mein **← Back to Dashboard** button hai; `openAdminControlPanel()` / `closeAdminControlPanel()` dashboard ko hide/show karte hain aur data refresh karte hain. Home tab/sidebar Dashboard click panel ko band karke dashboard par le aata hai. Cache-busted `style.css?v=11` / `app.js?v=11`; DB version `v0.7.3`.
  27. **Fix (v0.7.4):** Panel dashboard ke andar nested tha, isliye poora dashboard hide karne par panel bhi hide ho jata. Fix: `#protectedDashboard.panel-open` class approach — panel open hone par sirf dashboard chrome (banner, entry card, stats) hide hota hai aur control panel full-page view mein dikhta hai. Back/Home par class remove hokar dashboard wapas. Cache-busted `style.css?v=12` / `app.js?v=12`; DB version `v0.7.4`.
  28. **Feature (v0.7.5):** Dashboard par admin aur employee/labour cards ke **exactly upar** ek **Running Firm indicator** add kiya — **green filled blinking circle** ke saath selected firm ka naam aur license type badge (Owner/Testing/Lifetime). Login ke waqt selected firm (`user.firmName` / `licenseType`) se populate hota hai; logout ya bina firm ke hide rehta hai. Cache-busted `style.css?v=13` / `app.js?v=13`; DB version `v0.7.5`.
  29. **Refine (v0.7.6):** Running Firm indicator ko **card se heading** mein badla — koi background/border/padding box nahi. Ab yeh `<h2>` heading hai jo **Admin card ke exactly upar** dikhti hai: green blinking circle + "Running Firm:" + firm name + license type badge. Cache-busted `style.css?v=14` / `app.js?v=14`; DB version `v0.7.6`.
  30. **Fix (v0.7.7):** Running Firm heading user banner ("Firm Owner (Main Admin)" card) ke **neeche** dikh rahi thi. Heading ko dashboard ka **pehla child** bana diya — ab yeh user banner / Firm Owner (Main Admin) card ke **upar** hai, aur uske neeche Admin Control Panel card aata hai. Cache-busted `style.css?v=15` / `app.js?v=15`; DB version `v0.7.7`.
  31. **Fix (v0.7.8):** Browser purana HTML cache kar raha tha, isliye heading move hone ke baad bhi purana layout dikh raha tha. Static file server ab `Cache-Control: no-store, no-cache, must-revalidate` (HTML) aur `no-cache` (CSS/JS) headers bhejta hai, taake har reload par fresh UI mile. DB version `v0.7.8`.
  32. **Fix (v0.7.9):** Header mein "Packing Orbit" heading aur Admin status ke beech ek duplicate **Pricing** button dikh raha tha, jabki Pricing already header tabs (neeche) aur left sidebar menu mein maujood hai. Header ka Pricing button HTML se hata diya aur uski CSS (`.header-pricing-btn`, mobile overrides) bhi remove kar di — header ab sirf brand + auth status dikhata hai. Cache-busted `style.css?v=16` / `app.js?v=16`; DB version `v0.7.9`.
   33. **Feature (v0.8.0):** Admin Control Panel ko **Left sidebar menu** mein move kiya. New `syncAdminNavItem()` dynamically adds/removes the item based on `currentUser.role === "admin"`. Dashboard ke andar jo purana entry card tha woh remove kar diya gaya. APIs (`/api/admin/*`) pehle se hi server-side admin-only 401/403 guard rakhte hain. Cache-busted `style.css?v=17` / `app.js?v=17`; DB version `v0.8.0`.
   34. **Fix (v0.9.0):** Running Firm label removed; licensing font size reduced; admin cards panel-only. Cache-busted `style.css?v=18` / `app.js?v=18`; DB version `v0.9.0`.
   35. **Fix (v0.10.0):** Firm Owner (Main Admin) banner card removed from dashboard; Logout moved into header pill; logout delegation on `#authHeaderContainer`. Cache-busted `style.css?v=19` / `app.js?v=19`; DB version `v0.10.0`.
   36. **Fix (v0.11.0):** Refresh par logout na ho — silent session restore via `/api/auth/me` (with firm info) added in `initMandatoryAuthGate`; server `/api/auth/me` updated to return firmName/licenseType. Cache-busted `style.css?v=20` / `app.js?v=20`; DB version `v0.11.0`.
   37. **Feature (v0.12.0):** Customer Registration — admin-only `/api/customers/register` (with firm binding), new `/api/admin/customers` list, Admin UI **+ Register Customer** modal + customer list inside Firm & License Management card. Cache-busted `style.css?v=21` / `app.js?v=21`; DB version `v0.12.0`.
   38. **Feature/Polish (v0.13.0 - v0.29.0):** Ledger Create/Edit/Delete + child-record checks; Inward module (searchable dropdowns, bale boxes, DD-MM-YYYY date, auto serial Inward No., Total Takha, WhatsApp direct-share via APK native bridge); Inward/Outward placeholders; Transportation Details (Add Transport); Firm Customer Edit/Alter; Inward Badge final design (638x1011 300 DPI, dark-green header + full-width footer, black QR, hollow bale boxes, cyan Bales + green Total Takha, real JPG signature, 7-point Terms & Conditions). Cache-busted style.css?v=77 / app.js?v=77; DB version v0.29.0.
- **Exact Resume Point:** Phase 5 - Malegaon Grey Cloth Taka Entry & Bale Packing Workflow.

---

## 9. Versioning & Milestone Roadmap

| Version | Status | Milestone Description | Target Date |
| :--- | :--- | :--- | :--- |
| `v0.0.1` | **Completed** | Continuity rules file created and initialized | 2026-11-23 |
| `v0.0.2` | **Completed** | Malegaon Powerloom business terminology & domain policies added | 2026-11-23 |
| `v0.0.3` | **Completed** | Clean base directory structure created | 2026-11-23 |
| `v0.0.4` | **Completed** | Full-Stack co-development policy & single unified test command rule added | 2026-11-23 |
| `v0.1.0` | **Completed** | Landing page header, logo placeholder space, SQLite DB & API | 2026-11-24 |
| `v0.2.0` | **Completed** | Left side menu bar with dynamic 'Dashboard' placeholder | 2026-11-24 |
| `v0.2.1` | **Completed** | Slogan lowercase/thin font + A4 portrait print/report typography scale system | 2026-11-24 |
| `v0.2.2` | **Completed** | Fixed header text break & sidebar drawer alignment | 2026-11-24 |
| `v0.3.0` | **Completed** | Option A Unified Authentication Foundation | 2026-11-24 |
| `v0.4.0` | **Completed** | Header overlap fixed, Labour management & IST Audit logs | 2026-11-24 |
| `v0.4.1` | **Completed** | 6 Admins enabled (admin + admin1-admin5), 3 Labours, Customer test & clear protocol | 2026-11-24 |
| `v0.4.2` | **Completed** | Cleaned hero clutter & fixed mobile modal sizing with Back buttons | 2026-11-24 |
| `v0.4.3` | **Completed** | SQLite syntax bug fixed & live labour replacement verified (Shahzad Raja) | 2026-11-24 |
| `v0.5.0` | **Completed** | Mandatory Login Gate on application launch (All roles must login first) | 2026-11-24 |
| `v0.5.1` | **Completed** | Login page cleanup: credentials moved to dropdown, auth-card max-width 350px | 2026-11-24 |
| `v0.5.2` | **Completed** | Login page header restored (visible on login screen); only sidebar & backdrop hidden until auth | 2026-11-24 |
| `v0.5.3` | **Completed** | Login page field order: Quick Login dropdown first, then identifier & password | 2026-11-24 |
| `v0.5.4` | **Completed** | Login status indicator: blinking filled circle shows role (Admin / Labour / Customer) when logged in | 2026-11-24 |
| `v0.5.5` | **Completed** | Quick Account Select dropdown redesigned: 0.9rem font, user icon, dropdown arrow, focus states | 2026-11-24 |
| `v0.5.6` | **Completed** | Dropdown width fixed: max-width 100%, min-height 44px, text-overflow ellipsis — no more mobile screen overflow | 2026-11-24 |
| `v0.5.7` | **Completed** | Custom dropdown replaces native select — opens within form bounds only, never full screen | 2026-11-24 |
| `v0.5.8` | **Completed** | Admin dashboard compact typography — no text wrapping, smaller fonts throughout | 2026-11-24 |
| `v0.5.9` | **Completed** | Collapsible admin cards — Labour & Audit Logs toggle with arrow indicator | 2026-11-24 |
| `v0.6.0` | **Completed** | Collapsible cards fixed — button conflict resolved, header text overflow fixed | 2026-11-24 |
| `v0.6.1` | **Completed** | Header overlap fix — "Packing Orbit" brand name no longer overlaps with Protected badge | 2026-11-24 |
| `v0.6.2` | **Completed** | Header brand name text cutting fixed — full "Packing Orbit" displays correctly | 2026-11-24 |
| `v0.6.3` | **Completed** | Header layout fixed — Brand name above menu toggle, Protected badge on far right, no overlap | 2026-11-24 |
| `v0.6.4` | **Completed** | Cache busting — CSS link `style.css?v=2` forces browser to load fresh CSS | 2026-11-24 |
| `v0.6.5` | **Completed** | Header CSS rewritten — brand max-width 130px, header padding added, CSS v3 | 2026-11-24 |
| `v0.6.6` | **Completed** | Header root cause fixed — `.header-left` admin-card selector collision resolved, mobile safety media query, CSS v4 | 2026-11-24 |
| `v0.6.7` | **Completed** | Live blinking status restored on login/landing header alongside Protected badge, CSS/JS v5 | 2026-11-24 |
| `v0.6.8` | **Completed** | Header Pricing option + standalone Pricing page: Lifetime license + annual AMC, configurable rates, CSS/JS v6 | 2026-11-24 |
| `v0.6.9` | **Completed** | Header tabs menu below header: Home / Download / Pricing / Help / Contacts (3 placeholders), CSS/JS v7 | 2026-11-24 |
| `v0.7.0` | **Completed** | Multi-firm licensing: Owner/Testing free, Lifetime paid + AMC, permanent brand lock, license certificate, CSS/JS v8 | 2026-11-24 |
| `v0.7.1` | **Completed** | Modal scroll fix — long Firm License form max-height + scroll, top fields no longer hidden, CSS/JS v9 | 2026-11-24 |
| `v0.7.2` | **Completed** | Login firm selection — active paid license required, firm logged with login, CSS/JS v10 | 2026-11-24 |
| `v0.7.3` | **Completed** | Admin Control Panel — single entry card on dashboard, three admin cards inside panel, CSS/JS v11 | 2026-11-24 |
| `v0.7.4` | **Completed** | Control Panel nesting fix — panel-open class, clean full-page panel view, CSS/JS v12 | 2026-11-24 |
| `v0.7.5` | **Completed** | Running firm indicator — green blinking circle + firm name/type above admin & labour cards, CSS/JS v13 | 2026-11-24 |
| `v0.7.6` | **Completed** | Running firm as heading (no card) above Admin card, CSS/JS v14 | 2026-11-24 |
| `v0.7.7` | **Completed** | Running firm heading moved to top, above Firm Owner (Main Admin) banner/card, CSS/JS v15 | 2026-11-24 |
| `v0.7.8` | **Completed** | No-cache static headers — fresh UI on every reload, no stale browser cache | 2026-11-24 |
| `v0.7.9` | **Completed** | Header cleanup — duplicate Pricing button removed from header (kept in tabs + sidebar), CSS/JS v16 | 2026-11-24 |
| `v0.8.0` | **Completed** | Admin Control Panel moved to left sidebar menu (admin-only nav item), entry card removed, server APIs already admin-guarded, CSS/JS v17 | 2026-11-24 |
| `v0.9.0` | **Completed** | Running Firm label removed + licensing font size reduced, admin cards panel-only, CSS/JS v18 | 2026-11-24 |
| `v0.10.0` | **Completed** | Firm Owner (Main Admin) banner card removed from dashboard; Logout moved into header pill, CSS/JS v19 | 2026-11-24 |
| `v0.11.0` | **Completed** | Session restore on refresh via /api/auth/me (silent), no auto-logout, CSS/JS v20 | 2026-11-24 |
| `v0.12.0` | **Completed** | Customer Registration — admin-only /api/customers/register (+ firm link), /api/admin/customers list, "+ Register Customer" modal + list in Firm card, CSS/JS v21 | 2026-11-25 |
| `v0.13.0` | **Completed** | Firm Customer Registration tab added inside Login form + JS wiring, CSS/JS v22, DB version `v0.13.0` | 2026-11-25 |
| `v0.14.0` | **Completed** | Customer registration admin-only check removed — license holder/app user can register customers from their device | 2026-11-25 |
| `v0.14.1` | **Completed** | Login fix — customer registration panel moved outside login form, JS validation, admin/employee login restored, CSS/JS v23 | 2026-11-25 |
| `v0.15.0` | **Completed** | Firm Customer Registration completely removed from backend/database/frontend (pending redesign after discussion), CSS/JS v24 | 2026-11-25 |
| `v0.15.1` | **Completed** | Architecture discussion documented — firm-scoped customer model, cloud/VPS + direct APK decision, cloud-ready development order | 2026-11-25 |
| `v0.15.2` | **Completed** | Decision logged — banking-style admin-only customer registration, mobile number as login ID, no documents | 2026-11-25 |
| `v0.15.3` | **Completed** | PIN policy logged — auto-generated PIN stored in DB, admin-visible, no reset/forgot-password system | 2026-11-25 |
| `v0.16.0` | **Completed** | Step 1 implemented — admin-only firm customer registration, auto PIN stored & visible, firm-bound customer login, CSS/JS v25 | 2026-11-25 |
| `v0.16.1` | **Completed** | Customer registration + customer login testing guide documented in Section 12 | 2026-11-25 |
| `v0.16.2` | **Completed** | Ledger placeholder — sidebar menu between Dashboard and Pricing + Coming Soon page, CSS/JS v26 | 2026-11-26 |
| `v0.16.3` | **Completed** | Ledger + all future sub-menus admin-only (dynamic role sync, switchTab guard), CSS/JS v27 | 2026-11-26 |
| `v0.16.4` | **Completed** | Ledger sub-menu placeholders — Create, Edit/Alter, Delete + Coming Soon pages, CSS/JS v28 | 2026-11-26 |
| `v0.17.0` | **Completed** | Ledger Create implemented — ledger_entries table, admin-only API, searchable customer dropdown + required fields, CSS/JS v29 | 2026-11-26 |
| `v0.18.0` | **Completed** | Ledger Edit/Alter + Delete activated — firm-scoped list/update/delete APIs + UI tables/forms, CSS/JS v30 | 2026-11-26 |
| `v0.19.0` | **Completed** | Ledger child-record checks — ledger_records table, edit keeps records linked, delete blocked if records exist, CSS/JS v31 | 2026-11-26 |
| `v0.20.0` | **Completed** | Inward + Outward admin-only placeholder menus between Ledger and Pricing, CSS/JS v32 | 2026-11-26 |
| `v0.20.1` | **Completed** | Inward/Outward access extended to Admin + Employee (Labour), CSS/JS v33 | 2026-11-26 |
| `v0.21.0` | **Completed** | Transportation Detail card + Add Transport (Outward), transports table + admin APIs, CSS/JS v34 | 2026-11-26 |
| `v0.22.0` | **Completed** | Inward module — 5 searchable dropdowns from Ledger data + Bale Numbers 1-30, inward_entries table + APIs, CSS/JS v35 | 2026-11-26 |
| `v0.22.1` | **Completed** | Inward dropdown overlap/selection fix — active z-index 1000, compact list, click isolation, CSS/JS v36 | 2026-11-26 |
| `v0.23.0` | **Completed** | Inward bales multi-entry (1-30) + inward_bales table + auto Inward No./Date-Time + saved list, CSS/JS v37 | 2026-11-26 |
| `v0.23.1` | **Completed** | Inward bale fast mode — Enter adds next row, comma-separated auto-split, CSS/JS v38 | 2026-11-26 |
| `v0.23.2` | **Completed** | Bale inputs get `inputmode="numeric"` for mobile keypad (alphanumeric still allowed), CSS/JS v39 | 2026-11-26 |
| `v0.23.3` | **Completed** | Bale inputs in compact grid — 5 per row desktop / 3 tablet / 2 mobile, shorter form, CSS/JS v40 | 2026-11-26 |
| `v0.23.4` | **Completed** | Bale inputs fixed 68px compact boxes, maxlength 12, flex-wrap for 8-10 per line, CSS/JS v41 | 2026-11-26 |
| `v0.24.0` | **Completed** | Inward total takha from ledger (bales × takha) + Token/Takha/Total columns in list, CSS/JS v42 | 2026-11-26 |
| `v0.24.1` | **Completed** | Total Takha as readonly incremental text box; Takha-per-bale display removed, CSS/JS v43 | 2026-11-26 |
| `v0.24.2` | **Completed** | Inward No. `IN-DDMMYYYY-XXXX` + date/time `DDMMYYYY hh:mm:ss AM/PM`, CSS/JS v44 | 2026-11-26 |
| `v0.24.3` | **Completed** | Inward No. trailing part now daily serial 0001, 0002... (no random), CSS/JS v45 | 2026-11-26 |
| `v0.25.0` | **Completed** | Firm registered customer Edit/Alter — admin-only update API + Edit modal, CSS/JS v46 | 2026-11-26 |
| `v0.25.1` | **Completed** | Inward WhatsApp share — per-row Share button + share-after-save, wa.me deep link, CSS/JS v47 | 2026-11-26 |
| `v0.25.2` | **Completed** | WhatsApp share message me packing firm name added (brand retained), CSS/JS v48 | 2026-11-26 |
| `v0.25.3` | **Completed** | Inward share as non-editable PNG image badge (canvas) via navigator.share + download fallback, CSS/JS v49 | 2026-11-26 |
| `v0.25.4` | **Completed** | Per-record QR embedded in inward badge image (offline qrcode.js), CSS/JS v50 | 2026-11-26 |
| `v0.25.5` | **Completed** | QR moved to badge header top-right; share opens customer WhatsApp chat directly (image clipboard + wa.me), CSS/JS v51 | 2026-11-26 |
| `v0.25.6` | **Completed** | Badge image share fixed — native Web Share with PNG file is primary, wa.me text only fallback, CSS/JS v52 | 2026-11-26 |
| `v0.25.7` | **Completed** | Search-free share — direct customer wa.me chat + badge image clipboard/download; native jid auto-attach planned for APK, CSS/JS v53 | 2026-11-26 |
| `v0.25.8` | **Completed** | Capacitor Android project + native WhatsApp jid/image bridge + GitHub Actions APK build/release, CSS/JS v54 | 2026-11-26 |
| `v0.25.9` | **Completed** | No download, image-only share — native APK bridge first, Web Share image fallback, text-only wa.me removed, CSS/JS v55 | 2026-11-26 |
| `v0.26.0` | **Completed** | APK local assets mode + API base to phone server + cleartext traffic — no hosting needed for direct customer image share, CSS/JS v56 | 2026-11-26 |
| `v0.26.1` | **Completed** | Clarified local APK stage vs cloud/VPS buyer stage in Section 11.9 | 2026-11-26 |
| `v0.26.2` | **Completed** | GitHub Actions fix — use preinstalled Android SDK, remove setup-android action | 2026-11-26 |
| `v0.27.0` | **Completed** | Badge 638x1011 px 300 DPI white theme, colored header with white brand text, CSS/JS v57 | 2026-11-26 |
| `v0.27.1` | **Completed** | Badge rounded corners (radius 28), CSS/JS v58 | 2026-11-26 |
| `v0.27.2` | **Completed** | Badge header gap minimal, QR 140px standard black at top-right, CSS/JS v59 | 2026-11-26 |
| `v0.27.3` | **Completed** | Header gap 22px, QR 200px stretched left/down, CSS/JS v60 | 2026-11-26 |
| `v0.27.4` | **Completed** | Share caption removed, centered headings/footer, licensed-firm watermark, CSS/JS v61 | 2026-11-26 |
| `v0.27.5` | **Completed** | Inward date `DD-MM-YYYY`, reduced badge line spacing, wider value column, CSS/JS v62 | 2026-11-26 |
| `v0.27.6` | **Completed** | Badge minimal field spacing, bale numbers in two clear lines at bold 26px, CSS/JS v63 | 2026-11-27 |
| `v0.27.7` | **Completed** | Reduced Bales→Bale Numbers gap, bale values aligned at x=240, CSS/JS v64 | 2026-11-27 |
| `v0.27.8` | **Completed** | Bales highlight row (cyan) above Total Takha with right-aligned output, CSS/JS v65 | 2026-11-27 |
| `v0.27.9` | **Completed** | Bale numbers in hollow boxes + Authorised Signatory with cursive digital sign, CSS/JS v66 | 2026-11-27 |
| `v0.28.0` | **Completed** | Human-style handwritten signature with cursive font, loop and underline flourish, CSS/JS v67 | 2026-11-27 |
| `v0.28.1` | **Completed** | Tiny low-contrast scribble signature, Authorised Signatory at box bottom-right, CSS/JS v68 | 2026-11-27 |
| `v0.28.2` | **Completed** | Scribble removed; firm [Admin1] placeholder + optional client/signature.jpg image + Authorised Signatory, CSS/JS v69 | 2026-11-27 |
| `v0.28.3` | **Completed** | Real handwritten JPG signature integrated in badge with aspect ratio, CSS/JS v70 | 2026-11-27 |
| `v0.28.4` | **Completed** | Badge Quality field shows Type + Quality combined (e.g. PC 62 x 42), CSS/JS v71 | 2026-11-27 |
| `v0.28.5` | **Completed** | Signatory stamping shifted to outer box bottom-right corner, CSS/JS v72 | 2026-11-27 |
| `v0.28.6` | **Completed** | Professional Terms & Conditions placeholder beside signatory block, CSS/JS v73 | 2026-11-27 |
| `v0.28.7` | **Completed** | Terms wording (must be) + 3 new dispatch/risk/damage conditions, CSS/JS v74 | 2026-11-27 |
| `v0.28.8` | **Completed** | Condition 7: godown charge applicable for >10 days late dispatch, CSS/JS v75 | 2026-11-27 |
| `v0.28.9` | **Completed** | Badge footer dark green compact patch with white text, CSS/JS v76 | 2026-11-27 |
| `v0.29.0` | **Completed** | Footer full-width borderless dark green bar with white text, CSS/JS v77 | 2026-11-27 |
| `v0.29.1` | **Completed** | Login page header + tab menu hidden; shown again after login, CSS/JS v78 | 2026-11-27 |
| `v0.29.2` | **Completed** | Packing Orbit brand text moved above login card, card title only "Sign In", CSS/JS v79 | 2026-11-27 |
| `v0.29.3` | **Completed** | Login lock icon + subtitle removed, thin Sign In font, CSS/JS v80 | 2026-11-27 |
| `v0.29.4` | **Completed** | Fixed-width login header bar with single separator line and right-corner Subscriptions button, CSS/JS v81 | 2026-11-27 |
| `v0.29.5` | **Completed** | Login header half width, full-page-width separator line, firm hint text removed, CSS/JS v82 | 2026-11-27 |
| `v0.29.6` | **Completed** | Login header height 52px -> 28px (width 175px unchanged), CSS/JS v83 | 2026-11-27 |
| `v0.29.7` | **Completed** | Login header height 22px, brand/button balanced sizing, left/right corners, CSS/JS v84 | 2026-11-27 |
| `v0.29.8` | **Completed** | Brand left corner + Subscriptions right corner with max-fit font sizes, CSS/JS v85 | 2026-11-27 |
| `v0.29.9` | **Completed** | Header full-width (420px max), overlap fixed, brand left + Subscriptions right, CSS/JS v86 | 2026-11-27 |
| `v0.30.0` | **Completed** | Header height 44px, vertical center, brand 1.1rem + 18px icon, CSS/JS v87 | 2026-11-27 |
| `v0.31.0` | **Completed** | Pricing menu removed from tabs + sidebar, available only via Subscriptions button, CSS/JS v88 | 2026-11-27 |
| `v0.32.0` | **Completed** | Login page role tabs (Admin/Employees/Customer/Subscribers) below header line, CSS/JS v89 | 2026-11-27 |
| `v0.33.0` | **Completed** | Role-specific login flows under each tab, CSS/JS v90 | 2026-11-27 |
| `v0.34.0` | **Completed** | Inward badge stamp seal (circular VERIFIED seal), CSS/JS v91 | 2026-11-27 |
| `v0.35.0` | **Completed** | Ink-pad red seal with corrected text, placed between Terms and Authorised Signatory, CSS/JS v92 | 2026-11-27 |
| `v0.36.0` | **Completed** | Rectangle ink stamp replacing circular seal (no text overlap), CSS/JS v93 | 2026-11-27 |
| `v0.36.1` | **Completed** | Stamp tilted 16 degrees around its center, CSS/JS v94 | 2026-11-27 |

---

## 10. Changelog & Activity Log (IST)

### [2026-11-27 21:36:54 IST] - v0.36.1
- **Session:** Stamp Seal — Tilt.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Rectangle ink stamp ko **16 degree** rotate kiya (real ink-pad impression jaisa tilt).
  - Rotation stamp ke apne center ke around hoti hai, position aur text waise hi.
  - Cache-busted `style.css?v=94` / `app.js?v=94`; package.json `0.36.1`.
  - Updated DB `system_info.version` to `v0.36.1`.
  - Bumped version to `v0.36.1`.

### [2026-11-27 21:29:37 IST] - v0.36.0
- **Session:** Stamp Seal — Rectangle Shape.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Circular stamp seal ko **rectangle ink-pad stamp** se replace kiya (double red border).
  - Andar 4 clean lines: "PACKING ORBIT", firm name, "OFFICIAL SEAL", "VERIFIED" — ab koi overlap nahi.
  - Seal ab bhi Terms & Conditions aur Authorised Signatory ke beech white area me hai.
  - Cache-busted `style.css?v=93` / `app.js?v=93`; package.json `0.36.0`.
  - Updated DB `system_info.version` to `v0.36.0`.
  - Bumped version to `v0.36.0`.

### [2026-11-27 16:38:54 IST] - v0.35.0
- **Session:** Stamp Seal — Ink Colour, Correct Wording, Right Position.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header se purana seal remove kiya.
  - Naya **ink-pad colour** (red ink `rgba(185,28,28,0.82)`) ka circular stamp seal banaya: text **"PACKING ORBIT"** + **"OFFICIAL SEAL"**, center **"VERIFIED"** (spelling/galat wording theek).
  - Seal ab **Terms & Conditions aur Authorised Signatory ke beech** (white background area) me place hai.
  - Terms text width 440 -> 350 kiya taake seal ke liye jagah mile.
  - Cache-busted `style.css?v=92` / `app.js?v=92`; package.json `0.35.0`.
  - Updated DB `system_info.version` to `v0.35.0`.
  - Bumped version to `v0.35.0`.

### [2026-11-27 16:28:22 IST] - v0.34.0
- **Session:** Inward Badge — Stamp Seal.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Badge header me QR ke left ek **professional circular stamp seal** add kiya: double ring, circular text "PACKING ORBIT" aur "LICENSED FIRM", center me "VERIFIED".
  - `drawCircularText()` helper add kiya — characters ko arc par rotate karke likhta hai.
  - Cache-busted `style.css?v=91` / `app.js?v=91`; package.json `0.34.0`.
  - Updated DB `system_info.version` to `v0.34.0`.
  - Bumped version to `v0.34.0`.

### [2026-11-27 16:09:09 IST] - v0.33.0
- **Session:** Login Role Tabs — Dedicated Login Per Tab.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Har login tab ke saath apna login flow integrate kiya:
    - **Admin**: quick-login list me sirf Admins (admin..admin5).
    - **Employees**: quick-login list me sirf Packing Labours.
    - **Customer**: quick-login hidden; labels/placeholders "Customer Mobile Number" / "Login PIN"; hint diya gaya ki admin se mila mobile+PIN use karein.
    - **Subscribers**: login abhi available nahi — note + submit button disabled.
  - Tab switch par credentials clear hote hain taake galat role ki credentials na bharin; logout par tab wapas Admin par reset.
  - Cache-busted `style.css?v=90` / `app.js?v=90`; package.json `0.33.0`.
  - Updated DB `system_info.version` to `v0.33.0`.
  - Bumped version to `v0.33.0`.

### [2026-11-27 15:55:30 IST] - v0.32.0
- **Session:** Login Page — Role Tabs.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Login header separator line ke **neeche** 4 tabs add kiye: **Admin**, **Employees**, **Customer**, **Subscribers**.
  - Tabs full-width (max 420px), equal flex width, active tab blue highlight; click par active state switch (`initLoginRoleTabs()`).
  - Ye tabs abhi visual selection ke liye hain — login form ka behavior waise hi hai.
  - Cache-busted `style.css?v=89` / `app.js?v=89`; package.json `0.32.0`.
  - Updated DB `system_info.version` to `v0.32.0`.
  - Bumped version to `v0.32.0`.

### [2026-11-27 15:41:31 IST] - v0.31.0
- **Session:** Pricing Menu Integrated Into Subscriptions Button.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header tab menu se **Pricing** button remove kiya.
  - Left sidebar se bhi **Pricing** nav item remove kiya (`renderNavMenus()` me pricing block hata diya).
  - Pricing page ab **sirf login header ke "Subscriptions" button** se khulti hai (`openPricingPage()` pehle se wired tha).
  - Sidebar order fix: Dashboard → Ledger → Inward → Outward → Admin Control Panel (pricing ke bina bhi insertion sahi rahe).
  - Cache-busted `style.css?v=88` / `app.js?v=88`; package.json `0.31.0`.
  - Updated DB `system_info.version` to `v0.31.0`.
  - Bumped version to `v0.31.0`.

### [2026-11-27 15:29:18 IST] - v0.30.0
- **Session:** Login Header — Vertical Center + Bigger Brand.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header height 24px -> **44px** — brand aur button ab separator line ke paas chipke nahi, balki poori height me **vertically center** (`align-items:center`).
  - Brand name font 0.95rem -> **1.1rem**, icon 14px -> **18px** — saath me bada aur readable.
  - Subscriptions button font 0.75rem -> 0.8rem, padding thoda bada.
  - Width 100% (max 420px) aur full-width separator line waise hi.
  - Cache-busted `style.css?v=87` / `app.js?v=87`; package.json `0.30.0`.
  - Updated DB `system_info.version` to `v0.30.0`.
  - Bumped version to `v0.30.0`.

### [2026-11-27 15:21:07 IST] - v0.29.9
- **Session:** Login Header — Proper Full-Width Design (Overlap Fix).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** 175px width me brand (icon + "Packing Orbit") aur "Subscriptions" button fit nahi karte the — dono center me aa kar overlap kar rahe the.
  - Fix: header ko **standard app header ki tarah full-width** banaya (`width:100%`, `max-width:420px`, height 24px).
  - `justify-content: space-between` — brand **left corner**, Subscriptions **right corner**, ab koi overlap nahi.
  - Font sizes readability ke liye thode bade: brand 0.95rem, button 0.75rem.
  - Full-page-width separator line (`::after`, 100vw) waise hi.
  - Cache-busted `style.css?v=86` / `app.js?v=86`; package.json `0.29.9`.
  - Updated DB `system_info.version` to `v0.29.9`.
  - Bumped version to `v0.29.9`.

### [2026-11-27 15:13:29 IST] - v0.29.8
- **Session:** Login Header — Corners + Max Fit Sizing.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header me ab `justify-content: flex-start` + brand par `margin-right:auto` aur button par `margin-left:auto` — brand **left corner**, Subscriptions **right corner** (center alignment khatam).
  - Brand font 0.85rem -> **0.9rem**, button font 0.65rem -> **0.7rem**, padding compact — 22px height me maximum possible size.
  - Width 175px aur height 22px wahi rahe.
  - Cache-busted `style.css?v=85` / `app.js?v=85`; package.json `0.29.8`.
  - Updated DB `system_info.version` to `v0.29.8`.
  - Bumped version to `v0.29.8`.

### [2026-11-27 15:03:09 IST] - v0.29.7
- **Session:** Login Header — 22px Height + Balanced Sizing.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header height **28px -> 22px** (width 175px unchanged).
  - Brand font thoda bada (0.8rem -> 0.85rem), icon 16px -> 14px — 22px height me fit.
  - Subscriptions button font 0.6rem -> 0.65rem, padding compact (0.15rem 0.3rem) — thoda bada aur readable, right corner me.
  - Brand icon ke saath left corner, button right corner, dono vertically center (`align-items:center`, `justify-content:space-between`).
  - Cache-busted `style.css?v=84` / `app.js?v=84`; package.json `0.29.7`.
  - Updated DB `system_info.version` to `v0.29.7`.
  - Bumped version to `v0.29.7`.

### [2026-11-27 14:52:36 IST] - v0.29.6
- **Session:** Login Header Height Reduced.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Login header bar ki **height 52px -> 28px** ki gayi; width **175px wahi** rakhi gayi.
  - Brand text (0.8rem), icon (16px) aur Subscriptions button (0.6rem) 28px height me clean fit hote hain, vertically centered.
  - Cache-busted `style.css?v=83` / `app.js?v=83`; package.json `0.29.6`.
  - Updated DB `system_info.version` to `v0.29.6`.
  - Bumped version to `v0.29.6`.

### [2026-11-27 14:39:20 IST] - v0.29.5
- **Session:** Login Header Size, Full-Width Line, Firm Hint Removal.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Login header bar width **350px -> 175px** (half), height 52px; brand text 0.8rem, icon 16px, Subscriptions button compact (0.6rem) so everything still fits and stays vertically centered.
  - Separator line ab header bar ke `::after` se **poori page width (100vw)** me — left se right tak, bar ki width par dependent nahi.
  - Firm select ke neeche wala hint text **"N active firm license available. Login usi firm ke context mein hoga."** aur uska initial hint `<p>` element dono remove kiye (success aur error dono paths).
  - Cache-busted `style.css?v=82` / `app.js?v=82`; package.json `0.29.5`.
  - Updated DB `system_info.version` to `v0.29.5`.
  - Bumped version to `v0.29.5`.

### [2026-11-27 14:27:45 IST] - v0.29.4
- **Session:** Login Header Bar + Subscriptions Button.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Login page ka brand header ab **fixed-width (350px) bar** hai — auth card ke width ke barabar.
  - Bar me **embedded single line** (`border-bottom`) hai — brand ko card se separate karta hai.
  - Bar ki height 56px, `align-items:center` — button vertically bilkul center me, na upar na neeche chipka.
  - **Right corner** me **"Subscriptions"** button — professional blue (`#2563eb`), white text, hover/active states; click par Pricing page khulti hai (`openPricingPage()`).
  - Cache-busted `style.css?v=81` / `app.js?v=81`; package.json `0.29.4`.
  - Updated DB `system_info.version` to `v0.29.4`.
  - Bumped version to `v0.29.4`.

### [2026-11-27 14:11:34 IST] - v0.29.3
- **Session:** Login Card — Clean Professional Look.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Lock/shield icon ke andar ka symbol login card se **remove** kiya (card header ab sirf title).
  - "Sign In" font ko **thin (300 weight)** kiya — Inter base font, 1.05rem, letter-spacing 0.06em, soft gray color (pehle bold display font tha).
  - Subtitle **"Admins, Packing Labours aur Weavers ka Unified Portal"** remove kiya.
  - Cache-busted `style.css?v=80` / `app.js?v=80`; package.json `0.29.3`.
  - Updated DB `system_info.version` to `v0.29.3`.
  - Bumped version to `v0.29.3`.

### [2026-11-27 14:01:12 IST] - v0.29.2
- **Session:** Login Brand Text Above Card.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - "Packing Orbit" brand text ko login card ke andar se nikal kar **card ke upar** place kiya (shield icon + brand name, `#loginBrandName`).
  - Card ka title ab sirf **"Sign In"** hai (pehle "Sign In to Packing Orbit").
  - `.auth-gate-container` ko `flex-direction: column` diya taake brand upar aur card neeche aaye.
  - Brand name `system_info.app_name` se dynamic set hota hai.
  - Cache-busted `style.css?v=79` / `app.js?v=79`; package.json `0.29.2`.
  - Updated DB `system_info.version` to `v0.29.2`.
  - Bumped version to `v0.29.2`.

### [2026-11-27 12:24:12 IST] - v0.29.1
- **Session:** Login Page — Header & Tabs Hidden.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Login (unauthenticated) screen me ab **poora header** (`#mainHeader`) aur uske neeche ka **tab menu** (`#headerTabs`) nahi dikhte — dono default `display:none`.
  - `renderAppUI(user)` me: login hone par dono wapas dikhayi jaati hain (`style.display = ''`), logout/initial state par `none`.
  - Login ke baad ka UI bilkul waise hi hai jaise pehle tha (header + tabs + sidebar).
  - Cache-busted `style.css?v=78` / `app.js?v=78`; package.json `0.29.1`.
  - Updated DB `system_info.version` to `v0.29.1`.
  - Bumped version to `v0.29.1`.

### [2026-11-27 09:45:36 IST] - v0.29.0
- **Session:** Badge — Full-Width Borderless Footer.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Footer patch ab **poori width (638px)** me, left/right/bottom flush — header ki tarah borderless (rounded corners clip apply hoti hai).
  - Height 34px, text white centered — "Original Brand - License Protected".
  - Cache-busted `style.css?v=77` / `app.js?v=77`; package.json `0.29.0`.
  - Updated DB `system_info.version` to `v0.29.0`.
  - Bumped version to `v0.29.0`.

### [2026-11-27 09:35:44 IST] - v0.28.9
- **Session:** Badge — Dark Green Footer Patch.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Footer me header jaisa dark green patch add kiya (compact width 360px, height 30px, centered).
  - Footer text ab **white** — "Original Brand - License Protected" 13px centered on the patch.
  - Cache-busted `style.css?v=76` / `app.js?v=76`; package.json `0.28.9`.
  - Updated DB `system_info.version` to `v0.28.9`.
  - Bumped version to `v0.28.9`.

### [2026-11-27 09:23:55 IST] - v0.28.8
- **Session:** Terms Condition 7 Wording Fix.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Condition 7 corrected: "damage applicable" -> **"godown charge applicable"** if dispatch is more than 10 days late.
  - Cache-busted `style.css?v=75` / `app.js?v=75`; package.json `0.28.8`.
  - Updated DB `system_info.version` to `v0.28.8`.
  - Bumped version to `v0.28.8`.

### [2026-11-27 09:21:58 IST] - v0.28.7
- **Session:** Badge Terms — Wording + 3 New Conditions.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Condition 1 me "must be received" wording lagaya.
  - Teen nayi conditions add: (5) dispatch to transport within 24 hrs of inward, (6) goods risk ceases at our godown only, (7) >10 days late dispatch - damage applicable.
  - Terms compact kiye (9px font, 12px line height) taake 7 conditions + heading box me fit rahein.
  - Cache-busted `style.css?v=74` / `app.js?v=74`; package.json `0.28.7`.
  - Updated DB `system_info.version` to `v0.28.7`.
  - Bumped version to `v0.28.7`.

### [2026-11-27 09:16:41 IST] - v0.28.6
- **Session:** Badge — Terms & Conditions Placeholder.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Blank space left of the bottom-right signatory block filled with a professional **Terms & Conditions** placeholder (5 compact lines): material received in good condition, report shortage within 24 hours, quality/rate as per ledger entry, computer-generated inward record.
  - Cache-busted `style.css?v=73` / `app.js?v=73`; package.json `0.28.6`.
  - Updated DB `system_info.version` to `v0.28.6`.
  - Bumped version to `v0.28.6`.

### [2026-11-27 09:03:33 IST] - v0.28.5
- **Session:** Badge — Signatory to Bottom-Right Corner.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Signatory stamping block (firm placeholder + real JPG signature + Authorised Signatory) shifted to the extreme bottom-right of the outer box: right edge x=606 (8px inside), heading baseline y=918 (12px above box bottom 930).
  - Signature image and placeholder line follow the same right-aligned corner position.
  - Cache-busted `style.css?v=72` / `app.js?v=72`; package.json `0.28.5`.
  - Updated DB `system_info.version` to `v0.28.5`.
  - Bumped version to `v0.28.5`.

### [2026-11-27 09:00:13 IST] - v0.28.4
- **Session:** Badge — Quality + Type Concatenation.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Badge me Quality field ki value ab Type ke saath concatenate ho kar dikhti hai: `PC 62 x 42` / `PC 62 x 58` (pehle sirf `62 x 42` tha).
  - Cache-busted `style.css?v=71` / `app.js?v=71`; package.json `0.28.4`.
  - Updated DB `system_info.version` to `v0.28.4`.
  - Bumped version to `v0.28.4`.

### [2026-11-27 08:50:54 IST] - v0.28.3
- **Session:** Real JPG Signature Integrated.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Admin ne apni handwritten signature `client/signature.jpg` (65 KB, verified) provide ki.
  - Badge me signature ab **real image** se draw hoti hai — aspect ratio preserve (100x52) taake signature distort na ho. Firm placeholder `[Admin1]` upar, signature middle, `Authorised Signatory` niche — right aligned.
  - Total Takha patch position cap kiya (max y=780) taake signatory block card ke andar rahe.
  - `cap sync android` chal kar signature.jpg Android assets me include kiya.
  - Cache-busted `style.css?v=70` / `app.js?v=70`; package.json `0.28.3`.
  - Updated DB `system_info.version` to `v0.28.3`.
  - Bumped version to `v0.28.3`.

### [2026-11-27 08:40:09 IST] - v0.28.2
- **Session:** Badge — Signature Image Support + Firm Placeholder.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Purana scribble signature **remove** kiya.
  - Bottom-right signatory block ab 3 layers: (1) `\${firmName} [Admin1]` placeholder, (2) **signature image** — `client/signature.jpg` se loaded, (3) `Authorised Signatory`.
  - Image preload: global `signatureImage` with `new Image()`; file na hone par lightweight placeholder line draw hoti hai.
  - Admin ko apni real signature JPG `client/signature.jpg` me rakhni hoti hai — instructions `docs/SIGNATURE.md` me.
  - Cache-busted `style.css?v=69` / `app.js?v=69`; package.json `0.28.2`.
  - Updated DB `system_info.version` to `v0.28.2`.
  - Bumped version to `v0.28.2`.

### [2026-11-27 08:28:39 IST] - v0.28.1
- **Session:** Badge — Tiny Scribble Signature + Corner Heading.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Signature "Admin1 Digital sign" ab **15px**, low-contrast, rotate ke saath aur **overlapping pen scribble strokes** ke saath — intentionally hard to read, real signature jaisa.
  - "Authorised Signatory" ab **outer grey box ke extreme bottom-right corner** (x=600, y=920) par, 13px gray.
  - Bale box lines 3 par cap kiye taake lower-right signature area free rahe.
  - Cache-busted `style.css?v=68` / `app.js?v=68`; package.json `0.28.1`.
  - Updated DB `system_info.version` to `v0.28.1`.
  - Bumped version to `v0.28.1`.

### [2026-11-27 08:15:14 IST] - v0.28.0
- **Session:** Badge — Human-Style Digital Signature.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - "Admin1 Digital sign" ko simple italic text se badal kar **handwritten signature style** me banaya: cursive font stack (Brush Script MT / Segoe Script / Snell Roundhand / cursive), 32px, dark blue, thoda rotate (-0.045 rad) natural tilt ke liye.
  - Signature ke saath **freehand starting loop** aur **wavy underline flourish** (bezier curves) add kiye — human pen stroke jaisa look.
  - "Authorised Signatory" heading waise hi niche right me.
  - Cache-busted `style.css?v=67` / `app.js?v=67`; package.json `0.28.0`.
  - Updated DB `system_info.version` to `v0.28.0`.
  - Bumped version to `v0.28.0`.

### [2026-11-27 08:07:05 IST] - v0.27.9
- **Session:** Badge — Bale Boxes + Digital Signatory.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Bale Numbers ab comma-separated text nahi — har bale number apne **hollow rectangle box** (gray outline) me, centered text; up to 10 bales ke liye 56px boxes, zyada ke liye 46px, dynamic multi-line layout.
  - Cyan "Bales" aur green "Total Takha" highlight rows ab dynamically position hote hain taake box lines ke saath overlap na ho; card height 600.
  - Bottom-right me "Authorised Signatory" placeholder + uske upar cursive signature text **"Admin1 Digital sign"** (italic bold Georgia, cyan).
  - Cache-busted `style.css?v=66` / `app.js?v=66`; package.json `0.27.9`.
  - Updated DB `system_info.version` to `v0.27.9`.
  - Bumped version to `v0.27.9`.

### [2026-11-27 07:53:18 IST] - v0.27.8
- **Session:** Badge — Bales Highlight Row Above Total Takha.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - "Bales" removed from the compact 8-field list and placed just above Total Takha as its own highlight row.
  - Bales row uses a **light cyan patch** (`#cffafe`) with cyan value text (`#0e7490`), output right-aligned like Total Takha.
  - Total Takha patch shifted down to y=780..840; separator/footer moved to 875/915 so nothing overlaps in 638x1011.
  - Cache-busted `style.css?v=65` / `app.js?v=65`; package.json `0.27.8`.
  - Updated DB `system_info.version` to `v0.27.8`.
  - Bumped version to `v0.27.8`.

### [2026-11-27 07:39:00 IST] - v0.27.7
- **Session:** Badge — Bales Gap + Bale Numbers Alignment.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Gap between "Bales" row and "Bale Numbers" label reduced (656 -> 640; ~34px from Bales baseline).
  - Bale Numbers values moved from x=44 to **x=240** — aligned with all other field values instead of sitting under the label. Two lines kept at y=640 / 678, bold 26px, maxWidth 350.
  - Total Takha block moved up (750..810), separator/footer shifted accordingly to use space cleanly.
  - Cache-busted `style.css?v=64` / `app.js?v=64`; package.json `0.27.7`.
  - Updated DB `system_info.version` to `v0.27.7`.
  - Bumped version to `v0.27.7`.

### [2026-11-27 01:54:08 IST] - v0.27.6
- **Session:** Badge — Minimal Field Spacing + Two-Line Bale Numbers.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Top 8 fields (Inward No ... Bales) render with compact 34px line spacing at 19px/22px fonts — no shrinking.
  - **Bale Numbers** moved out of the compact list into its own block using the previously empty lower space: label + bale values split into **two balanced lines** at bold 26px, full-width (550px) so 5-digit values stay clear and visible.
  - Total Takha placed in its own green highlight row below the bale lines.
  - Cache-busted `style.css?v=63` / `app.js?v=63`; package.json `0.27.6`.
  - Updated DB `system_info.version` to `v0.27.6`.
  - Bumped version to `v0.27.6`.

### [2026-11-26 23:23:13 IST] - v0.27.5
- **Session:** Inward Date Format + Badge Line Spacing.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - `getISTInwardDateTime()` ab date ko `DD-MM-YYYY` me return karta hai (hyphen ke saath), time 12-hour AM/PM waise hi. Verified: `26-11-2026 11:24:18 PM`.
  - Badge rows ki line spacing kam ki: normal step 52 -> 44, total row 76 -> 66; total-highlight box bhi chhota (70 -> 60).
  - Value column ko x=240, maxWidth=360 kiya taake lambi Bale Numbers list horizontally shrink na ho.
  - Card height 520, separator/footer upar shift (895 / 935) taake 638x1011 me clean fit.
  - Cache-busted `style.css?v=62` / `app.js?v=62`; package.json `0.27.5`.
  - Updated DB `system_info.version` to `v0.27.5`.
  - Bumped version to `v0.27.5`.

### [2026-11-26 21:36:33 IST] - v0.27.4
- **Session:** Badge — No Caption, Centered Headings, Firm Watermark.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - WhatsApp share caption removed (`waText = ''`) — badge image already carries all details; native bridge and Web Share send no extra text.
  - Firm name heading, "INWARD ENTRY" heading and footer tagline are now **center-aligned**; firm name font bumped to bold 32px.
  - Added faint diagonal **watermark** of the licensed firm name (`Hans Packing Firm`) across the badge.
  - Cache-busted `style.css?v=61` / `app.js?v=61`; package.json `0.27.4`.
  - Updated DB `system_info.version` to `v0.27.4`.
  - Bumped version to `v0.27.4`.

### [2026-11-26 21:23:22 IST] - v0.27.3
- **Session:** Badge — Tighter Header Gap + Much Larger QR.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header gap reduced further: brand baseline y=58, subhead baseline y=80 (22px gap).
  - QR enlarged from 140px to **200px**, anchored top-right (x=414, y=20) — stretches left and down into the empty header area. Header height 180 -> 240.
  - QR colour remains standard black (#000000).
  - Headings/card/rows shifted to fit 638x1011: firm y=270, INWARD ENTRY y=312, card y=330 h=590, rows start 374.
  - Cache-busted `style.css?v=60` / `app.js?v=60`; package.json `0.27.3`.
  - Updated DB `system_info.version` to `v0.27.3`.
  - Bumped version to `v0.27.3`.

### [2026-11-26 21:06:58 IST] - v0.27.2
- **Session:** Badge Header + QR Refinement.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Header gap reduced: brand "PACKING ORBIT" at y=60, subhead "Original Brand - License Protected" at y=88 (was 104), font 15px.
  - Header band height increased to 180px to accommodate a larger QR.
  - QR enlarged from 110px to **140px** at top-right (x=480, y=20); module colour changed to **standard black (#000000)** as requested.
  - Headings/card/rows shifted down slightly (firm y=228, INWARD ENTRY y=276, card y=300 h=624, rows start 348) so nothing overlaps within 638x1011.
  - Cache-busted `style.css?v=59` / `app.js?v=59`; package.json `0.27.2`.
  - Updated DB `system_info.version` to `v0.27.2`.
  - Bumped version to `v0.27.2`.

### [2026-11-26 20:46:16 IST] - v0.27.1
- **Session:** Badge Round Corners + Format Confirmation.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne bataya ki purane APK me dark theme dikha — likely v0.26.2 APK chal raha tha (v0.27.0 release available tha).
  - Badge me **rounded corners** add kiye (radius 28) — canvas ko rounded path se clip karke saara content (header, rows, footer) usi shape me draw hota hai.
  - 638x1011 px portrait, 300 DPI pHYs metadata, white background, dark-green header with white brand text — sab v0.27.0 se hai, is version me corners bhi.
  - Cache-busted `style.css?v=58` / `app.js?v=58`; package.json `0.27.1`.
  - Updated DB `system_info.version` to `v0.27.1`.
  - Bumped version to `v0.27.1`.

### [2026-11-26 19:55:32 IST] - v0.27.0
- **Session:** Badge Standard Format — 638x1011 px / 300 DPI / White Theme.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Badge canvas resized to standard portrait **638 x 1011 px** (300 DPI print size ~2.12 x 3.37 inch).
  - White background with light gray card border; colored header band (`#065f46`) with **white brand text** "PACKING ORBIT" + tagline; firm name and "INWARD ENTRY" headings follow below the header in dark text.
  - QR retained at header top-right (white box), adapted to 110px.
  - Added `pngWithDpi(blob, 300)` — injects PNG `pHYs` chunk (11811 px/m) with CRC32 so the exported PNG carries **300 DPI metadata**.
  - Same DPI-aware blob is used for native APK share (base64) and Web Share file.
  - Cache-busted `style.css?v=57` / `app.js?v=57`; package.json `0.27.0`.
  - Updated DB `system_info.version` to `v0.27.0`.
  - Bumped version to `v0.27.0`.

### [2026-11-26 17:21:57 IST] - v0.26.2
- **Session:** GitHub Actions APK Build — CI Fix.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - First APK workflow run (#1) failed at step **"Setup Android SDK"** (`android-actions/setup-android@v3`).
  - Fix: removed that action — GitHub `ubuntu-latest` runners already include Android SDK. Added job env `ANDROID_HOME=/usr/local/lib/android/sdk` + a debug step listing installed platforms.
  - Updated `package.json` version to `0.26.2`; DB `system_info.version` to `v0.26.2`.
  - Next: push updated workflow from Termux, re-run Actions (or push tag `v0.26.2`) to build APK.
  - Bumped version to `v0.26.2`.

### [2026-11-26 14:02:30 IST] - v0.26.1
- **Session:** Clarification — Local APK Mode vs Cloud/VPS Buyer Mode.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne yaad dilaya ki markdown me pehle se likha hai: APK + cloud/VPS chalana hai.
  - Clarification Section **11.9** me record kiya: Stage 1 = local APK mode (owner/testing, no hosting, direct WhatsApp image share); Stage 2 = cloud/VPS hosted mode (buyer firms, remote customers). Dono roadmap ke valid hisson hain, contradictory nahi.
  - Cache/code change nahi — sirf documentation aur DB version.
  - Updated DB `system_info.version` to `v0.26.1`.
  - Bumped version to `v0.26.1`.

### [2026-11-26 12:09:29 IST] - v0.26.0
- **Session:** APK — Local Assets Mode (No Hosting Needed).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: web par WhatsApp me customer search karna pad raha hai — application direct registered customer ko image share nahi kar raha.
  - **Spose clear:** ye web browser ki limitation hai; exact behavior (direct chat + image attach) sirf APK ke native bridge se hoga.
  - APK ko ab **local assets mode** mein chalaya jayega — `capacitor.config.json` se `server.url` hata diya (hosting ab zaroori nahi).
  - AndroidManifest me `android:usesCleartextTraffic="true"` (local HTTP API ke liye).
  - `client/app.js` me native fetch wrapper: jab `window.PackingOrbitNative` available ho to saare `/api/...` calls `http://127.0.0.1:3000` par bheji jate hain — aapke phone par chal rahe Node server se directly connect.
  - `docs/APK_BUILD.md` update: ab local-mode steps + server running requirement + GitHub Actions build.
  - Cache-busted `style.css?v=56` / `app.js?v=56`.
  - Updated DB `system_info.version` to `v0.26.0`.
  - Bumped version to `v0.26.0`.

### [2026-11-26 12:01:09 IST] - v0.25.9
- **Session:** Share — Download Removed, Image-Only Flow.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: badge image download nahi chahiye aur WhatsApp me sirf text nahi jana chahiye.
  - **Download aur clipboard/wa.me-text fallback hata diya** — ab koi file download nahi hoti.
  - Flow ab: native APK bridge (direct customer chat + image) → agar unavailable to Web Share API with image file (sirf image, text caption ke saath) → agar wo bhi na ho to clear alert ki APK chahiye.
  - Text-only `wa.me` share ab kabhi nahi hota.
  - Cache-busted `style.css?v=55` / `app.js?v=55`.
  - Updated DB `system_info.version` to `v0.25.9`.
  - Bumped version to `v0.25.9`.

### [2026-11-26 11:56:21 IST] - v0.25.8
- **Session:** APK Native WhatsApp Share — Project Setup.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne confirm kiya: direct customer chat me image attach karne ke liye **APK native share** banayein.
  - Capacitor 6 added (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`); `capacitor.config.json` (appId `com.packingorbit.app`, webDir `client`, server URL placeholder `https://app.packingorbit.in` — provider ready par badalna hai).
  - Native Android project generate (`android/`).
  - Custom `MainActivity.java` bridge `PackingOrbitNative.shareImageToWhatsApp(base64, phone, text)`: badge PNG cache me save, FileProvider URI, WhatsApp `ACTION_SEND` with `jid=<phone>@s.whatsapp.net` + `EXTRA_STREAM` + `EXTRA_TEXT`, `setPackage("com.whatsapp")` — **image seedhi usi customer chat me attach hoti hai, bina search**.
  - AndroidManifest me WhatsApp/WhatsApp Business package visibility (`<queries>`) add; FileProvider already tha.
  - Web JS: jab native bridge available ho to image base64 karke bridge ko bheji jati hai; warna web fallback (direct wa.me + clipboard/download) chal jata hai.
  - GitHub Actions `.github/workflows/build-apk.yml`: npm install → cap sync → JDK 17 + Android SDK → `./gradlew assembleDebug` → APK artifact + **tag par GitHub Release se direct download link**.
  - `npm run apk:sync` / `npm run apk:build` scripts added; `cap sync android` chal kar web assets android me copy kiye (bridge + qrcode.js verified).
  - **Local limitation:** is device par Java/Android SDK nahi — `.apk` yahan build nahi hota; GitHub Actions cloud me banega.
  - Cache-busted `style.css?v=54` / `app.js?v=54`.
  - Updated DB `system_info.version` to `v0.25.8`.
  - Bumped version to `v0.25.8`.

### [2026-11-26 11:45:40 IST] - v0.25.7
- **Session:** WhatsApp Share — No Search / Wrong-Recipient Risk Removed.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: share sheet me WhatsApp "send to" me search karna padta hai — galat customer ko inward share hone ka risk hai. Badge image bhi usi registered customer ke chat me attached honi chahiye.
  - **Web limitation recorded:** browser se kisi specific WhatsApp chat me image auto-attach karna possible nahi hai (`wa.me` sirf text deep link deta hai); Web Share API image attach karti hai par contact choose karna padta hai (search wala risk).
  - **Ab ka flow (search-free):** badge PNG generate → clipboard me copy + download backup → `https://wa.me/<registered customer mobile>?text=...` par **direct customer chat** khul jata hai. Admin ko bas long-press → paste (ya gallery se attach) karna hota hai — kisi aur ko bhejne ka risk nahi.
  - **Future (APK phase):** native Android intent me `jid` extra + `EXTRA_STREAM` se image directly specific chat me attach karna hoga — jab APK build karenge (Section 11 roadmap).
  - Cache-busted `style.css?v=53` / `app.js?v=53`.
  - Updated DB `system_info.version` to `v0.25.7`.
  - Bumped version to `v0.25.7`.

### [2026-11-26 11:41:27 IST] - v0.25.6
- **Session:** Badge Image Share Fix.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** User ko WhatsApp me sirf text gaya, badge image nahi dikhi — kyunki pehle direct `wa.me` text path ko priority di gayi thi aur native image share fallback ban gaya tha.
  - **Fix:** Native Web Share API (`navigator.share({ files: [file] })`) ko **primary** banaya — badge PNG WhatsApp me image ke saath attach ho kar jati hai. Share text me Inward No, Firm aur Customer ka naam hota hai.
  - Fallback (sirf tab jab browser image share support na kare): image clipboard + download + direct `wa.me` text, with clear alert.
  - Cache-busted `style.css?v=52` / `app.js?v=52`.
  - Updated DB `system_info.version` to `v0.25.6`.
  - Bumped version to `v0.25.6`.

### [2026-11-26 11:37:50 IST] - v0.25.5
- **Session:** Badge QR Position + Direct WhatsApp Chat Share.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne do changes maange: (1) QR badge ke **header top-right** mein ho, (2) image sharing bhi waise hi ho jaise text — **direct customer ke WhatsApp chat** me, search na karna pade.
  - QR drawing ko bottom se hata kar header (x=522, y=56, 150px) me shift kiya; caption "SCAN ME"; badge canvas chhota karke 720x1010 kiya.
  - Share flow ab `navigator.share` (system sheet) use nahi karta — iske bajaye:
    - Badge PNG ko clipboard me copy karta hai (`ClipboardItem`, jahan support ho),
    - Backup ke liye image download karta hai,
    - `https://wa.me/<customer mobile>?text=...` par direct kholta hai — customer ka chat seedha open, search nahi.
  - Alert: "Badge image copy ho gayi — WhatsApp me long-press karke paste karein."
  - Cache-busted `style.css?v=51` / `app.js?v=51`.
  - Updated DB `system_info.version` to `v0.25.5`.
  - Bumped version to `v0.25.5`.

### [2026-11-26 11:27:15 IST] - v0.25.4
- **Session:** Inward Badge — Per-Record QR Code.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: har inward record ka usi record ke according QR generate ho aur woh QR badge mein bhi aaye jo share kar rahe hain.
  - Vendored offline QR library `client/qrcode.js` (qrcode-generator v2.0.4) — CDN par depend nahi; `<script src="qrcode.js?v=1">` app.js se pehle load.
  - Badge canvas ab 720x1240; QR block white box me draw hota hai with quiet zone, caption "Scan QR for inward details".
  - QR data (per record): brand, firm name, Inward No, Date & Time, Customer + mobile, Code, Token, Bales + Bale Numbers, Total Takha.
  - QR generate fail hone par badge bina QR ke ban jata hai (try/catch), share block nahi hota.
  - Cache-busted `style.css?v=50` / `app.js?v=50`; navi library `qrcode.js?v=1`.
  - Updated DB `system_info.version` to `v0.25.4`.
  - Bumped version to `v0.25.4`.

### [2026-11-26 11:19:25 IST] - v0.25.3
- **Session:** Inward Share — Image Badge (Non-Editable).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: WhatsApp par text nahi, **non-editable image format** (badge) chahiye.
  - Canvas-based `buildInwardBadgeCanvas(e)` banaya — 720x980 PNG badge: Packing Orbit brand + firm name + Inward No, Date & Time, Customer, Mobile, Code, Token, Quality, Bales, Bale Numbers, Total Takha highlight + "Original Brand - License Protected" footer.
  - Share handler ab PNG blob banata hai aur `navigator.share({ files: [file] })` se WhatsApp share sheet me image bhejta hai (mobile Chrome par supported).
  - Fallback: image download + WhatsApp khol kar short text (purana behavior backup ke liye).
  - Buttons: "Share Badge" (list) aur "Share Image Badge" (new inward result).
  - Cache-busted `style.css?v=49` / `app.js?v=49`.
  - Updated DB `system_info.version` to `v0.25.3`.
  - Bumped version to `v0.25.3`.

### [2026-11-26 11:16:17 IST] - v0.25.2
- **Session:** WhatsApp Share — Firm Name Added.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: WhatsApp message me sirf brand "Packing Orbit" dikhta hai, packing firm ka naam nahi aata.
  - Share message me ab `Firm: <currentUser.firmName>` line add ki gayi (session se restore bhi hoti hai). Brand name "Packing Orbit" permanently bana rahe.
  - Cache-busted `style.css?v=48` / `app.js?v=48`.
  - Updated DB `system_info.version` to `v0.25.2`.
  - Bumped version to `v0.25.2`.

### [2026-11-26 11:11:18 IST] - v0.25.1
- **Session:** Inward — WhatsApp Share (Old + New Records).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: inward record (purana bhi aur naya bhi) admin apne mobile se customer ko WhatsApp par share karega.
  - **Frontend:** Saved Inward Entries table me **Share** button (har purane record ke liye) + naye inward save hone par result box me **Share on WhatsApp** button.
  - Share handler `shareInwardOnWhatsApp(id)` — entry se message banata hai (Inward No, Date & Time, Customer, Code, Token, Quality, Bales, Bale Numbers, Total Takha) aur `https://wa.me/<customer mobile>?text=...` kholta hai — message admin ke WhatsApp se bheja jata hai.
  - Customer mobile se country code handle: 10-digit → `91` prepend; already `91...` → as-is.
  - Naye record ke liye temporary cache entry bhi banayi taake share turant kaam kare (list refresh se pehle bhi).
  - Cache-busted `style.css?v=47` / `app.js?v=47`.
  - Updated DB `system_info.version` to `v0.25.1`.
  - Bumped version to `v0.25.1`.

### [2026-11-26 11:04:04 IST] - v0.25.0
- **Session:** Firm Registered Customer — Edit / Alter (Admin).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Check:** pehle verify kiya — customer add (`/api/admin/customers/register`) aur list tha, par **edit/alter nahi tha**.
  - **Backend:** nayi admin-only API `POST /api/admin/customers/update` — customer firm-scoped; mobile (10-digit), party name, optional PIN (4-6 digit, blank = unchanged); duplicate mobile check; updates `users.identifier/full_name/party_name/password_hash`.
  - **Frontend:** Firm Customers table me **Edit** button + naya `#editCustomerModal` (Mobile / Party Name / PIN with blank=unchanged); save par list refresh; PIN admin view me dikhta rahe.
  - **Verified:** party name update → 200; same PIN se customer login → 200 (PIN unchanged); duplicate/role guards; test change wapas original restore kiya.
  - Cache-busted `style.css?v=46` / `app.js?v=46`.
  - Updated DB `system_info.version` to `v0.25.0`.
  - Bumped version to `v0.25.0`.

### [2026-11-26 10:52:29 IST] - v0.24.3
- **Session:** Inward No. — Serial Instead Of Random.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: `IN-DATE-XXXX` me jo trailing random numbers hain woh **serial** mein hone chahiye.
  - `generateInwardNo()` ab `IN-DDMMYYYY-0001`, `0002`, ... generate karta hai — **per-date serial**, 4-digit zero-padded. Har naye din serial `0001` se shuru.
  - Purane random-suffix inward numbers (jaise `...24EB`) ignore kiye jate hain (sirf pure numeric suffix count hote hain).
  - **Verified:** do lagataar inward → `IN-26112026-0001`, `IN-26112026-0002` ✅; test entries cleanup.
  - Cache-busted `style.css?v=45` / `app.js?v=45`.
  - Updated DB `system_info.version` to `v0.24.3`.
  - Bumped version to `v0.24.3`.

### [2026-11-26 10:47:45 IST] - v0.24.2
- **Session:** Inward No. & Date-Time Format.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: Inward number me date **DDMMYYYY** aur date/time me date **DDMMYYYY** + time **12-hour AM/PM** format chahiye.
  - `generateInwardNo()` ab `IN-DDMMYYYY-XXXX` generate karta hai (pehle `IN-YYYYMMDD-XXXX` tha).
  - Naya `getISTInwardDateTime()` — `DDMMYYYY hh:mm:ss AM/PM` (IST), sirf inward entries ke liye; dusre timestamps (login logs) unchanged.
  - Form label update: "Date &amp; Time (DDMMYYYY, AM/PM)"; saved list me bhi yahi format dikhta hai.
  - **Verified:** `IN-26112026-EBE2`, `26112026 10:48:35 AM` ✅; test entry cleanup.
  - Cache-busted `style.css?v=44` / `app.js?v=44`.
  - Updated DB `system_info.version` to `v0.24.2`.
  - Bumped version to `v0.24.2`.

### [2026-11-26 10:42:56 IST] - v0.24.1
- **Session:** Total Takha — Read-Only Incremental Text Box.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: "Takha per bale" dikhane ki zarurat nahi; **Total Takha** inward form me **non-editable text box** me ho, aur bale number enter karte hi increasing mode me badhe (1st bale = 13/10, 2nd = 26/20...).
  - Form se "Takha per bale" line hata di; ab sirf **Total Takha** readonly text box (`#inwardTotalTakhaInput`) dikhta hai.
  - Har bale row add/remove aur quality select par `total = takha_per_bale × bale count` turant update hota hai (cumulative).
  - Saved Inward Entries table se bhi **Takha/Bale** column hata diya; **Total Takha** column bana rahe.
  - Cache-busted `style.css?v=43` / `app.js?v=43`.
  - Updated DB `system_info.version` to `v0.24.1`.
  - Bumped version to `v0.24.1`.

### [2026-11-26 10:35:18 IST] - v0.24.0
- **Session:** Inward — Total Takha From Ledger + Token Column.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: Ledger Create me quality-wise har bale ke takha record hain — bales × takha = **Total Takha** aana chahiye; table me **Token** column nahi hai; har inward no ka total takha bhi dikhe.
  - **Database:** `inward_entries` me `takha_per_bale` aur `total_takha` columns (migration).
  - **Backend:** `/api/inward/options` ab `takha_bales` bhi return karta hai; `POST /api/inward/add` ledger entry (firm/customer/code/token/type/quality) se `takha_bales` dhund kar `total_takha = takha_per_bale × bale count` compute aur save karta hai.
  - **Frontend:** Form me live summary box — *Takha per bale: 13 | Total Takha: 4 × 13 = 52* (bale count badalne par update). Saved Inward Entries table me **Token**, **Takha/Bale**, **Total Takha** columns add (ab 9 columns).
  - **Verified:** RS-SSG / Noori / PC / 62 x 42 → takha_per_bale 13, 4 bales → total 52 ✅; list me dono values dikhi; test entry cleanup (purani user entry safe).
  - Cache-busted `style.css?v=42` / `app.js?v=42`.
  - Updated DB `system_info.version` to `v0.24.0`.
  - Bumped version to `v0.24.0`.

### [2026-11-26 10:26:13 IST] - v0.23.4
- **Session:** Bale Inputs — Smaller Fixed Size.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: bale number 1 se 5 digit ka hota hai, isliye input box abhi bhi bada hai — chhota karein.
  - `#inwardBaleRows` ko flex-wrap banaya; har bale input ab fixed **68px** chauda, center-aligned, compact padding/font.
  - Isse ek line mein bahut saare (8-10) bale boxes aa jate hain — 30 bales bhi 3-4 lines mein.
  - Remove button bhi chhota; input `maxlength` 30 se **12** kiya (client + server dono jagah).
  - Cache-busted `style.css?v=41` / `app.js?v=41`.
  - Updated DB `system_info.version` to `v0.23.4`.
  - Bumped version to `v0.23.4`.

### [2026-11-26 10:23:00 IST] - v0.23.3
- **Session:** Bale Input Grid — Compact Form.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: ek bale number ke liye input box bada hai — ise 4-5 part me divide karein taake form lamba na ho.
  - `#inwardBaleRows` ko CSS grid banaya: desktop par **5 bale inputs per row**, tablet par 3, mobile par 2.
  - Bale inputs compact kiye (padding/font chhota), remove button bhi chhota; placeholder chhota karke `Bale 1`, `Bale 2`... rakha.
  - Enter / comma fast-mode aur max 30 cap waise hi kaam karte hain.
  - Cache-busted `style.css?v=40` / `app.js?v=40`.
  - Updated DB `system_info.version` to `v0.23.3`.
  - Bumped version to `v0.23.3`.

### [2026-11-26 10:19:23 IST] - v0.23.2
- **Session:** Bale Input — Mobile Numeric Keyboard.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: mobile par bale number ka keyboard number format me aana chahiye.
  - Bale inputs (initial row, dynamically added rows, post-save reset row) me `inputmode="numeric"` lagaya — mobile par numeric keypad khulega.
  - `type="text"` rakha gaya aur `pattern` nahi lagaya, taake alphanumeric bale numbers (jaise `RS-SSG-1`) bhi enter kiye ja saken.
  - Cache-busted `style.css?v=39` / `app.js?v=39`.
  - Updated DB `system_info.version` to `v0.23.2`.
  - Bumped version to `v0.23.2`.

### [2026-11-26 10:16:17 IST] - v0.23.1
- **Session:** Inward Bale Entry — Fast Mode.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Har bale number ke baad "+ Add Bale" button dabana pad raha tha — slow entry.
  - **Fix (Fast Mode):**
    - Bale input me **Enter** dabate hi nayi bale row add ho jati hai aur focus usi par chala jata hai.
    - Ek input me **comma-separated** bale numbers likhne (`1,2,3,4`) par turant alag-alag rows ban jati hain.
    - Submit par bhi comma-separated values split karke alag bales me save hote hain.
  - Extracted reusable `addBaleRow(value)` helper; max 30 cap aur count badge untouched.
  - Cache-busted `style.css?v=38` / `app.js?v=38`.
  - Updated DB `system_info.version` to `v0.23.1`.
  - Bumped version to `v0.23.1`.

### [2026-11-26 10:11:45 IST] - v0.23.0
- **Session:** Inward Bale Numbers — Multi-Entry, Inward No. & Date/Time.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Single text box multiple bale numbers (e.g. Rashid Seth / RS-SSG ne 1,2,3,4 bale bheje) ke liye mushkil tha aur DB me store/retrieve karna kathin tha.
  - **Resolution:** Dynamic **bale rows** UI — har bale alag input (number ya alphanumeric, jaise `1` ya `RS-SSG-1`), **+ Add Bale** button, remove button, min 1 / max 30, count badge `N / 30`.
  - **Database:** new `inward_bales` table (inward_id FK, firm_id, bale_number) — har bale alag row; easy retrieve. `inward_entries` me `inward_no` + `inward_at` columns added (migration).
  - **Inward No.:** server-generated unique `IN-YYYYMMDD-XXXX`; **Date & Time (IST)** auto-save. Form par read-only result box me dikhayi jaati hain.
  - **Backend:** `POST /api/inward/add` ab `baleNumbers` array leta hai (1..30, unique, max 30 chars) + inward_no/inward_at generate karta hai; `GET /api/inward/list` entries ke saath bale array return karta hai.
  - **Frontend:** Inward page par **Saved Inward Entries** table (Inward No., Date & Time, Customer, Code, Bales count, Bale Numbers).
  - **Verified:** 4 bales (1,2,3,4) → 200 with `IN-20261126-D266`; list me saare 4 bales ✅; 31 bales → 400; duplicate → 400; test data cleanup.
  - Cache-busted `style.css?v=37` / `app.js?v=37`.
  - Updated DB `system_info.version` to `v0.23.0`.
  - Bumped version to `v0.23.0`.

### [2026-11-26 09:51:26 IST] - v0.22.1
- **Session:** Inward Dropdowns — Overlap / Selection Fix.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Inward form ke searchable dropdowns aapas mein overlap kar rahe the aur options select nahi ho rahe the.
  - **Root cause:** `.custom-select` sabka `z-index: 100` tha — khula hua dropdown apne agle sibling fields ke neeche paint hota tha, isliye click us option par nahi ja raha tha.
  - Fix: jis dropdown ka trigger open ho, uske wrapper ka `z-index = 1000` (close par reset); open options panel ko bhi `z-index: 1000`.
  - Option click par `e.stopPropagation()` taake dropdownTurbo close/other handlers select ko interrupt na karein.
  - `.ledger-form .custom-select-options` max-height 180px (compact, kam overlap); disabled option par `pointer-events: none`.
  - Cache-busted `style.css?v=36` / `app.js?v=36`.
  - Updated DB `system_info.version` to `v0.22.1`.
  - Bumped version to `v0.22.1`.

### [2026-11-26 09:44:43 IST] - v0.22.0
- **Session:** Inward Entry Module — Searchable Dropdowns + Bale Numbers.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Fields (all required):** 1) Register Customer Name — searchable dropdown from firm's registered customers; 2) Customer Code — searchable dropdown from Ledger Create data; 3) Token; 4) Type; 5) Quality — all searchable dropdowns, dependent on previous selection; 6) **Bale Numbers** (new) — 1 bale = 1 inward, max **30** at a time.
  - **Database:** new `inward_entries` table (firm_id, customer_id, customer_code, token, type, quality, bale_numbers CHECK 1..30, created_by, created_at).
  - **Backend (Admin + Employee):**
    - `GET /api/inward/customers?firmId=` — registered customers (mobile + party name only, **no PIN**).
    - `GET /api/inward/options?firmId=&customerId=` — codes/tokens/types/qualities derived from `ledger_entries` (Ledger Create database) + raw rows for dependent filtering.
    - `POST /api/inward/add` — validates all fields + bale range 1..30 + firm/customer binding.
  - **Frontend:** Inward placeholder replaced by real form; generic `makeInwardDropdown()` searchable dropdown controller; dependent filtering code → token → type → quality.
  - **Verified:** admin options from ledger data ✅; add 5 bales → 200; 31 bales → 400; employee login can add inward ✅; no auth → 403; test entries cleaned.
  - **Fix:** repaired `db.js` SQL (transports table was left unterminated when inward_entries was inserted).
  - Cache-busted `style.css?v=35` / `app.js?v=35`.
  - Updated DB `system_info.version` to `v0.22.0`.
  - Bumped version to `v0.22.0`.

### [2026-11-26 09:06:26 IST] - v0.21.0
- **Session:** Transportation Detail — Add Transport (Outward).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User requested: Admin Control Panel mein Outward requirements ke liye **Transportation Detail** aur **Transport Add** option.
  - **Database:** new `transports` table (firm_id, name, mobile, vehicle_no, gstin, address, is_active, created_by, created_at) with firm-scoped FK.
  - **Backend (admin-only):**
    - `GET /api/admin/transports?firmId=` — firm ke transports list.
    - `POST /api/admin/transports/add` — add transport; validates transport name + 10-digit mobile, firm active; firm-scoped.
  - **Frontend:** Admin Control Panel mein naya collapsible card **Transportation Details (Outward)** with **+ Add Transport** button, add modal (name, mobile, vehicle no, GSTIN, address), aur list table (Transport Name, Mobile, Vehicle No., GSTIN, Address). Panel khulte hi list refresh.
  - **Verified:** add → 200 with saved transport; list → 200; no auth → 403; test transport cleaned.
  - Cache-busted `style.css?v=34` / `app.js?v=34`.
  - Updated DB `system_info.version` to `v0.21.0`.
  - Bumped version to `v0.21.0`.

### [2026-11-26 08:58:39 IST] - v0.20.1
- **Session:** Inward / Outward Access — Admin + Employee.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: Inward aur Outward ka access **Admins aur Employees (Labour)** dono ko hona chahiye.
  - `syncOpsNavItems()` ab dono roles (`admin`, `employee`) ke liye nav items dikhata hai; customer/logout par hide.
  - `switchTab()` guard update: Inward/Outward sirf admin/employee ke liye; Ledger apne aap admin-only rahega.
  - Cache-busted `style.css?v=33` / `app.js?v=33`.
  - Updated DB `system_info.version` to `v0.20.1`.
  - Bumped version to `v0.20.1`.

### [2026-11-26 08:55:43 IST] - v0.20.0
- **Session:** Inward / Outward Placeholder Menus Added.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User requested: Dashboard sidebar mein **Ledger ke baad aur Pricing se pehle** do placeholder menus — **Inward** aur **Outward**.
  - Added `#inwardPage` aur `#outwardPage` Coming Soon placeholder pages (Back to Home), with inward/outward icons.
  - Added `syncOpsNavItems()` — admin-only dynamic nav entries, inserted after Ledger and before Pricing; removed on logout/non-admin login.
  - Sidebar order (admin): Dashboard → Ledger (sub-menus) → Inward → Outward → Pricing → Admin Control Panel.
  - `switchTab()` pageMap/hide lists + admin guard extended to Inward/Outward; renderAppUI reset list updated.
  - Cache-busted `style.css?v=32` / `app.js?v=32`.
  - Updated DB `system_info.version` to `v0.20.0`.
  - Bumped version to `v0.20.0`.

### [2026-11-26 08:33:35 IST] - v0.19.0
- **Session:** Ledger Edit/Delete — Child Record Checks.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** User ne kaha: Edit/Alter ke baad us ledger ke under maujood records usi updated ledger ke under rahein; aur Delete karne se pehle database search ho — agar ledger ke andar records hain to delete block ho.
  - **Database:** new `ledger_records` table (firm_id, ledger_id FK → ledger_entries, note, created_at).
  - **Backend (admin-only):**
    - `GET /api/admin/ledger` ab har entry ke saath `record_count` return karta hai.
    - `POST /api/admin/ledger/update`: pehle ledger ke records count karta hai; edit ke baad sab records usi updated ledger (firm) se linked rehte hain; response message mein record count batata hai.
    - `POST /api/admin/ledger/delete`: pehle `ledger_records` search — agar records hain to **409** with message *"Yeh ledger delete nahi ho sakta — iske andar X record(s) maujood hain."*; nahi hone par hi delete.
    - `POST /api/admin/ledger/records` (add), `GET /api/admin/ledger/records` (list), `POST /api/admin/ledger/records/delete` (remove) — records manage karne ke liye.
  - **Frontend:** Edit/Delete tables mein **Records** count column; Edit page par **+ Record** aur **Records (N)** buttons (add/list/delete); Delete button tabhi dikhta hai jab records = 0; client-side pre-check bhi.
  - **Verified:** record add → edit message "1 records... isi updated ledger ke under" → delete with records **409 blocked** → record delete → ledger delete **200**.
  - Cache-busted `style.css?v=31` / `app.js?v=31`.
  - Updated DB `system_info.version` to `v0.19.0`.
  - Bumped version to `v0.19.0`.

### [2026-11-26 08:22:13 IST] - v0.18.0
- **Session:** Ledger Edit / Alter + Delete Activated.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Backend (all admin-only, firm-scoped):**
    - `GET /api/admin/ledger?firmId=` — list ledger entries of that firm.
    - `POST /api/admin/ledger/update` — edit/alter a ledger entry (customer + code + token + type + quality + takha/bales), validates type whitelist, firm and customer binding.
    - `POST /api/admin/ledger/delete` — delete a ledger entry (firm check).
  - **Frontend:**
    - **Ledger > Edit / Alter** page now lists all Create entries with an **Edit** button per row; clicking opens a pre-filled form (searchable customer dropdown + all fields) → Save Changes updates DB.
    - **Ledger > Delete** page lists all entries with a **Delete** button + confirm dialog.
    - Lists auto-load when the respective page opens; edit form resets on page switch.
  - CSS: `.ledger-list-card` (max-width 900px), `.ledger-list`.
  - **Verified:** create → list → update (200) → delete (200) → list confirms removal; other firm entries untouched.
  - Cache-busted `style.css?v=30` / `app.js?v=30`.
  - Updated DB `system_info.version` to `v0.18.0`.
  - Bumped version to `v0.18.0`.

### [2026-11-26 08:08:47 IST] - v0.17.0
- **Session:** Ledger > Create — Real Form With Required Fields.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Database:** new `ledger_entries` table (firm_id, customer_id, mobile, party_name, customer_code, token, type [Cotton/Roti/PC], quality, takha_bales, created_by, created_at) with firm/customer FKs.
  - **Backend:** `POST /api/admin/ledger` — admin-only, validates all required fields, type whitelist, firm active, customer belongs to that firm and is active; stores mobile/party_name from the customer record (not trusted from client). Invalid type → 400, no auth → 403.
  - **Frontend:** `#ledgerCreatePage` placeholder replaced by a real form:
    1. **Customer** — searchable drop-down combining **Mobile Number — Party/Weaver Name**, loaded from that firm's registered customers, searchable by mobile or party name, sized to fit the card.
    2. **Customer Code** (required)
    3. **Token** (required)
    4. **Type** (required drop-down: Cotton / Roti / PC)
    5. **Quality** (required)
    6. **No. of Takha / Bales** (required number, min 1)
  - JS: `initLedgerCreateForm()`, `loadLedgerCustomers()`, `renderLedgerCustomerOptions()`; dropdown click-outside / Escape handling; form submit → `/api/admin/ledger`; customer list refreshed when the Create page opens.
  - CSS: `.ledger-create-card` (max-width 520px), `.ledger-form`, `.ledger-customer-options`, `.ledger-customer-search`, `.select-option.disabled`.
  - **Verified:** valid create → 200 with stored entry (mobile/party auto from customer); invalid type → 400; no auth → 403; test entry cleaned.
  - Cache-busted `style.css?v=29` / `app.js?v=29`.
  - Updated DB `system_info.version` to `v0.17.0`.
  - Bumped version to `v0.17.0`.

### [2026-11-26 07:53:17 IST] - v0.16.4
- **Session:** Ledger Sub-Menu Placeholders Added.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne Ledger menu ke 3 sub-menu placeholders maange: **Create**, **Edit / Alter**, **Delete**.
  - Ledger nav item ab expandable hai (default expanded) — nested `.nav-sublist` mein teeno sub-items **Soon** badge ke saath.
  - Teeno alag placeholder pages: `#ledgerCreatePage`, `#ledgerEditPage`, `#ledgerDeletePage` — har ek par "Coming Soon" + **← Back to Ledger** button.
  - `switchTab()` pageMap/hide lists update; admin guard ab `tab.startsWith('ledger')` par apply hota hai (sab Ledger pages + sub-menus sirf admins ke liye).
  - CSS: `.nav-sublist`, `.nav-subitem`, `.ledger-chevron` (rotate on expand).
  - Cache-busted `style.css?v=28` / `app.js?v=28`.
  - Updated DB `system_info.version` to `v0.16.4`.
  - Bumped version to `v0.16.4`.

### [2026-11-26 07:48:00 IST] - v0.16.3
- **Session:** Ledger — Admin-Only Access.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne kaha: Ledger aur uske **sub-menus** ka access sirf aur sirf admins ke paas rahega.
  - Ledger nav item ko `renderNavMenus()` se hata kar **dynamic `syncLedgerNavItem()`** banaya — sirf admin role par hi item add hota hai, warna remove.
  - Order maintain: **Dashboard → Ledger → Pricing → Admin Control Panel** (`insertBefore(pricingLi)`).
  - `switchTab('ledger')` par bhi guard: non-admin direct call/hash se bhi Ledger page nahi khul sakta (home par redirect).
  - RenderAppUI (login/logout/auth change) par bhi sync call kiya gaya.
  - Future Ledger sub-menus bhi isi admin-only policy ke under rahenge.
  - Cache-busted `style.css?v=27` / `app.js?v=27`.
  - Updated DB `system_info.version` to `v0.16.3`.
  - Bumped version to `v0.16.3`.

### [2026-11-26 07:44:56 IST] - v0.16.2
- **Session:** Ledger Placeholder Menu Added.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User requested: Admin sidebar mein **Dashboard** aur **Pricing** ke beech ek placeholder **Ledger** menu banayein.
  - Added `ledger` nav item in `renderNavMenus()` — inserted after Dashboard, before Pricing — with a small **Soon** badge.
  - Added `#ledgerPage` placeholder section ("Ledger — Coming Soon") with Back to Home button, same pattern as Download/Help pages.
  - Added `ledger` to `switchTab()` pageMap, hide lists, and `renderAppUI` reset list.
  - Added `.nav-soon` badge CSS.
  - Cache-busted `style.css?v=26` / `app.js?v=26`.
  - Updated DB `system_info.version` to `v0.16.2`.
  - Bumped version to `v0.16.2`.

### [2026-11-25 22:07:36 IST] - v0.16.1
- **Session:** Customer Login Testing Guide Documentation.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne customer login test karne ka tarika pucha; poora step-by-step process samjhaya gaya.
  - Testing guide ko **Section 12** mein record kiya: admin se customer register, PIN note karna, logout (session restore ki wajah se zaroori), customer login (firm select + mobile + PIN), expected result, negative tests.
  - Koi code change nahi kiya gaya — sirf documentation.
  - Updated DB `system_info.version` to `v0.16.1`.
  - Bumped version to `v0.16.1`.

### [2026-11-25 21:55:48 IST] - v0.16.0
- **Session:** Step 1 — Firm Customer Registration Redesign (Implemented).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Database:** `users.firm_id` column re-added via lightweight migration (customer bound to licensed firm).
  - **Backend:**
    - `POST /api/admin/customers/register` — **admin-only**; takes mobile + optional party name + firmId, generates a **6-digit PIN via `crypto.randomInt`**, stores it in `users.password_hash`, returns PIN to admin. Duplicate mobile → 400.
    - `GET /api/admin/customers?firmId=` — **admin-only**; customer list with firm name and **PIN visible to admin**.
    - Login hardening: a `customer` user can log in **only with its own firm** (cross-firm login → 403).
  - **Frontend (Admin Control Panel):**
    - **+ Register Customer** button in Firm & License Management card.
    - Modal with mobile, optional party name, licensed firm (read-only); PIN auto-generated by server.
    - Customer list table with Login ID, Party, Firm, **PIN (Admin View)**, Status; loads when panel opens or after registration.
  - **Verified:** admin login 200; register customer 200 with generated PIN; admin list shows PIN; customer login with generated PIN 200; cross-firm customer login 403; duplicate mobile → 400; test data cleaned.
  - Cache-busted `style.css?v=25` / `app.js?v=25`.
  - Updated DB `system_info.version` to `v0.16.0`.
  - Bumped version to `v0.16.0`.

### [2026-11-25 21:37:47 IST] - v0.15.3
- **Session:** Customer PIN Policy — Auto-Generated & Admin-Visible.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne final PIN policy decide kiya: PIN system auto-generate karega, DB mein save rahega, admin usko dekh kar customer ko de sakta hai.
  - Koi forgot-password / reset-password logic ya customer-facing reset portal **nahi** banayenge.
  - Decision Section **11.8** mein record kiya.
  - Updated DB `system_info.version` to `v0.15.3`.
  - Bumped version to `v0.15.3`.

### [2026-11-25 21:23:41 IST] - v0.15.2
- **Session:** Customer Registration Authority — Banking-Style Decision.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne suggestion diya: customer khud kabhi login create nahi karta — banking system ki tarah **sirf license holder firm ka Admin** customer ko register karega.
  - Koi document request/collect nahi hoga; **sirf mobile number** kaafi hai.
  - **Mobile number = customer login ID**; PIN/password admin set karega ya system generate karega.
  - Self-registration / public customer signup **kabhi nahi** hoga.
  - Decision Section **11.7** mein record kiya; pending decisions list update.
  - Updated DB `system_info.version` to `v0.15.2`.
  - Bumped version to `v0.15.2`.

### [2026-11-25 21:17:03 IST] - v0.15.1
- **Session:** Architecture Discussion Logged — Multi-Firm Tenancy / Cloud / APK.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - User ne poore discussion ko continuity markdown mein record karne ka instruction diya.
  - Record kiye gaye core decisions:
    1. **Customer = licensed packing firm ka customer** — Packing Orbit license holder firm se juda hota hai, kisi doosri firm ka nahi.
    2. Har licensed firm ek **tenant** hai; uska customer data doosri firm ko nahi dikta (firm-scoped data isolation).
    3. Firm ka customer apne mobile par app tab chalayega jab server cloud/VPS par hosted ho (abhi server user ke phone par hai — customer se reachable nahi).
    4. User ne **Option 3 (Android APK — direct link)** pasand kiya.
    5. APK ke liye cloud/VPS paid provider baad mein lenge; tabhi APK hosted URL ka wrapper banega.
    6. Poori baki development abhi se **cloud + APK ready** soch kar karni hai.
  - Development order (agreed): Customer Registration redesign → Customer screen → cloud-deploy readiness → WebView/PWA tweaks → APK wrapper + GitHub Actions → Phase 5 workflow.
  - Added new **Section 11** with the full architecture discussion and decision log.
  - Updated DB `system_info.version` to `v0.15.1`.
  - Bumped version to `v0.15.1`.

### [2026-11-25 20:59:22 IST] - v0.15.0
- **Session:** Firm Customer Registration — Full Removal (Pending Redesign).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **User decision:** Firm Customer Registration ko backend, database aur frontend se poora remove karna hai; baad mein discuss karke dobara develop karenge.
  - **Database:** `users.firm_id` column DROP kiya; db.js se migration line remove ki.
  - **Backend:** `/api/customers/register` aur `/api/admin/customers` endpoints remove kiye; `getAuthUser()` se `u.firm_id` wapas hataya. (Pre-existing `/api/admin/clear-test-customers` aur customer role yun hi rakhe gaye.)
  - **Frontend:** Login form se tabs + customer registration panel, Firm card se **+ Register Customer** button aur customer list, `registerCustomerModal`, unke JS handlers (`initLoginTabs`, customer registration) aur CSS (`.login-tabs`, `.login-tab`) sab remove kiye.
  - Cache-busted `style.css?v=24` / `app.js?v=24`.
  - Updated DB `system_info.version` to `v0.15.0`.
  - Bumped version to `v0.15.0`.

### [2026-11-25 16:54:42 IST] - v0.14.1
- **Session:** Login Form Fix — Customer Panel Outside Form.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Admins/employees login blocked after the customer registration tab was added.
  - **Root cause:** Hidden `required` inputs of `#customerRegistrationPanel` lived **inside** `#mainLoginForm` and could block native form validation/submission.
  - Moved `#customerRegistrationPanel` **outside** the `<form>` (sibling) with `type="button"` register action; removed `required` attrs.
  - Added explicit JS validation (10-digit mobile, party name, PIN) in `doRegisterCustomerFromLogin()`.
  - Verified backend login API for admin + employee (HTTP 200) with firm context.
  - Cache-busted `style.css?v=23` / `app.js?v=23`.
  - Updated DB `system_info.version` to `v0.14.1`.
  - Bumped version to `v0.14.1`.

### [2026-11-25 16:42:27 IST] - v0.14.0
- **Session:** Customer Registration — Remove Admin-Only Gate.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** "Only Admins can register customers" error aata tha jabki license firm / complete app customer ke apne mobile device par chalne par registration allowed hona chahiye.
  - `/api/customers/register` se admin-only (401/403) check **remove** kar diya — ab app ka user/license holder customer register kar sakta hai.
  - Firm binding (`firmId`) optional rakha gaya; customer us firm se link hota hai.
  - Duplicate mobile handling (UNIQUE) restore kiya.
  - Verified: POST bina auth ke register success (HTTP 200), test customer DB se hata diya gaya.
  - Updated DB `system_info.version` to `v0.14.0`.
  - Bumped version to `v0.14.0`.

### [2026-11-25 16:19:52 IST] - v0.13.0
- **Session:** Firm Customer Registration Tab — Login Form.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **User Suggestion:** Customer Registration ko application ka **login form mein ek Tab** — **"Firm Customer Registration"** — mein develop karna hai.
  - Added **Login / Firm Customer Registration** tabs inside `#mainLoginForm` (`#loginTabs`, `#loginTabContent`, `#customerRegistrationPanel`).
  - Tab switch: Login tab → login content; Firm Customer Registration tab → customer registration panel (Licensed Firm text + Mobile + Party + PIN + Register button).
  - Register button (`#cRegisterCustomerBtn`) calls existing admin-only `/api/customers/register` with firm binding.
  - Cache-busted `style.css?v=22` / `app.js?v=22`.
  - Updated DB `system_info.version` to `v0.13.0`.
  - Bumped version to `v0.13.0`.

### [2026-11-25 15:32:31 IST] - v0.12.0
- **Session:** Customer Registration — Admin / License Holder.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** User asked to develop Customer Registration when admin holds a lifetime paid license — admin (license holder) should register customers for their firm (own customers or another app's license holder's customers).
  - **Fix:** Added `firm_id` column to `users` table via lightweight migration (customers linked to licensed firms).
  - `/api/customers/register` now **admin-only** and accepts optional `firmId` (customer bound to licensed firm).
  - Added new admin-only endpoint `GET /api/admin/customers` (customer list with firm info).
  - Admin UI: **+ Register Customer** button in Firm & License Management card + `registerCustomerModal` (Mobile, Party Name, PIN) + registered customers list in Firm card.
  - Cache-busted `style.css?v=21` / `app.js?v=21`.
  - Updated DB `system_info.version` to `v0.12.0`.
  - Bumped version to `v0.12.0`.

### [2026-11-24 23:16:40 IST] - v0.11.0
- **Session:** Session Restore On Refresh — No Auto Logout.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** User login ke baad refresh ya scroll karne par application logout ho jati thi.
  - **Root cause:** App start par (`initMandatoryAuthGate`) seedha `sessionStorage.removeItem` + login gate dikha deta tha — refresh par bhi session clear ho jati.
  - Added silent session restore: on startup, `sessionStorage` se saved token uthao, `/api/auth/me` se validate karo, aur agar authenticated ho to `renderAppUI(user)` se restore karo (firm info bhi include).
  - Server `/api/auth/me` ab firmName/licenseType bhi return karta hai.
  - Cache-busted `style.css?v=20` / `app.js?v=20`.
  - Updated DB `system_info.version` to `v0.11.0`.
  - Bumped version to `v0.11.0`.

### [2026-11-24 23:10:15 IST] - v0.10.0
- **Session:** Firm Owner (Main Admin) Banner Removal + Logout Relocation.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** User asked to remove the "Firm Owner (Main Admin)" card from the page.
  - Removed the entire `#userActiveBanner` block (user banner with role, name, party, IST timestamp) from the protected dashboard.
  - Moved Logout into the logged-in header profile pill (`#userProfileHeaderPill` now contains the Logout button).
  - Switched logout handling to event delegation on `#authHeaderContainer` so the re-rendered button keeps working.
  - Removed now-unused banner references in `renderAppUI` (userBannerName/UserBannerSub/loginTimestampText/roleBadge).
  - Cache-busted `style.css?v=19` / `app.js?v=19`.
  - Updated DB `system_info.version` to `v0.10.0`.
  - Bumped version to `v0.10.0`.

### [2026-11-24 23:03:35 IST] - v0.9.0
- **Session:** Running Firm Text Trim + Licensing Font Size + Admin Panel Cleanup.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Admin cards visible in header/dashboard area; "Running Firm" label text before firm name; licensing text size not smaller than firm name.
  - **Fix:** Removed the "Running Firm:" label from the `#firmRunStatus` heading — now the green blinking dot + exact firm name + license-type badge.
  - Added `.license-summary` (0.7rem) and reduced `.firm-key-code` (0.66rem) for licensing/firm-key text, making licensing slightly smaller than the firm name.
  - Admin cards now render **only** inside the Admin Control Panel (opened via sidebar); dashboard entry card removed earlier.
  - Cache-busted `style.css?v=18` / `app.js?v=18`.
  - Updated DB `system_info.version` to `v0.9.0`.
  - Bumped version to `v0.9.0`.

### [2026-11-24 22:56:34 IST] - v0.8.0
- **Session:** Admin Control Panel — Moved To Left Sidebar.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Admin Control Panel ko dashboard ka card se **left sidebar menu** mein move kar diya.
  - Added dynamic `syncAdminNavItem()` — `currentUser.role === 'admin'` hone par hi sidebar nav mein **"Admin Control Panel"** item add hota hai.
  - Employees / customers / guests par item kabhi na dikhata (logout/login/auth state par auto add/remove).
  - `openAdminControlPanel()` mein role re-check (`admin` only) rakha gaya — employees/customers unhe panel nahi de sakte.
  - Dashboard par purana entry card (`#adminControlSection`) markup se remove kar diya gaya; panel page khulta hai via sidebar.
  - Existing admin APIs (`/api/admin/*`) pehle se hi server-side admin-only guard (401/403) rakhte hain.
  - Cache-busted `style.css?v=17` / `app.js?v=17`.
  - Updated DB `system_info.version` to `v0.8.0`.
  - Bumped version to `v0.8.0`.

### [2026-11-24 22:49:53 IST] - v0.7.9
- **Session:** Header Cleanup — Duplicate Pricing Button Removed.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Page header mein "Packing Orbit" heading aur Admin/login status ke beech ek extra **Pricing** button show ho raha tha.
  - Pricing already header tabs (Home/Download/Pricing/Help/Contacts) aur left sidebar menu mein available hai.
  - Removed the header Pricing button markup (`#headerPricingBtn`) from `client/index.html`.
  - Removed now-unused CSS: `.header-pricing-btn`, `.header-pricing-btn:hover`, and mobile overrides `.header-pricing-btn` / `.pricing-btn-label`.
  - `openPricingPage()` function retained (still used by sidebar/tabs navigation).
  - Cache-busted `style.css?v=16` / `app.js?v=16`.
  - Updated DB `system_info.version` to `v0.7.9`.
  - Bumped version to `v0.7.9`.

### [2026-11-24 22:43:34 IST] - v0.7.8
- **Session:** No-Cache Static Headers — Fresh UI On Every Reload.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Heading move ke baad bhi purana layout dikh raha tha kyunki browser HTML ko cache kar raha tha.
  - Static file server ab HTML ke liye `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` bhejta hai.
  - CSS/JS ke liye `Cache-Control: no-cache, must-revalidate, max-age=0` bhejta hai (query-busting ke saath).
  - `Pragma: no-cache` aur `Expires: 0` headers bhi added.
  - Verified: `#firmRunStatus` (line 346) → `#userActiveBanner` (354) → `#adminControlSection` (373).
  - Updated DB `system_info.version` to `v0.7.8`.
  - Bumped version to `v0.7.8`.

### [2026-11-24 22:42:21 IST] - v0.7.7
- **Session:** Running Firm Heading — Moved Above User Banner / Admin Card.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Running Firm heading "Firm Owner (Main Admin)" user banner ke neeche dikh rahi thi.
  - Moved `#firmRunStatus` heading to be the **first child** of `#protectedDashboard`, before the user-active-banner.
  - Order now: Running Firm heading → Firm Owner (Main Admin) banner → Admin Control Panel card.
  - No card/box styling; still a green blinking circle heading with firm name and license type.
  - Cache-busted `style.css?v=15` / `app.js?v=15`.
  - Updated DB `system_info.version` to `v0.7.7`.
  - Bumped version to `v0.7.7`.

### [2026-11-24 22:39:58 IST] - v0.7.6
- **Session:** Running Firm as Heading — No Card.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Removed the card/box styling from the Running Firm indicator (`background`, `border`, `padding`, `border-radius` all removed).
  - Changed the element from `<div>` to semantic `<h2>` heading.
  - Heading now sits **exactly above the Admin Control Panel card** (and above the labour/employee card for employees): green blinking circle + "Running Firm:" + firm name + license type badge.
  - Cache-busted `style.css?v=14` / `app.js?v=14`.
  - Updated DB `system_info.version` to `v0.7.6`.
  - Bumped version to `v0.7.6`.

### [2026-11-24 22:37:57 IST] - v0.7.5
- **Session:** Running Firm Indicator — Green Blinking Circle.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added `#firmRunStatus` bar inside the dashboard, placed **exactly above** the Admin Control Panel entry card and the Labour/Employee card section.
  - Shows a **green filled blinking circle** (`firm-run-dot`, `firmBlink` animation), "Running Firm:" label, selected firm name, and license-type badge (Owner/Testing/Lifetime).
  - Populated in `renderAppUI(user)` from `user.firmName` and `user.licenseType` returned by login.
  - Hidden automatically on logout / when no firm context exists.
  - Cache-busted `style.css?v=13` / `app.js?v=13`.
  - Updated DB `system_info.version` to `v0.7.5`.
  - Bumped version to `v0.7.5`.

### [2026-11-24 22:32:32 IST] - v0.7.4
- **Session:** Admin Control Panel — Panel Nesting Fix.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** `#adminControlPanelPage` dashboard ke andar nested tha, isliye `protectedDashboard` hide karne par panel bhi hide ho jata.
  - Fix: dashboard par `panel-open` class add/remove karke sirf dashboard chrome (user banner, entry card, stats) hide kiya jata hai; control panel full-page view mein dikhta hai.
  - Added CSS `#protectedDashboard.panel-open > .user-active-banner, > .admin-panel-section, > .labour-panel-section, > .stats-card { display:none !important; }`.
  - Back to Dashboard / Home tab / logout sab par `panel-open` class remove hoti hai.
  - Cache-busted `style.css?v=12` / `app.js?v=12`.
  - Updated DB `system_info.version` to `v0.7.4`.
  - Bumped version to `v0.7.4`.

### [2026-11-24 22:31:45 IST] - v0.7.3
- **Session:** Admin Control Panel — Single Entry Card, Three Admin Cards Inside.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Admin dashboard now shows only one **Admin Control Panel** entry card.
  - Entry card lists the three modules as badges: Labour Staff, Login Audit Logs, Firm & License.
  - Created a separate `#adminControlPanelPage` section containing the three existing developed cards (Labour Staff Management, User Login Audit Logs, Firm & License Management).
  - Added **Open Admin Control Panel →** button and **← Back to Dashboard** button.
  - `openAdminControlPanel()` hides dashboard, shows panel and refreshes all three datasets; `closeAdminControlPanel()` returns to dashboard.
  - Home tab / sidebar Dashboard click closes the panel via `switchTab('home')`.
  - Non-admin users never see the entry card or the panel.
  - Cache-busted `style.css?v=11` / `app.js?v=11`.
  - Updated DB `system_info.version` to `v0.7.3`.
  - Bumped version to `v0.7.3`.

### [2026-11-24 22:14:59 IST] - v0.7.2
- **Session:** Login Firm Selection — Active Paid License Required.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added a **Select Firm (Paid License)** custom dropdown as the first field on the login form.
  - Added public `GET /api/firms/active` returning only active firms (id, firm_name, license_type); license keys are never exposed.
  - Login request now includes `firmId`; server requires a valid active firm whenever active firms exist.
  - Suspended/expired firms are rejected at login.
  - Added `firm_id` and `firm_name` columns to `login_logs` via automatic lightweight migration; selected firm is saved with each login.
  - Login response returns `firmId`, `firmName`, `licenseType`; dashboard banner shows `| Firm: <name>`.
  - Firm dropdown refreshes after logout.
  - Cache-busted `style.css?v=10` / `app.js?v=10`.
  - Updated DB `system_info.version` to `v0.7.2`.
  - Bumped version to `v0.7.2`.

### [2026-11-24 22:02:57 IST] - v0.7.1
- **Session:** Modal Scroll Fix — Long Firm License Form.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** Create Firm & License form ka top portion screen se bahar cut ho raha tha; top fields visible/accessible nahi thin.
  - **Root cause:** `.modal-dialog-box` ki koi max-height nahi thi aur `.modal-backdrop` flex center kar raha tha, isliye lamba modal viewport se upar chala jata tha bina scroll ke.
  - Added `max-height: calc(100vh - 24px)` + `calc(100dvh - 24px)` fallback to `.modal-dialog-box`.
  - Added `overflow-y: auto`, `overscroll-behavior: contain` and `-webkit-overflow-scrolling: touch` for smooth internal scrolling.
  - Made `.modal-backdrop` scrollable as a safety net.
  - All firm form fields (Firm Name, Owner, Mobile, etc.) are now reachable; top never hidden.
  - Cache-busted `style.css?v=9` / `app.js?v=9`.
  - Updated DB `system_info.version` to `v0.7.1`.
  - Bumped version to `v0.7.1`.

### [2026-11-24 21:01:06 IST] - v0.7.0
- **Session:** Multi-Firm Licensing — Owner/Testing Free, Lifetime Paid, Permanent Brand Lock.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added `firms` table to `database/db.js` with firm profile, license type, license key, locked brand, fees, AMC due date and status.
  - Added admin-only APIs in `server/index.js`: `GET /api/admin/firms`, `POST /api/admin/firms`, `POST /api/admin/firms/toggle-status`.
  - License keys generated server-side only (`PO-XXXX-XXXX-XXXX`) with duplicate protection.
  - Owner and Testing license types are always **₹0 / free of charge** (fees forced to 0 server-side).
  - Brand permanence enforced: server ignores client brand and always stores `system_info.app_name` with `brand_locked = 1`.
  - Added **Firm & License Management** admin card with create form (validated: names, 10-digit mobile, email, license type, AMC date, duplicate mobile), brand-locked read-only field, and confirmation checkbox.
  - Added printable **License Copy / Certificate** modal showing licensed firm name, original Packing Orbit brand, license key, fees/AMC, issue date and non-transfer terms.
  - Added permanent non-removable footer: "Powered by Packing Orbit · Original Brand — License Protected".
  - Added suspend/activate action for firm licenses.
  - Cache-busted `style.css?v=8` / `app.js?v=8`.
  - Updated DB `system_info.version` to `v0.7.0`.
  - Bumped version to `v0.7.0`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 20:33:37 IST] - v0.6.9
- **Session:** Header Tabs Menu — Home / Download / Pricing / Help / Contacts.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added a tabs menu directly below the header (`<nav class="header-tabs" id="headerTabs">`) with 5 tabs: **Home, Download, Pricing, Help, Contacts**.
  - `switchTab(tab)` centralizes navigation: hides all pages, shows the requested one, updates the active tab, closes the sidebar, scrolls to top.
  - **Home** → login gate (logged out) or dashboard (logged in).
  - **Pricing** → existing Pricing page (reuses `openPricingPage()`).
  - **Download / Help** → styled placeholder pages with "Coming Soon" badge and Back to Home button.
  - **Contacts** → contact card showing phone and email pulled from `PRICING_CONFIG` (editable), plus Malegaon location.
  - Sidebar nav items now call `switchTab('home')`; auth state changes reset to the Home tab.
  - Tabs are horizontally scrollable on mobile; sidebar `top` offset changed from `53px` to `96px` for the taller sticky header.
  - Cache-busted `style.css?v=7` and `app.js?v=7`.
  - Updated DB `system_info.version` to `v0.6.9`.
  - Bumped version to `v0.6.9`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 20:24:13 IST] - v0.6.8
- **Session:** Pricing Page — Lifetime License + Annual AMC (Sellable to Malegaon Cluster Firms).
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added a **Pricing** button in the header (`#headerPricingBtn`), visible to all users (logged out and logged in).
  - Created a standalone `#pricingPage` section inside the main viewport with:
    - Lifetime Subscription card (one-time license, feature list).
    - Annual AMC card (per-year maintenance/support, feature list).
    - Renewal note clarifying lifetime = one-time and AMC = yearly.
    - Contact / WhatsApp CTA for quotation.
  - Prices are configurable via `PRICING_CONFIG` at the top of `client/app.js` (lifetimePrice, amcPrice, contactPhone, contactTel, contactWhatsApp) — currently placeholders until final rates are decided.
  - `openPricingPage()` / `closePricingPage()` hide/show login gate or dashboard and restore the correct view via Back button.
  - Added a Pricing item to the sidebar navigation (appended dynamically in `renderNavMenus`).
  - Responsive: pricing grid switches to single column below 700px; header Pricing label hides below 480px (icon only).
  - Cache-busted `style.css?v=6` and `app.js?v=6`.
  - Updated DB `system_info.version` to `v0.6.8`.
  - Bumped version to `v0.6.8`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 20:05:58 IST] - v0.6.7
- **Session:** Header — Live Blinking Status Restored on Login/Landing Page.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Issue:** The blinking **Live** indicator disappeared from the main/landing/login-page header.
  - **Root cause:** `renderAppUI(null)` in `app.js` overwrote `#authHeaderContainer` innerHTML with only the "Protected" lock badge, removing the initial `.header-status` (Live dot + label).
  - Restored `.header-status` (pulsing green dot + "Live") inside the logged-out header markup, next to the "Protected" badge.
  - Added `#authHeaderContainer { display:flex; align-items:center; gap:0.3rem; }` to keep both badges aligned.
  - Cache-busted `style.css?v=5` and `app.js?v=5`.
  - Bumped version to `v0.6.7`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 19:56:01 IST] - v0.6.6
- **Session:** Header Root-Cause Fix — `.header-left` Selector Collision.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - **Root cause identified:** `.header-left` was defined twice in `style.css`. The later admin-card rule (`line ~681`) set `flex-direction: column; flex: 1;` and overrode the header's horizontal row layout, forcing the menu button/brand to stack and overlap the right-side badge.
  - Renamed the admin-card rule to `.admin-card-header .header-left` so it only applies inside admin cards.
  - Header `.header-left` now correctly remains a horizontal flex row: menu toggle + brand side-by-side on the left, badges on the far right.
  - Added `@media (max-width: 480px)` safety block: `header-left` shrinkable, brand font 0.9rem, tagline hidden, right badge max-width 55%, user name capped at 60px.
  - CSS link bumped to `style.css?v=4` for a guaranteed fresh load.
  - Bumped version to `v0.6.6`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:50:00 IST] - v0.6.5
- **Session:** Header Final Fix — Clean CSS, Cache Busting v3.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Rewrote header CSS completely — `header-container` has `padding: 0 0.5rem` + `box-sizing: border-box`, `header-left` and `header-right` both `flex-shrink: 0` with `gap: 0.5rem`/`0.3rem`.
  - `brand-group` max-width `130px`, brand-name `1rem` font size with `text-overflow: ellipsis`.
  - `justify-content: space-between` ensures left brand and right badges never overlap on any screen size.
  - CSS link bumped to `style.css?v=3` for fresh browser load.
  - Bumped version to `v0.6.5`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:45:00 IST] - v0.6.4
- **Session:** Header Final Fix — Cache Busting Added.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added `?v=2` version parameter to CSS link in index.html — forces browser to discard cached old CSS and load fresh styles.
  - Header CSS is now clean: `header-container` with `justify-content: space-between`, `header-left` with `flex-shrink: 0`, `brand-group` with `max-width: 180px` so "Packing Orbit" never expands into right-side badges.
  - "Packing Orbit" brand name stays on left (above menu toggle), "Protected" badge + "Live" + "No Active Session" stay on far right — zero overlap.
  - Bumped version to `v0.6.4`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:40:00 IST] - v0.6.3
- **Session:** Header Layout Fixed — Brand Name & Protected Badge Separated.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Fixed header layout: "Packing Orbit" brand name now stays exactly above menu toggle (three horizontal lines) on the left side.
  - "Protected" badge stays on the far right side of header — no overlap with brand name.
  - Changed `header-left` from `flex: 1` to `flex-shrink: 0` so it only takes needed space.
  - Added `margin-left: auto` to `header-right` to push "Protected", "Live", "No Active Session" to far right edge.
  - `justify-content: space-between` on header-container properly separates left and right sections.
  - Bumped version to `v0.6.3`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:35:00 IST] - v0.6.2
- **Session:** Header Brand Name Fixed — No Text Cutting.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Fixed header brand name "Packing Orbit" being cut from left side (showing only partial text like "ackin").
  - Removed `min-width: 0` from `brand-name` and `brand-tagline` — replaced with `max-width: 100%` so ellipsis works from the right side, not cutting from left.
  - Removed `min-width: 0` from `brand-info` container.
  - Changed `header-left` overflow from `hidden` to `visible`.
  - `header-container` keeps `min-width: 0` for proper flex shrink behavior.
  - "Packing Orbit" now displays fully without overlap or cutting.
  - Bumped version to `v0.6.2`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:30:00 IST] - v0.6.1
- **Session:** Header Overlap Fix — Brand Name Protected.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Fixed header overlap issue: "Packing Orbit" brand name was overlapping with "Protected" badge on page refresh/mobile screen.
  - Changed `header-left` from `flex-shrink: 0` to `flex: 1` + `min-width: 0` + `overflow: hidden`.
  - Added `min-width: 0` to `header-container`, `brand-group`, `brand-info`, `brand-name`, `brand-tagline`.
  - Added `text-overflow: ellipsis` + `overflow: hidden` to `brand-name` and `brand-tagline`.
  - `header-right` gap reduced to 0.4rem for tighter mobile fit.
  - Bumped version to `v0.6.1`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:25:00 IST] - v0.6.0
- **Session:** Collapsible Cards Fixed — Button Conflict & Text Overflow Resolved.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Fixed button toggle conflict: `event.stopPropagation()` on Add Labour and Refresh buttons — clicking them no longer triggers card collapse.
  - Header restructured: `header-left` div with `flex: 1` + `min-width: 0` so titles/subtitles don't get cut off by buttons.
  - Added `gap: 0.75rem` between text content and action buttons.
  - Both cards (Labour Staff Management + User Login Audit Logs) now show full header text.
  - `header-actions` buttons and toggle arrow have `flex-shrink: 0` to prevent layout shift.
  - Bumped version to `v0.6.0`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:20:00 IST] - v0.5.9
- **Session:** Collapsible Admin Cards — Labour & Audit Logs Toggle.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Made **Labour Staff Management** and **User Login Audit Logs** cards collapsible/expandable.
  - Click card header to toggle content visibility; arrow rotates to indicate state.
  - Cards start expanded by default.
  - Added `header-actions` wrapper grouping buttons + toggle arrow.
  - Fixed title overflow: `white-space: nowrap` + `text-overflow: ellipsis` on admin-card-title and admin-card-sub.
  - Added `min-width: 0` + `flex: 1` to header left div for proper ellipsis behavior.
  - `overflow: hidden` on admin-card to prevent child overflow.
  - Bumped version to `v0.5.9`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:15:00 IST] - v0.5.8
- **Session:** Admin Dashboard — Compact Typography, No Wrapping.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Compacted admin dashboard typography to prevent text wrapping and oversized fonts.
  - Admin card title: 0.85rem (was 1rem); user banner h4: 0.82rem (was 0.95rem).
  - Data table: font 0.75rem, reduced cell padding, `white-space: nowrap` + `text-overflow: ellipsis`.
  - Added `white-space: nowrap` + `text-overflow: ellipsis` to all dashboard text (sidebar nav, stats, badges, modal titles, buttons).
  - Modal titles: 0.9rem; sidebar nav labels: 0.8rem; stat values: 0.78rem.
  - Dashboard wrapper: full width with padding instead of fixed 820px max-width.
  - Bumped version to `v0.5.8`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:10:00 IST] - v0.5.7
- **Session:** Custom Account Select Dropdown — No Full Screen.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Replaced native `<select>` with custom dropdown component (`custom-select`, `custom-select-trigger`, `custom-select-options`).
  - Dropdown opens **within form bounds only** — max-height 260px with scrollable list, never takes over full mobile screen.
  - Click outside dropdown or press Escape to close.
  - Auto-fill on selection intact (identifier + password fields populated).
  - Visual selected state on chosen option.
  - Bumped version to `v0.5.7`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:05:00 IST] - v0.5.6
- **Session:** Quick Account Select Dropdown — Mobile Width Fixed.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Fixed dropdown overflowing mobile screen: added `max-width: 100%`, `box-sizing: border-box`, `min-height: 44px`.
  - Font size reduced from 0.9rem to 0.85rem for better mobile fit.
  - Added `text-overflow: ellipsis` and `white-space: nowrap` on options to prevent long text overflow.
  - Added `max-width: 100%` and `box-sizing: border-box` to `.form-group` container.
  - Bumped version to `v0.5.6`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 11:00:00 IST] - v0.5.5
- **Session:** Quick Account Select Dropdown — Professional Design.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Redesigned Quick Account Select dropdown with professional mobile UI.
  - Added left user icon and right dropdown arrow for better visual affordance.
  - Font size increased to 0.9rem with 500 font weight for readability.
  - Padding improved (0.7rem vertical, 2.6rem horizontal for icons).
  - Focus state with blue border and glow shadow.
  - Optgroup styling: Admins and Packing Labours visually separated with cyan uppercase labels.
  - Option styling: dark background, proper padding.
  - Bumped version to `v0.5.5`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 10:55:00 IST] - v0.5.4
- **Session:** Login Status Indicator — Blinking Filled Circle.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Added **Current Login Status** indicator in header with blinking filled circle.
  - When logged in: shows role (Admin / Packing Labour / Grey Cloth Party) with green blinking dot.
  - When not logged in: shows "No Active Session" with grey dot.
  - Bumped version to `v0.5.4`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 10:50:00 IST] - v0.5.3
- **Session:** Login Page Field Order — Dropdown First.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Changed login page field order: **Select Account (Quick Login)** dropdown now appears **first**, followed by Mobile Number/Username and Password fields.
  - Header stays visible on login screen; only sidebar & backdrop hidden until auth.
  - Auto-fill from dropdown to identifier & password fields remains intact.
  - Bumped version to `v0.5.3`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 10:45:00 IST] - v0.5.2
- **Session:** Login Page Header Restored.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Fixed: project header was incorrectly hidden on login screen; now header stays visible.
  - Only sidebar & sidebar backdrop are hidden until the user authenticates.
  - Login page dropdown credentials (6 Admins + 3 Labours with auto-fill) remain intact.
  - Bumped version to `v0.5.2`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 10:34:00 IST] - v0.5.1
- **Session:** Login Page Cleanup & Dropdown Credentials.
- **Agent:** OpenCode AI Assistant
- **Action:**
  - Login page now displays **only the Sign In form**; sidebar & backdrop are hidden until the user authenticates. Header stays visible.
  - All credentials (6 Admins + 3 active Packing Labours) moved from openly visible hint cards into a `<select>` dropdown with auto-fill (identifier + password auto-populated on selection).
  - Fixed `auth-card` max-width to `350px` per mobile modal standard (Section 4).
  - Bumped version to `v0.5.1`.
  - State marked as paused, ready for Phase 5.

### [2026-11-24 15:23:00 IST] - v0.5.0
- **Session:** Mandatory Login Screen on App Launch.
- **Agent:** Antigravity AI
- **Action:**
  - Removed auto-load session persistence across app restarts.
  - Implemented an **Auth Gate**: whenever anyone opens `http://localhost:3000`, the app launches directly into the **Sign In Screen**.
  - All dashboard data, labour management, and firm operations remain locked until credentials are submitted.
  - Added Section 2: "Mandatory Authentication Gate on App Launch" to continuity guidelines.
  - Bumped version to `v0.5.0`.
  - State marked as paused, ready for Phase 5.

---

## 11. Architecture Discussion & Decision Log — Customer / Cloud / APK

**Recorded:** 2026-11-25 21:17:03 IST  
**Status:** Agreed direction; implementation pending (Customer Registration redesign)

### 11.1 Core Customer Model
- **Customer = ek particular packing firm ka customer** hota hai.
- Woh packing firm hi **Packing Orbit brand ki license holder** hoti hai.
- Customer seedha Packing Orbit ka nahi hai, aur kisi doosri firm ka bhi nahi.
- Isliye customer record usi licensed firm se linked hoga (firm id / tenant scope).
- Har licensed firm apne customers ki malik hai — **cross-firm data visibility nahi**.

### 11.2 Multi-Tenant / Isolation Rules
- Ek firm = ek tenant.
- Admin jis firm mein login ho, usi firm ke customers register/dekh sake.
- Customer login bhi **usi firm ke context mein** hoga — doosri firm se login nahi kar sakta.
- Original **Packing Orbit** brand hamesha dikhega (app + license copy), lekin andar ka data sirf uski firm ka.

### 11.3 Customer Mobile Access — Three Options Discussed
1. **Hosted Web App / PWA (recommended):** Cloud/VPS par deploy, customer URL khole + "Add to Home Screen". Central data, firm-isolated.
2. **Same Wi-Fi / LAN:** `http://<server-ip>:3000` — sirf tab chalega jab server device on aur usi network par ho.
3. **Android APK (direct link) — USER CHOICE:** WebView/Capacitor wrapper jo hosted URL khole; APK direct download link se distribute.

### 11.4 Build / Hosting Reality
- Is device par **Java JDK, Android SDK, Gradle, apksigner** available nahi hain — yahan `.apk` build nahi ho sakta.
- Node/npm/pnpm available hain; isliye **build-ready Capacitor wrapper + GitHub Actions** banayenge jo cloud me signed APK banakar GitHub Release se direct link dega.
- APK ko chalane ke liye app ka Node server **kahin hosted** hona chahiye (`https://...`).
- User ne kaha: cloud/VPS paid provider baad mein lenge — "kab" ka jawab: code abhi cloud-ready banayenge, provider milte hi URL/config set hoga.

### 11.5 Agreed Cloud + APK Ready Development Order
1. **Customer Registration redesign** — ✅ **COMPLETED in v0.16.0** (banking-style admin-only, auto PIN, firm-linked).
2. **Customer-facing screen** — customer apni firm ka apna data dekhe.
3. **Cloud-deploy readiness** — env config, secure sessions, DB path, CORS; localhost par depend nahi.
4. **WebView / PWA tweaks** — mobile layout, safe areas, offline-safe basics.
5. **APK wrapper + GitHub Actions** — provider ready hote hi direct link.
6. **Phase 5** — Grey Cloth Taka entry & Bale Packing workflow (pending).

### 11.6 Pending Decisions (Aapke direction ke liye)
- ~~Customer khud self-register karein ya firm ka admin register kare?~~ **Resolved — 11.7 dekhein: sirf Admin.**
- Customer login flow purana firm-select + mobile/PIN rahe ya alag customer portal?

### 11.7 Decision — Customer Registration Authority (Banking-Style Model)
**Decided:** 2026-11-25 21:23:41 IST

- **Customer khud se account/login nahi banayega.** Jaise banking system mein hota hai — customer document deta hai, bank usay account number + credentials provide karta hai — waise hi yahan **sirf license holder firm ka Admin** customer register karega.
- Isliye **self-registration / public customer signup kabhi nahi** hoga.
- **Koi document upload/verification nahi** chahiye — bas customer ka **mobile number** kaafi hai.
- **Mobile number = Customer Login ID** hoga.
- Admin customer ke liye **PIN / password set karega** (ya system auto-generate kare) aur customer ko batayega — bilkul bank ki tarah.
- Registration sirf **usi firm ke context mein** hoga jis firm ka admin login hai; customer doosri firm se login nahi kar sakta.
- Customer login flow: **Firm select → Mobile Number (ID) → PIN**.

**Resolved:** PIN system auto-generate karega — 11.8 dekhein.

### 11.8 Decision — Customer PIN: Auto-Generated, Stored, Admin-Visible
**Decided:** 2026-11-25 21:37:47 IST

- Customer ka PIN **system khud auto-generate** karega — admin ko manually PIN likhne ki zarurat nahi.
- Generated PIN **database mein save** rahega.
- **Admin PIN dekh sakta hai** (customer list / registration ke baad) aur customer ko bata sakta hai.
- Agar customer PIN bhool jata hai, to **admin usi saved PIN ko dobara de dega** — koi "forgot password" / reset-password logic ya system **nahi** banayenge.
- Isliye customer-facing self-service reset portal/page **kabhi nahi** hoga; sirf admin-controlled credential sharing.

### 11.9 Clarification — APK (Local Mode) vs Cloud/VPS (Buyer Mode)
**Recorded:** 2026-11-26 14:02:30 IST

- Section 11 me previously likha gaya **"APK + cloud/VPS"** faisla sahi hai — isme koi badlaav nahi.
- Ye **do alag stages** hain, ek doosre se contradictory nahi:
  1. **Stage 1 — Owner / Testing (local APK mode):** APK bundled web assets + API calls `http://127.0.0.1:3000` (phone par chal rahe Node server). Isme **hosting nahi chahiye**; direct customer WhatsApp image share (native `jid` bridge) yahin chalega. Abhi yahi build-ready hai.
  2. **Stage 2 — Buyer firms (cloud/VPS mode):** Jab doosri packing firms ko app bechenge, unke customers remote honge — unke liye **cloud/VPS par hosted app + direct APK link** zaroori hoga (jaise Section 11.3/11.4 me likha hai). Brand `Packing Orbit` permanently locked rahega.
- Isliye "APK banana hai" aur "cloud/VPS se chalana hai" dono roadmap ke valid hisson hain — sirf alag-alag users/stages ke liye.
- Jab bhi naya feature aaye: `npm run apk:sync` → GitHub Actions se naya APK/release link.

---

## 12. Testing Guide — Firm Customer Registration & Customer Login

**Recorded:** 2026-11-25 22:07:36 IST  
**Applies to:** v0.16.0+ (banking-style admin-only customer registration)

### 12.1 Admin — Customer Register Karna
1. Browser **hard refresh** (Shift + Reload).
2. Login: Firm = **Hans Packing Firm**, quick login se `admin`, password `admin123`.
3. Left sidebar → **Admin Control Panel** → **Firm & License Management** card.
4. **+ Register Customer** button par click.
5. Customer ka **10-digit mobile number** daalein (example `9812345678`); Party name optional.
6. **Register & Generate PIN** dabayein.
7. System message aata hai: `Customer 9812345678 registered for Hans Packing Firm. PIN: <6-digit>`
   - PIN copy kar lein. Agar miss ho jata hai to neeche **Firm Customers** table ke **PIN (Admin View)** column se dekh sakte hain.

### 12.2 Logout — Zaroori Step
- Header pill me **Logout** button dabayein.
- Ye isliye zaroori hai kyunki refresh par **silent session restore** hota hai — logout kiye bina admin session wapas aa jayega.

### 12.3 Customer Login
1. Login screen par **Select Firm** → Hans Packing Firm.
2. Quick Login dropdown me customer **nahi** dikhta — ye sirf admins/labours ke liye hai (expected behavior); customer ko **manually** credentials type karne hote hain.
3. **Mobile Number or Username** → customer ka mobile (e.g. `9812345678`).
4. **Password / PIN** → admin se mila 6-digit PIN.
5. **Login to Account** dabayein.

### 12.4 Expected Result / Verification
- ✅ Login success.
- Header status / role: **CUSTOMER** → *Grey Cloth Party*.
- Upar green blinking dot ke saath **Running Firm heading** (Hans Packing Firm) dikhti hai.

### 12.5 Negative / Extra Tests
- Galat PIN → *"Galat Password ya PIN! Kripya check karein."*
- PIN bhool gaye → customer reset nahi karta; **admin login karke customer list se PIN dekh kar customer ko de**.
- Doosri firm select karke login → *"Yeh customer doosri firm se linked hai. Apni firm select karein."* (sirf tab test jab doosri active firm maujood ho).
- Duplicate mobile registration → *"Yeh mobile number already registered hai."*

### 12.6 Note
- Test customer cleanup: admin DB se delete kar sakta hai; purane/test customers ko affect kiye bina.
- Is guide ka UI flow v0.16.0 me implement hua; version v0.16.1 me documentation add ki gayi.

---

## 13. Inward Badge — Final Design Specification (v0.29.0)

**Status:** Implemented & documented. Applies to APK build `v0.29.0` and later.

### 13.1 Canvas & Print Format
- Standard portrait **638 x 1011 px**, exported PNG carries **300 DPI** metadata (`pHYs` chunk injected with CRC32).
- **Rounded corners** (radius 28) — entire badge clipped to this shape.
- **White background** with a light gray outer card border.

### 13.2 Header
- Full-width **dark green** band (`#065f46`) at top.
- Brand **"PACKING ORBIT"** in **white**, with subhead **"Original Brand - License Protected"** just below it (minimal 22px gap).
- **QR code 200px** anchored top-right (x=414, y=20), **standard black** modules on white box, unique per inward record (contains firm, Inward No, date/time, customer, mobile, code, token, bales, bale numbers, total takha).

### 13.3 Headings & Rows
- Firm name and **"INWARD ENTRY"** heading are **center-aligned**; firm name bold 32px.
- Compact field rows with minimal line spacing (34px):
  Inward No, Date & Time (`DD-MM-YYYY hh:mm:ss AM/PM`), Customer, Mobile, Customer Code, Token, **Quality shown as Type + Quality** (e.g. `PC 62 x 42`).

### 13.4 Bale Numbers
- No comma separator — each bale number rendered inside a **hollow rectangle box** (gray outline, centered text), adaptive width (56px / 46px), up to 3 lines.

### 13.5 Highlight Rows
- **Bales** — light **cyan** patch (`#cffafe`) with cyan value, right-aligned, just above Total Takha.
- **Total Takha** — light **green** patch (`#d1fae5`), right-aligned. Computed as `bale count × ledger takha_bales`.

### 13.6 Signatory & Terms (bottom area)
- Bottom-right corner of the outer box:
  1. `<firm name> [Admin1]` placeholder (e.g. `Hans Packing Firm [Admin1]`)
  2. **Real signature image** — admin-provided JPG at `client/signature.jpg`, drawn with preserved aspect ratio; fallback placeholder line if file missing.
  3. **"Authorised Signatory"** heading at the extreme bottom-right.
- Bottom-left blank area filled with professional **Terms & Conditions** (7 conditions):
  1. Material **must be** received in good condition.
  2. Report shortage within 24 hours.
  3. Quality / rate as per ledger entry.
  4. Computer-generated inward record.
  5. Dispatch to transport within 24 hrs of inward.
  6. Goods risk ceases at our godown only.
  7. >10 days late dispatch — **godown charge applicable**.

### 13.7 Footer
- Full-width **dark green** bar (`#065f46`), flush left/right/bottom (borderless), white text: **"Original Brand - License Protected"**.

### 13.8 Sharing
- **No caption text** is sent to WhatsApp — the badge image carries all details.
- **No file download** in the share flow.
- APK native bridge (`PackingOrbitNative.shareImageToWhatsApp`) sends the PNG with `jid=<registered customer number>@s.whatsapp.net` + `EXTRA_STREAM` → **image goes directly to that customer's WhatsApp chat; no contact search, no wrong-recipient risk**.
- Web browser fallback: Web Share API with image file (contact picker may appear) — browser limitation documented in Section 11.

### 13.9 Inward Number & Date
- Inward No: `IN-DDMMYYYY-NNNN` (per-day sequential serial, server-generated, unique).
- Date/Time: `DD-MM-YYYY hh:mm:ss AM/PM` (IST), server-generated.
