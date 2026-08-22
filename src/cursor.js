// Custom Blue & White Glow Ring Cursor Engine

export class RepulsorCursor {
  constructor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'repulsor-cursor';
    this.cursor.innerHTML = `
      <div class="cursor-reticle">
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
        <div class="cursor-crosshair ch-top"></div>
        <div class="cursor-crosshair ch-bottom"></div>
        <div class="cursor-crosshair ch-left"></div>
        <div class="cursor-crosshair ch-right"></div>
      </div>
    `;
    document.body.appendChild(this.cursor);

    this.pos = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });

    document.querySelectorAll('a, button, input, textarea, select, .project-card, .skill-badge, .stark-panel').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hovering');
      });
    });

    window.addEventListener('mousedown', (e) => {
      this.cursor.classList.add('clicking');
      this.createShockwave(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      this.cursor.classList.remove('clicking');
    });
  }

  createShockwave(x, y) {
    const wave = document.createElement('div');
    wave.className = 'repulsor-shockwave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);

    setTimeout(() => {
      if (wave.parentNode) wave.parentNode.removeChild(wave);
    }, 450);
  }

  render() {
    this.pos.x += (this.target.x - this.pos.x) * 0.25;
    this.pos.y += (this.target.y - this.pos.y) * 0.25;

    this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

    requestAnimationFrame(() => this.render());
  }
}
