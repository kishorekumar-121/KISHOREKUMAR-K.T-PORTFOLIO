// Repulsor Drone Target Simulator Engine

import { starkAudio } from './audio.js';

export class RepulsorSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.drones = [];
    this.explosions = [];
    this.lasers = [];
    this.score = 0;
    this.heat = 0;
    this.active = false;
    this.crosshair = { x: -100, y: -100 };

    this.resize();
    this.bindEvents();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = rect.height || 360;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.crosshair.x = e.clientX - r.left;
      this.crosshair.y = e.clientY - r.top;
    });

    this.canvas.addEventListener('click', (e) => {
      if (!this.active) return;
      if (this.heat >= 100) {
        starkAudio.playError();
        return;
      }

      const r = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - r.left;
      const clickY = e.clientY - r.top;

      // Add Repulsor beam from bottom center to target click
      this.lasers.push({
        sx: this.canvas.width / 2,
        sy: this.canvas.height - 10,
        tx: clickX,
        ty: clickY,
        alpha: 1.0
      });

      this.heat = Math.min(100, this.heat + 18);
      starkAudio.playRepulsor();

      // Check hit drones
      this.drones.forEach((drone, idx) => {
        const dx = drone.x - clickX;
        const dy = drone.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= drone.radius + 10) {
          // Drone hit!
          this.createExplosion(drone.x, drone.y, drone.color);
          this.drones.splice(idx, 1);
          this.score += 150;
          starkAudio.playTargetHit();

          // Respawn drone
          setTimeout(() => this.spawnDrone(), 1200);
        }
      });
    });
  }

  start() {
    this.active = true;
    this.score = 0;
    this.heat = 0;
    this.drones = [];
    this.explosions = [];
    this.lasers = [];

    for (let i = 0; i < 5; i++) {
      this.spawnDrone();
    }

    this.animate();
  }

  stop() {
    this.active = false;
  }

  spawnDrone() {
    if (!this.canvas) return;
    this.drones.push({
      x: 50 + Math.random() * (this.canvas.width - 100),
      y: 40 + Math.random() * (this.canvas.height - 120),
      vx: (Math.random() - 0.5) * 2.2,
      vy: (Math.random() - 0.5) * 1.5,
      radius: 16 + Math.random() * 8,
      angle: Math.random() * Math.PI * 2,
      color: Math.random() > 0.3 ? '#00f3ff' : '#ffb700'
    });
  }

  createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4.5;
      this.explosions.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1.0,
        color: color
      });
    }
  }

  animate() {
    if (!this.active || !this.ctx) return;

    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Heat cool down
    if (this.heat > 0) {
      this.heat = Math.max(0, this.heat - 0.6);
    }

    // 1. Draw Drones
    this.drones.forEach((drone) => {
      drone.x += drone.vx;
      drone.y += drone.vy;
      drone.angle += 0.03;

      if (drone.x < drone.radius || drone.x > canvas.width - drone.radius) drone.vx *= -1;
      if (drone.y < drone.radius || drone.y > canvas.height - drone.radius - 40) drone.vy *= -1;

      // Hex Drone Ring
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.rotate(drone.angle);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const dx = Math.cos(a) * drone.radius;
        const dy = Math.sin(a) * drone.radius;
        if (i === 0) ctx.moveTo(dx, dy);
        else ctx.lineTo(dx, dy);
      }
      ctx.closePath();
      ctx.strokeStyle = drone.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glowing Core Eye
      ctx.beginPath();
      ctx.arc(0, 0, drone.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = drone.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    });

    // 2. Draw Repulsor Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      ctx.beginPath();
      ctx.moveTo(laser.sx, laser.sy);
      ctx.lineTo(laser.tx, laser.ty);
      ctx.strokeStyle = `rgba(255, 23, 68, ${laser.alpha})`;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      laser.alpha -= 0.08;
      if (laser.alpha <= 0) {
        this.lasers.splice(i, 1);
      }
    }

    // 3. Draw Explosions
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.x += exp.vx;
      exp.y += exp.vy;
      exp.alpha -= 0.035;

      ctx.beginPath();
      ctx.arc(exp.x, exp.y, exp.size, 0, Math.PI * 2);
      ctx.fillStyle = exp.color.replace(')', `, ${exp.alpha})`).replace('rgb', 'rgba');
      ctx.fill();

      if (exp.alpha <= 0) {
        this.explosions.splice(i, 1);
      }
    }

    // 4. Target Crosshair Cursor
    if (this.crosshair.x > 0 && this.crosshair.y > 0) {
      ctx.save();
      ctx.translate(this.crosshair.x, this.crosshair.y);

      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.strokeStyle = this.heat >= 100 ? '#ff0000' : '#ff1744';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(-24, 0); ctx.lineTo(-10, 0);
      ctx.moveTo(10, 0); ctx.lineTo(24, 0);
      ctx.moveTo(0, -24); ctx.lineTo(0, -10);
      ctx.moveTo(0, 10); ctx.lineTo(0, 24);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // 5. HUD Telemetry Overlay (Score & Heat Bar)
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Share Tech Mono", monospace';
    ctx.fillText(`TARGET SCORE: ${this.score}`, 15, 25);

    // Heat Bar Background
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.5)';
    ctx.strokeRect(canvas.width - 155, 12, 140, 16);

    // Heat Fill
    const heatWidth = (this.heat / 100) * 136;
    ctx.fillStyle = this.heat >= 100 ? '#ff0000' : this.heat > 65 ? '#ffb700' : '#00f3ff';
    ctx.fillRect(canvas.width - 153, 14, heatWidth, 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.fillText(this.heat >= 100 ? 'OVERHEAT!' : `HEAT: ${Math.round(this.heat)}%`, canvas.width - 150, 24);

    requestAnimationFrame(() => this.animate());
  }
}
