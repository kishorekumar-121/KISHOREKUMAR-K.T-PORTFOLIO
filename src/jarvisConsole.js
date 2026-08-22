// J.A.R.V.I.S. Command Console & AI Assistant Engine

import { starkAudio } from './audio.js';

export class JarvisConsole {
  constructor(inputSelector, outputSelector, quickActionsSelector, callbacks = {}) {
    this.input = document.querySelector(inputSelector);
    this.output = document.querySelector(outputSelector);
    this.quickContainer = document.querySelector(quickActionsSelector);
    this.callbacks = callbacks;
    this.history = [];
    this.historyIdx = -1;

    this.bindEvents();
    this.renderQuickActions();
    this.printInitialGreeting();
  }

  bindEvents() {
    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = this.input.value.trim();
          if (cmd) {
            this.executeCommand(cmd);
            this.history.push(cmd);
            this.historyIdx = this.history.length;
            this.input.value = '';
          }
        } else if (e.key === 'ArrowUp') {
          if (this.historyIdx > 0) {
            this.historyIdx--;
            this.input.value = this.history[this.historyIdx];
          }
        } else if (e.key === 'ArrowDown') {
          if (this.historyIdx < this.history.length - 1) {
            this.historyIdx++;
            this.input.value = this.history[this.historyIdx];
          } else {
            this.historyIdx = this.history.length;
            this.input.value = '';
          }
        }
      });
    }
  }

  renderQuickActions() {
    if (!this.quickContainer) return;
    const actions = [
      { label: 'PROJECTS', cmd: 'projects' },
      { label: 'SKILLS', cmd: 'skills' },
      { label: 'SUIT ARMOR', cmd: 'armor' },
      { label: 'OVERCHARGE', cmd: 'overcharge' },
      { label: 'SIMULATOR', cmd: 'simulator' },
      { label: 'HELP', cmd: 'help' }
    ];

    this.quickContainer.innerHTML = actions
      .map(
        (a) =>
          `<button class="quick-cmd-btn" data-cmd="${a.cmd}">[ ${a.label} ]</button>`
      )
      .join('');

    this.quickContainer.querySelectorAll('.quick-cmd-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        starkAudio.playClick();
        this.executeCommand(cmd);
      });
    });
  }

  printInitialGreeting() {
    this.printMessage(
      'J.A.R.V.I.S. ONLINE. Initialized Stark Telemetry Protocol 9.4. All sub-systems operational. Type "help" for a list of available directives.',
      'jarvis',
      true
    );
  }

  printMessage(text, sender = 'jarvis', speak = false) {
    if (!this.output) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `terminal-line ${sender}-line`;

    const prefix = sender === 'user' ? 'GUEST@STARK-HUD:~$ ' : 'J.A.R.V.I.S. > ';
    
    if (sender === 'user') {
      msgDiv.innerHTML = `<span class="prompt">${prefix}</span><span class="user-text">${this.escapeHtml(text)}</span>`;
      this.output.appendChild(msgDiv);
      this.output.scrollTop = this.output.scrollHeight;
    } else {
      msgDiv.innerHTML = `<span class="prompt prompt-jarvis">${prefix}</span><span class="type-target"></span>`;
      this.output.appendChild(msgDiv);

      const target = msgDiv.querySelector('.type-target');
      let i = 0;
      const typeSpeed = 12;

      const typeInterval = setInterval(() => {
        if (i < text.length) {
          target.innerHTML += text.charAt(i) === '\n' ? '<br/>' : text.charAt(i);
          i++;
          this.output.scrollTop = this.output.scrollHeight;
        } else {
          clearInterval(typeInterval);
        }
      }, typeSpeed);
    }

    if (speak && sender === 'jarvis') {
      starkAudio.speakJarvis(text.replace(/<[^>]*>?/gm, ''));
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&rawgt;')
      .replace(/"/g, '&quot;');
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase().trim();
    this.printMessage(rawCmd, 'user');

    starkAudio.playClick();

    switch (cmd) {
      case 'help':
        this.printMessage(
          'AVAILABLE DIRECTIVES:\n' +
          '• projects    : Open Stark Schematic Vault\n' +
          '• skills      : Inspect Suit Weaponry & Power Levels\n' +
          '• armor       : Switch Mark Armor Suite\n' +
          '• overcharge  : Maximize Arc Reactor Power Output\n' +
          '• simulator   : Launch Repulsor Drone Target System\n' +
          '• contact     : Dispatch Transceiver Message\n' +
          '• status      : Run Stark Diagnostics\n' +
          '• clear       : Purge Terminal Buffer\n' +
          '• bio         : View Developer Dossier',
          'jarvis',
          true
        );
        break;

      case 'projects':
        this.printMessage('Accessing Stark Industries Project Vault...', 'jarvis', true);
        if (this.callbacks.onProjects) this.callbacks.onProjects();
        break;

      case 'skills':
        this.printMessage('Displaying Weaponry & Tech Skills Power Levels...', 'jarvis', true);
        if (this.callbacks.onSkills) this.callbacks.onSkills();
        break;

      case 'armor':
        this.printMessage('Initiating Armor Suite Protocol. Cycle through suits above or select Mark III, XLV, LXXXV, or Stealth.', 'jarvis', true);
        if (this.callbacks.onArmor) this.callbacks.onArmor();
        break;

      case 'overcharge':
        this.printMessage('WARNING: ARC REACTOR OVERCHARGE DETECTED. Maximum energy output engaged!', 'jarvis', true);
        starkAudio.playPowerUp();
        if (this.callbacks.onOvercharge) this.callbacks.onOvercharge();
        break;

      case 'simulator':
        this.printMessage('Targeting drones inbound. Launching Repulsor Defense Simulator.', 'jarvis', true);
        if (this.callbacks.onSimulator) this.callbacks.onSimulator();
        break;

      case 'contact':
        this.printMessage('Encrypting signal lines. Opening Holographic Transceiver channel.', 'jarvis', true);
        if (this.callbacks.onContact) this.callbacks.onContact();
        break;

      case 'status':
        this.printMessage(
          'STARK SYSTEM TELEMETRY:\n' +
          '• Reactor Output : 100% (Palladium Core Stable)\n' +
          '• HUD Frame Rate : 60.0 FPS\n' +
          '• Core Temp     : 38.2°C\n' +
          '• Defense Grid  : ACTIVE\n' +
          '• J.A.R.V.I.S.  : OPTIMAL',
          'jarvis',
          true
        );
        break;

      case 'bio':
        this.printMessage(
          'DOSSIER: Lead Stark Engineer & Senior Full-Stack Architect.\nSpecializing in high-performance web applications, interactive 3D/2D graphics, cloud architecture, and AI integrations.',
          'jarvis',
          true
        );
        break;

      case 'clear':
        if (this.output) this.output.innerHTML = '';
        this.printInitialGreeting();
        break;

      default:
        this.printMessage(`Directive "${rawCmd}" unrecognised by J.A.R.V.I.S. Type "help" for options.`, 'jarvis', false);
        starkAudio.playError();
        break;
    }
  }
}
