export class DigitalTimer {

    fontSize = 60
    hours = 0
    minutes = 0
    seconds = 0

    constructor({
        container,
        hours = 0,
        minutes = 0,
        seconds = 0,
        isTimeNow = false,
        onEnd = null,
        onConfig = null, 
        fontSize = 60
      }) {
        this.container = document.querySelector(container);
        this.onEnd = onEnd;
        this.onConfig = onConfig;
        this.isTimeNow = isTimeNow;
        this.interval = null;
        this.fontSize = fontSize;

        this.minutes = minutes
        this.hours = hours
        this.seconds = seconds
      
        this.time = isTimeNow
          ? this.getCurrentTime()
          : { hours, minutes, seconds };
      
        this.render();
      }
  
    getCurrentTime() {
      const now = new Date();
      return {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      };
    }
  
    render() {
        this.container.innerHTML = `
        <div class="digital-timer-wrapper">
          <div class="digital-timer">
            <span class="digit" id="dt-h">00</span>
            <span class="colon">:</span>
            <span class="digit" id="dt-m">00</span>
            <span class="colon">:</span>
            <span class="digit" id="dt-s">00</span>
          </div>
          <div class="timer-actions">
            <button class="btn-reset" title="Reset"><i class='bx bx-reset'></i></button>
          </div>
        </div>
      `;
  
      this.applyStyles();
      this.updateDisplay();
      this.animateColon();
      this.bindEvents();
    }

    bindEvents() {
        const btnReset = this.container.querySelector(".btn-reset");
        const btnConfig = this.container.querySelector(".btn-config");
      
        if (btnReset) {
          btnReset.addEventListener("click", () => {
            this.reset();
            this.start();
          });
        }
      
        if (btnConfig && typeof this.onConfig === "function") {
          btnConfig.addEventListener("click", () => this.onConfig());
        }
      }
  
    applyStyles() {
      const style = document.createElement("style");
      style.textContent = `
            .digital-timer {
            font-family: 'Digital-7 Mono', monospace;
            font-size: ${this.fontSize}px;
            background: #000;
            color: #0f0;
            padding: 0.5em 0.8em;
            border-radius: 0.4em;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.1em;
            letter-spacing: 0.1em;
            }
            .digit, .colon {
            display: inline-block;
            text-align: center;
            }
            .colon {
            animation: blink 1s steps(2, start) infinite;
            }
            @keyframes blink {
            to { visibility: hidden; }
            }
        `;

        style.textContent += `
            .digital-timer-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5em;
            }

            .timer-actions {
                display: flex;
                gap: 1em;
            }

            .timer-actions button {
                font-size: 1.5em;
                padding: 0.3em 0.6em;
                background: #111;
                color: #0f0;
                border: 1px solid #0f0;
                border-radius: 0.3em;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .timer-actions button:hover {
                background: #0f0;
                color: #000;
                transform: scale(1.1);
            }
            `;
        document.head.appendChild(style);

    }
  
    updateDisplay() {
      if (this.isTimeNow) this.time = this.getCurrentTime();
  
      const { hours, minutes, seconds } = this.time;
      this.updateDigit("dt-h", hours);
      this.updateDigit("dt-m", minutes);
      this.updateDigit("dt-s", seconds);
    }
  
    updateDigit(id, value) {
      const el = document.getElementById(id);
      const newVal = String(value).padStart(2, "0");
      el.textContent = newVal;
    }
  
    animateColon() {
      // nada aqui porque já tem animação CSS no estilo `.colon`
    }
  
    tick() {
      if (this.isTimeNow) {
        this.updateDisplay();
        return;
      }
  
      if (this.time.seconds > 0) {
        this.time.seconds--;
      } else {
        if (this.time.minutes > 0 || this.time.hours > 0) {
          this.time.seconds = 59;
  
          if (this.time.minutes > 0) {
            this.time.minutes--;
          } else {
            this.time.minutes = 59;
            this.time.hours--;
          }
        } else {
          clearInterval(this.interval);
          this.interval = null;
          if (typeof this.onEnd === 'function') this.onEnd();
        }
      }
  
      this.updateDisplay();
    }
  
    start() {
      if (this.interval) return;
      this.updateDisplay();
      this.interval = setInterval(() => this.tick(), 1000);
    }
  
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    }
  
    reset(hours, minutes, seconds) {
      this.time = { hours: hours || this.hours, minutes: minutes || this.minutes, seconds: seconds || this.seconds };
      this.updateDisplay();
    }
  }
  