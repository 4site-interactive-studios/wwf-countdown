class CountdownComponent {
  constructor(options) {
    this.el = document.querySelector(options.el);
    this.countdownTarget = new Date(`${options.date}T${options.time}`);
    this.timezone = options.timezone || false;
    this.loadFont = options.loadFont || false;
    this.fontScale = options.fontScale || 100;

    this.init();
    this.countdown();
    this.interval = setInterval(this.countdown.bind(this), 1000);
  }

  init() {
    if (this.loadFont) {
      document.fonts.add(
        new FontFace(
          "WWF",
          "url(https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10114/wwf-webfont.woff2?v=1679697538000)",
          {
            display: "block"
          }
        )
      );
    }


    document.head.insertAdjacentHTML("beforeend",
      `<style>
        .countdown__container {
          font-family: "WWF", sans-serif;
          background-color: #D6F1EF;
          color: #00675A;
          display: flex;
          padding: 0.2em 0.2em 0.3em;
          justify-content: center;
          align-items: center;
        }
        
        .countdown__section {
          display: flex;
          align-items: center;
        }
        
        .countdown__section > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-transform: uppercase;
        }
        
        .countdown__divider {
          font-size: 0.5em;
          padding: 0 0.2em;
          transform: translateY(-0.33em);
        }
        
        .countdown__time {
          font-size: 1em;
          line-height: 100%;
        }
        
        .countdown__unit {
          font-size: 0.24em;
          line-height: 100%;
          margin-top: 0.4em;
        }
        
        .countdown__section--expired {
          color: #A0D6D2;
        }
      </style>`
    )

    this.el.innerHTML = `
      <div class="countdown__container">
        <div class="countdown__section countdown__section--days">
          <div>
            <div class="countdown__time">00</div>
            <div class="countdown__unit">DAYS</div>
          </div>
          <div class="countdown__divider">:</div>
        </div>
        <div class="countdown__section countdown__section--hours">
          <div>
            <div class="countdown__time">00</div>
            <div class="countdown__unit">HOURS</div>
          </div>
          <div class="countdown__divider">:</div>
        </div>
        <div class="countdown__section countdown__section--minutes">
          <div>
            <div class="countdown__time">00</div>
            <div class="countdown__unit">MINUTES</div>
          </div>
          <div class="countdown__divider">:</div>
        </div>
        <div class="countdown__section countdown__section--seconds">
          <div>
            <div class="countdown__time">00</div>
            <div class="countdown__unit">SECONDS</div>
          </div>
        </div>  
      </div>
    `;


    this.countdownContainer = this.el.querySelector('.countdown__container')
    this.daysSection = this.el.querySelector('.countdown__section--days')
    this.daysTime = this.el.querySelector('.countdown__section--days .countdown__time')
    this.hoursSection = this.el.querySelector('.countdown__section--hours')
    this.hoursTime = this.el.querySelector('.countdown__section--hours .countdown__time')
    this.minutesSection = this.el.querySelector('.countdown__section--minutes')
    this.minutesTime = this.el.querySelector('.countdown__section--minutes .countdown__time')
    this.secondsSection = this.el.querySelector('.countdown__section--seconds')
    this.secondsTime = this.el.querySelector('.countdown__section--seconds .countdown__time')

    this.watchContainerWidthProperty();
  }

  countdown() {
    const startTime = this.getStartTime(this.timezone)
    const difference = this.countdownTarget - startTime;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    this.daysTime.textContent = days.toString().padStart(2, '0');
    this.hoursTime.textContent = hours.toString().padStart(2, '0');
    this.minutesTime.textContent = minutes.toString().padStart(2, '0');
    this.secondsTime.textContent = seconds.toString().padStart(2, '0');

    if (days <= 0) {
      this.daysSection.classList.add('countdown__section--expired');
      if (hours <= 0) {
        this.hoursSection.classList.add('countdown__section--expired');
        if (minutes <= 0) {
          this.minutesSection.classList.add('countdown__section--expired');
          if (seconds <= 0) {
            this.secondsSection.classList.add('countdown__section--expired');
            clearInterval(this.interval)
            this.el.style.display = 'none';
          }
        }
      }
    }
  }

  getStartTime(timezone) {
    //If no timezone given, we start at local time
    if (!timezone) return new Date();

    const now = new Date();
    const localTime = now.getTime();
    const localOffset = now.getTimezoneOffset() * 60000;
    const UTC = localTime + localOffset;

    //return a time to start counting from offset by UTC and a given timezone offset
    return new Date(UTC + (3600000 * timezone));
  }

  watchContainerWidthProperty() {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.countdownContainer.style.fontSize = `calc(${this.fontScale}px * ${entry.borderBoxSize[0].inlineSize}/440)`
      }
    });

    resizeObserver.observe(this.countdownContainer);
  }
}

if (window.CountdownOptions) {
  new CountdownComponent(window.CountdownOptions)
}
