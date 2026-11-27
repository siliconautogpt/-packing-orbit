# Custom Signature Image (Optional)

Aap apni **real signature ki JPG image** badge me use kar sakte hain.

## 1. File kahan rakhein
```
client/signature.jpg
```
(Exact naam `signature.jpg` — lowercase.)

## 2. Image requirements
- Format: **JPG** (PNG bhi chalega par naam `signature.jpg` rakhein)
- Background: **white / transparent** (badge white background ke saath match)
- Size: approx **300 × 100 px** ya usi ratio me
- Signature image ko tight crop karein (around the signature only)

## 3. Kaise chalega
- App load par `signature.jpg` preload hoti hai.
- Inward badge me bottom-right block:
  1. `Hans Packing Firm [Admin1]` (firm name dynamic)
  2. **Signature image** (ya file na hone par ek halki placeholder line)
  3. `Authorised Signatory`
- File abhi nahi hai → placeholder line dikhegi. JPG daalte hi signature dikhegi (hard refresh / naya APK build).

## 4. APK me include karne ke liye
```bash
cd "/sdcard/Download/Project/Packing Orbit"
npm run apk:sync
git add -A
git commit -m "add admin signature image"
git push
git tag v0.28.2
git push origin v0.28.2
```
Phir GitHub Actions se naya APK banega jisme signature image bundled hogi.
