const targetDate = new Date('2026-05-01T18:00:00-03:00');

let previousValues = {
    years: '00',
    months: '00',
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
};

function morphDigit(element, newDigit) {
    const timeline = anime.timeline({
        easing: 'easeInOutQuad',
        duration: 400
    });

    timeline
        .add({
            targets: element,
            scaleY: [1, 0.3],
            scaleX: [1, 1.2],
            opacity: [1, 0.5],
            duration: 200,
            easing: 'easeInQuad'
        })
        .add({
            targets: element,
            scaleY: [0.3, 1],
            scaleX: [1.2, 1],
            opacity: [0.5, 1],
            duration: 200,
            easing: 'easeOutQuad',
            begin: function () {
                element.textContent = newDigit;
                element.setAttribute('data-value', newDigit);
            }
        }, 200);
}

function calendarDiff(from, to) {
    let years   = to.getFullYear() - from.getFullYear();
    let months  = to.getMonth()    - from.getMonth();
    let days    = to.getDate()     - from.getDate();
    let hours   = to.getHours()    - from.getHours();
    let minutes = to.getMinutes()  - from.getMinutes();
    let seconds = to.getSeconds()  - from.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours   < 0) { hours   += 24; days--; }
    if (days    < 0) {
        // días del mes anterior al de "to"
        days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
        months--;
    }
    if (months  < 0) { months  += 12; years--; }

    return { years, months, days, hours, minutes, seconds };
}

function updateCountdown() {
    const now = new Date();
    const isPast = targetDate < now;

    const titleEl = document.getElementById('countdown-title');
    if (titleEl) {
        titleEl.textContent = isPast
            ? 'Hace cuánto no nos vemos'
            : 'Tiempo hasta que nos vemos';
    }

    const d = isPast ? calendarDiff(targetDate, now) : calendarDiff(now, targetDate);

    const values = {};
    for (const unit of Object.keys(previousValues)) {
        values[unit] = String(d[unit]).padStart(2, '0');
    }

    Object.entries(values).forEach(([unit, value]) => {
        for (let i = 0; i < 2; i++) {
            const element = document.getElementById(`${unit}-${i}`);
            const newDigit = value[i];

            if (previousValues[unit][i] !== newDigit) {
                morphDigit(element, newDigit);
            }
        }
        previousValues[unit] = value;
    });
}

setInterval(updateCountdown, 100);
updateCountdown();
