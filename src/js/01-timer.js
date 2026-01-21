import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;
let timerId = null;

flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    const now = new Date();

    if (picked <= now) {
      refs.startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        title: 'Error',
        message: 'Illegal operation',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = picked;
    refs.startBtn.disabled = false;
  },
});

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;
  updateTimerUI(userSelectedDate - new Date());

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;
      updateTimerUI(0);
      return;
    }

    updateTimerUI(diff);
  }, 1000);
}

function updateTimerUI(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  refs.days.textContent = String(days).padStart(2, '0');
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
