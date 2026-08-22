# KISHOREKUMAR K.T - Personal Developer & ECE Portfolio

A modern, responsive, single-page web application portfolio built for **KISHOREKUMAR K.T** (Third-Year Electronics and Communication Engineering Student & Co-ordinator at VSB Engineering College, Karur).

Inspired by modern cyber-violet UI designs (`gspradeep.vercel.app`), this portfolio features glassmorphic cards, an interactive terminal hero mockup, dual infinite scrolling skill marquees, smooth scroll-reveal animations, custom cursor glow, and expandable project vaults.

---

## 🚀 Live Demo & Local Access

- **Direct Standalone Run**: Simply open [`index.html`](file:///C:/Users/kisho/.gemini/antigravity/scratch/ironman-portfolio/index.html) directly in any web browser (no installation required!).
- **Vite Dev Server**:
  ```bash
  npm install
  npm run dev
  ```
  Open `http://127.0.0.1:5173/` in your browser.

---

## ✨ Key Features & Sections

### 1. 🖥️ Interactive Terminal Hero
- Mac-style terminal header with red, yellow, and green controls.
- Dynamic terminal checks (`✔ Web Developer`, `✔ ECE Student & Co-ordinator`, `✔ Problem Solver`).
- Blinking prompt cursor (`$ ▋`).
- Resume download CTA button.

### 2. 👤 About Me
- High-resolution profile image with smooth border curves and hover zoom animation.
- Professional biography detailing academic standing at VSB Engineering College, Karur.

### 3. 🎓 Education
- **College**: VSB Engineering College, Karur
- **Degree**: B.E. Electronics and Communication Engineering
- **Current Status**: Third Year (2024 – 2028)
- **Cumulative CGPA**: **`7.5 / 10`**

### 4. ⚡ Technical Skills (Dual Infinite Marquee Carousel)
- **Row 1 (Scrolling Left)**: Python, Java, HTML, CSS, JavaScript, MySQL, Git, GitHub, VS Code.
- **Row 2 (Scrolling Right)**: Video Editing, React JS, ECE Systems, Agri Logistics.

### 5. 🛠️ Projects Vault
- **Smart Agri Transport Management System**:
  - **Role**: Web Developer
  - **Main Feature**: Crop Transportation Tracking System for farmers.
  - **Links**: Includes [Live Demo](https://smart-agri-transport-management1.vercel.app/) and [GitHub Repo](https://github.com/kishorekumar-121) buttons.
- Pre-structured expandable project card slot for future projects.

### 6. 📧 Contact Me & Social Channels
- **Email**: [kishorekumarkt3@gmail.com](mailto:kishorekumarkt3@gmail.com)
- **LinkedIn**: [KISHOREKUMAR K.T](https://www.linkedin.com/in/kishorekumar-k-t-568738378/)
- **GitHub**: [kishorekumar-121](https://github.com/kishorekumar-121)
- Interactive contact transceiver form.

---

## 🛠️ Project Structure

```
ironman-portfolio/
├── index.html         # Main single-page HTML, CSS, and JS web app
├── style.css          # Supplementary design tokens & responsive CSS
├── package.json       # Project dependencies & build scripts
├── public/
│   └── profile.jpg    # Imported profile image
└── src/
    └── main.js        # Module entry controller
```

---

## 📝 Customization & Updating Placeholders

To update your content, open `index.html` in any text editor (e.g. VS Code):

1. **Resume File**: Search for `Download Resume` and replace `href="#"` with `href="your-resume.pdf"`.
2. **Profile Image**: Replace `./profile.jpg` in `<img src="./profile.jpg">` if you wish to change your avatar image.
3. **Projects**: Edit or duplicate the `<div class="project-card">` container to add new projects.

---

## 📦 Deployment

### Deploying to Vercel / Netlify:
1. Push this folder to your GitHub repository ([github.com/kishorekumar-121](https://github.com/kishorekumar-121)).
2. Import the repository in [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
3. Build Command: `npm run build`
4. Output Directory: `dist`

---

© 2026 **KISHOREKUMAR K.T** | VSB Engineering College, Karur
