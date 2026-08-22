// Interactive Canvas Arc Reactor Physics Engine

export class ArcReactorCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.overcharged = false;
    this.rotationAngle = 0;
    this.particles = [];
    this.colorScheme = {
      primary: '#0066ff',
      secondary: '#00c8ff',
      core: '#ffffff',
      glow: 'rgba(0, 102, 255, '
    };

    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  setThemeColors(primary, secondary) {
    this.colorScheme.primary = primary || '#0066ff';
    this.colorScheme.secondary = secondary || '#00c8ff';
    this.colorScheme.glow = this.hexToRgba(this.colorScheme.primary, 0.45);
  }

  hexToRgba(hex, alpha) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
    }
    return `rgba(0,243,255,${alpha})`;
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const size = Math.min(parent.clientWidth || 320, 360);
    this.canvas.width = size;
    this.canvas.height = size;
    this.center = { x: size / 2, y: size / 2 };
    this.radius = size * 0.4;
  }

  initParticles() {
    this.particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * this.radius * 0.85;
      this.particles.push({
        x: this.center.x + Math.cos(angle) * dist,
        y: this.center.y + Math.sin(angle) * dist,
        angle: angle,
        dist: dist,
        speed: 0.005 + Math.random() * 0.012,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.8
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - this.center.x;
      const my = e.clientY - rect.top - this.center.y;
      const dist = Math.sqrt(mx * mx + my * my);
      this.hoverDist = dist;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverDist = 999;
    });
  }

  triggerOvercharge() {
    this.overcharged = true;
    setTimeout(() => {
      this.overcharged = false;
    }, 4500);
  }

  drawCore() {
    const { ctx, center, radius, overcharged, colorScheme } = this;
    const pulseScale = 1 + (overcharged ? Math.sin(Date.now() * 0.02) * 0.12 : Math.sin(Date.now() * 0.004) * 0.04);
    const primary = overcharged ? '#ff1100' : colorScheme.primary;
    const secondary = overcharged ? '#ffa500' : colorScheme.secondary;

    // 1. Outer Glow Aura
    const auraGradient = ctx.createRadialGradient(center.x, center.y, radius * 0.2, center.x, center.y, radius * 1.1);
    auraGradient.addColorStop(0, overcharged ? 'rgba(255, 0, 0, 0.4)' : this.hexToRgba(primary, 0.35));
    auraGradient.addColorStop(0.6, overcharged ? 'rgba(255, 100, 0, 0.15)' : this.hexToRgba(secondary, 0.15));
    auraGradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = auraGradient;
    ctx.fill();

    // 2. Outer Triangular Hex Frame Ring
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(this.rotationAngle * (overcharged ? 2.5 : 1.0));

    const numCoils = 10;
    ctx.lineWidth = 3;
    ctx.strokeStyle = primary;

    for (let i = 0; i < numCoils; i++) {
      const angle = (i * Math.PI * 2) / numCoils;
      const rx = Math.cos(angle) * radius * 0.82;
      const ry = Math.sin(angle) * radius * 0.82;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(angle + Math.PI / 2);

      // Coil block shape
      ctx.fillStyle = overcharged ? '#ffdd00' : primary;
      ctx.fillRect(-6, -10, 12, 20);

      // Inner wire detail
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-4, -8, 8, 16);

      ctx.restore();
    }
    ctx.restore();

    // 3. Counter-rotating inner ring with notched ticks
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(-this.rotationAngle * (overcharged ? 3.0 : 1.2));

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.62 * pulseScale, 0, Math.PI * 2);
    ctx.strokeStyle = secondary;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 4. Central Palladium Vibranium Core
    const coreGrad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * 0.45 * pulseScale);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, overcharged ? '#ffffbb' : '#e0ffff');
    coreGrad.addColorStop(0.7, primary);
    coreGrad.addColorStop(1, 'rgba(0,0,0,0.8)');

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 0.45 * pulseScale, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = primary;
    ctx.shadowBlur = overcharged ? 35 : 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Triangular Arc Reticle Emblem
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(this.rotationAngle * 0.5);

    ctx.beginPath();
    const triRadius = radius * 0.35 * pulseScale;
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const tx = Math.cos(a) * triRadius;
      const ty = Math.sin(a) * triRadius;
      if (i === 0) ctx.moveTo(tx, ty);
      else ctx.lineTo(tx, ty);
    }
    ctx.closePath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 6. Energy Particles Update & Draw
    this.particles.forEach(p => {
      p.angle += p.speed * (overcharged ? 3.5 : 1);
      const px = center.x + Math.cos(p.angle) * p.dist;
      const py = center.y + Math.sin(p.angle) * p.dist;

      ctx.beginPath();
      ctx.arc(px, py, p.size * (overcharged ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fillStyle = overcharged ? `rgba(255, 200, 0, ${p.alpha})` : this.hexToRgba(primary, p.alpha);
      ctx.fill();
    });
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const speed = this.overcharged ? 0.035 : (this.hoverDist < this.radius ? 0.02 : 0.008);
    this.rotationAngle += speed;

    this.drawCore();
    requestAnimationFrame(() => this.animate());
  }
}
