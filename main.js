const targetDate = new Date('2026-01-03T12:45:00-03:00');

let previousValues = {
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

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        const values = {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
        };

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
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const values = {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
    };

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