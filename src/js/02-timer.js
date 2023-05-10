import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';

//dane z html
const startBtn = document.querySelector('button[data-start]');
const pickedDate = document.querySelector('#datetime-picker');
const daysValueEl = document.querySelector('span[data-days]');
const hoursValueEl = document.querySelector('span[data-hours]');
const minutesValueEl = document.querySelector('span[data-minutes]');
const secondsValueEl = document.querySelector('span[data-seconds]');


startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

    onClose(selectedDates) {
        if (selectedDates[0] < new Date()) {
            return Notiflix.Notify.failure('Please choose a date in future ! ');
        } else {
            // console.log(selectedDates[0].getTime());
            startBtn.disabled = false;
        }
    }
};


// flatpickr

flatpickr('#datetime-picker', options);

// jednostki czasu i ich konwertowanie 

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


function addLeadingZero(value) {
  if (value < 10) return value.toString().padStart(2, '0');
  return value;
}


const endCountdown = () => {
  clearInterval(timerID);
  secondsValueEl.textContent = '00';
};

function updateCountdown() {
  const remainingTime =
    new Date(pickedDate.value).getTime() - new Date().getTime();
  if (remainingTime > 0) {
    const { days, hours, minutes, seconds } = convertMs(remainingTime);
    daysValueEl.innerHTML = addLeadingZero(days);
    hoursValueEl.innerHTML = addLeadingZero(hours);
    minutesValueEl.innerHTML = addLeadingZero(minutes);
    secondsValueEl.innerHTML = addLeadingZero(seconds);
  } else {
    endCountdown();
    Notiflix.Notify.success(
      ' Odliczanie dobiegło końca! Odświerz stronę w celu wybrania nowej daty'
    );
  }
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  updateCountdown();
  timerID = setInterval(updateCountdown, 1000);
});