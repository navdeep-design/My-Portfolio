# ⚡ Navdeep Sharma — Personal Portfolio

> A modern, futuristic glassmorphism portfolio for a Computer Science student.  
> Built with **pure HTML5, CSS3, and Vanilla JavaScript** — zero frameworks, zero dependencies.

---

## 📁 Project Structure

```
portfolio/
│── index.html          ← Main HTML file (all sections)
│── style.css           ← Full styling (glassmorphism + responsive)
│── script.js           ← All JavaScript (modular, commented)
│── data/
│   │── projects.json   ← Your projects data
│   │── achievements.json ← Your achievements timeline
│   │── skills.json     ← Skills per category
│── images/             ← Add your profile photo here
│── assets/             ← Resume PDF, extra assets
│── README.md           ← This file
```

---

## 🚀 Quick Start

1. **Download / Clone** the project folder
2. Open `index.html` in your browser — it works without any server
3. For JSON data to load properly, use a local server:
   ```bash
   # Python 3
   python3 -m http.server 8080
   # Then open: http://localhost:8080
   
   # OR use VS Code "Live Server" extension (recommended)
   ```

---

## ✏️ How to Update Content

### Add a New Project (`data/projects.json`)

```json
{
  "id": 7,
  "title": "Your Project Name",
  "description": "Short description shown on card",
  "longDescription": "Full description shown in modal popup",
  "technologies": ["HTML", "CSS", "JavaScript"],
  "category": "web",           ← Options: web | dsa | os | mini
  "github": "https://github.com/navdeepsharma/your-repo",
  "live": "https://your-live-demo.com",
  "status": "completed",       ← Options: completed | in-progress
  "statusLabel": "Completed",
  "year": "2025"
}
```

### Add a New Achievement (`data/achievements.json`)

```json
{
  "id": 9,
  "year": "2025",
  "title": "Achievement Title",
  "description": "What you achieved and how it mattered.",
  "badge": "🏆",
  "category": "academic"       ← Options: academic | technical | project
}
```

### Add/Edit Skills (`data/skills.json`)

```json
{
  "programming": [
    { "name": "Python", "level": 70, "icon": "🐍", "color": "#3776AB" }
  ]
}
```
- `level`: 0–100 (percentage)
- `color`: hex color for the skill bar
- Categories: `programming` | `web` | `tools` | `subjects`

---

## 🎨 How to Change Colors

Open `style.css` and find the `:root` block at the top:

```css
:root {
  --bg-deep:       #0B1026;   ← Darkest background
  --bg-mid:        #121A3A;   ← Mid background
  --bg-card:       #1C2755;   ← Card background
  --accent-purple: #8B5CF6;   ← Primary accent
  --accent-blue:   #3B82F6;   ← Secondary accent
  --accent-cyan:   #06B6D4;   ← Tertiary accent (tags, labels)
}
```

For **light mode** colors, edit the `[data-theme="light"]` block below `:root`.

---

## 💡 How to Add Your Profile Photo

1. Add your image to the `images/` folder (e.g., `images/navdeep.jpg`)
2. In `index.html`, find `.hero-avatar` div and replace content:

```html
<div class="hero-avatar" aria-label="Navdeep Sharma profile photo">
  <img src="images/navdeep.jpg" alt="Navdeep Sharma" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
</div>
```

---

## 🔤 How to Change Typing Animation Words

In `script.js`, find `TYPING_WORDS` array:

```javascript
const TYPING_WORDS = [
  'CS Student 🎓',
  'Web Developer 🌐',
  // Add your own here!
];
```

---

## ✉️ How to Change Contact Email

1. In `index.html`, find `navdeep@example.com` and replace with your real email
2. In `script.js`, find the `copyEmail` listener and update the email string

---

## 🎭 How to Edit Animations

| Animation         | Where to Edit                      |
|-------------------|------------------------------------|
| Scroll reveal     | `.reveal-up/.left/.right` in CSS  |
| Typing speed      | `delay` values in `type()` in JS  |
| Particle count    | `PARTICLE_COUNT` in `initParticles()` |
| Skill bar speed   | `transition: width 1s` in `.skill-bar-fill` |
| Counter speed     | `setInterval` timing in `initCounters()` |
| Loading duration  | `minTime` in `initLoadingScreen()` |

---

## 🌐 How to Deploy

### GitHub Pages (Free)
1. Push the `portfolio/` folder contents to a GitHub repo
2. Go to **Settings → Pages → Source → main branch**
3. Your site will be live at `https://yourusername.github.io/repo-name`

### Netlify (Free, Recommended)
1. Drag and drop the `portfolio/` folder on [netlify.com/drop](https://netlify.com/drop)
2. Instantly live! Custom domain also available.

### Vercel (Free)
```bash
npm i -g vercel
cd portfolio
vercel
```

---

## ✅ Testing Checklist

- [ ] Loading screen fades out after ~2 seconds
- [ ] Particle background visible
- [ ] Custom cursor follows mouse (desktop only)
- [ ] Scroll progress bar updates at top
- [ ] Navbar becomes glassy after scrolling
- [ ] All nav links scroll to correct section
- [ ] Active nav link highlights correctly
- [ ] Dark/Light mode toggles and saves to localStorage
- [ ] Search bar opens, filters sections and projects
- [ ] Typing animation cycles through all words
- [ ] About counters animate when scrolled into view
- [ ] Skill tabs switch correctly, bars animate
- [ ] Projects load from JSON, filter buttons work
- [ ] Project modal opens with details, closes on X/Escape/backdrop
- [ ] Achievements timeline renders alternating items
- [ ] Journey roadmap renders with dots and lines
- [ ] Contact form validates: name, email, message
- [ ] Copy email button works (copies to clipboard)
- [ ] Toast notifications appear and auto-dismiss
- [ ] Back to top button appears after scroll, works
- [ ] Footer year shows current year
- [ ] Mobile hamburger menu works
- [ ] No layout overflow on any screen size
- [ ] Keyboard navigation works (Tab + Escape)
- [ ] Zero console errors

---

## 🛠️ Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Markup      | HTML5 (semantic)     |
| Styling     | CSS3 (custom props)  |
| Logic       | Vanilla JavaScript   |
| Data        | JSON files           |
| Fonts       | Google Fonts (Syne + DM Sans + DM Mono) |
| Effects     | Canvas API (particles), CSS animations |
| Storage     | localStorage (theme) |

---

## 📝 License

Free to use and modify for personal portfolio use.  
Give credit if you share or fork it!

---

*"Still learning, still building." — Navdeep Sharma*
