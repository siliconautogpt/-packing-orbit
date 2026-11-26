# Packing Orbit — APK Build (Direct WhatsApp Image Share)

## Status
- Capacitor 6 Android project: `android/`
- Native bridge: `PackingOrbitNative.shareImageToWhatsApp(base64, phone, text)`
- It saves the badge PNG and opens WhatsApp with `jid=<customer number>@s.whatsapp.net` + image attached — **no contact search, no wrong-recipient risk**.
- APK **bundles the web app locally** — hosting required nahi. API calls phone par chal rahe Node server (`http://127.0.0.1:3000`) par jaate hain (client/app.js me native fetch wrapper).
- GitHub Actions: `.github/workflows/build-apk.yml`

## Important
- APK chalane ke liye aapke phone par **Packing Orbit server run hona chahiye** (`node server/index.js`, port 3000).
- Headless Chrome / normal mobile browser me image specific chat me attach nahi hoti — ye sirf APK me possible hai.

## 1. Optional: hosted URL (baad mein)
Agar aap app ko internet par dena chahte hain to `capacitor.config.json` me:
```json
"server": { "url": "https://your-real-domain.com" }
```
aur client me API base accordingly badlega. Filhal local assets mode hai.

## 2. Build (local — needs Java 17 + Android SDK)
```bash
npm install
npm run apk:sync
npm run apk:build
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```
Is device par Java/Android SDK nahi hai — yahan build possible nahi.

## 3. Build via GitHub Actions (recommended)
1. Code ko GitHub repo par push karein.
2. `Actions` tab → **Build Packing Orbit APK** → **Run workflow** → APK artifact download → phone me install.
3. Direct download link chahiye to version tag push karein:
   ```bash
   git tag v0.26.0
   git push origin v0.26.0
   ```
   Tag push par **GitHub Release** banega — usme APK ka direct link hoga.

## 4. Customer flow in APK
Server chal raha ho → login → Inward → Share Badge → native bridge image ko **registered customer ke WhatsApp chat** me attach karke khol deta hai. Search nahi, galat recipient ka risk nahi.
