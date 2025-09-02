# 🧰 Drawer Handle Calculator (Offline PWA)

Centres two-hole drawer handles and gives you the **edge-to-hole distance** so both sides match perfectly.
Works offline on iPhone/iPad once added to Home Screen.

---

## 📐 Formula
For drawer width **W** and hole spacing **S** (centre-to-centre), centred on the drawer face:

- Edge-to-hole distance (both sides): **m = (W − S) / 2**
- Hole centres from the left edge: **x₁ = W/2 − S/2**, **x₂ = W/2 + S/2**
- For a single knob, set **S = 0** ⇒ hole at **W/2**

Units: mm or inches (in).

---

## 🚀 Quick Start (GitHub Pages — Free)

1. Create a **public** repo on GitHub (e.g., `drawer-handle-calculator`).
2. Upload **all files** in this folder (including `.nojekyll`).
3. Repo → **Settings** → **Pages** → *Build and deployment*:
   - Source: **Deploy from a branch**
   - Branch: **main**, Folder: **/** (root) → **Save**
4. Your app will be live shortly at:
   `https://<username>.github.io/<repo-name>/`
5. Open the URL in **Safari** → Share → **Add to Home Screen** to use offline.

---

## 🧩 Features
- Input width **W** and spacing **S**, choose units and precision.
- Shows **edge-to-hole distance m**, and absolute hole positions **x₁, x₂**.
- **Copy Summary** to clipboard.
- **Download Drill Strip (PNG)** — printable ruler to mark holes quickly.
- Fully **offline** (PWA with service worker).

---

## 📁 Files
- `index.html` — UI
- `app.js` — logic & PNG generator
- `style.css` — styling
- `manifest.webmanifest` — PWA config
- `sw.js` — offline cache
- `icon192.png`, `icon512.png` — app icons
- `.nojekyll` — disable Jekyll on GitHub Pages

Enjoy!
