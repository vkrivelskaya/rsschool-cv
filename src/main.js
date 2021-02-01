const classes = {
  AFTERNOON: 'afternoon',
  MORNING: 'morning',
  EVENING: 'evening',
};

const selectors = {
  TIME: '.time',
  GREETING: '.greeting',
  NAME: '.name',
  FOCUS: '.focus',
};

const nameElement = document.querySelector(selectors.NAME);
const focusElement = document.querySelector(selectors.FOCUS);

function addZeroToFormat(value) {
  return value < 10 ? '0' + value : value;
}

function updateTime() {
  const timeElement = document.querySelector(selectors.TIME);
  let currentTime = new Date();
  let hour = currentTime.getHours();
  let min = addZeroToFormat(currentTime.getMinutes());
  let sec = addZeroToFormat(currentTime.getSeconds());

  timeElement.innerHTML = `${hour}:${min}:${sec}`;
  setTimeout(updateTime, 1000);
}

function updateGreetingLine(dayPart, dayPartClass) {  
  const greetingElement = document.querySelector(selectors.GREETING);

  greetingElement.textContent = `Good ${dayPart}, `;
  document.body.classList.add(dayPartClass); 
}

function setGreetingLine() {  
  let currentTime = new Date();
  const hour = currentTime.getHours();
  let dayPart = 'Evening';
  let dayPartClass = classes.EVENING;

  if (hour < 12) {
    dayPart = 'Morning';
    dayPartClass = classes.MORNING;    
  } else if (hour < 18) {
    dayPart = 'Afternoon';
    dayPartClass = classes.AFTERNOON;    
  } 

  updateGreetingLine(dayPart, dayPartClass);
}

function updateName() {
  nameElement.textContent = localStorage.getItem('name') || '(your name)';  
}

function updateFocus() {
  focusElement.textContent = localStorage.getItem('focus') || '(your focus)';  
}

function saveToLocalStorage(e, key) {
  const element = e.target;
  const enterKeyCode = 13;

  if (e.type === 'keydown') {
    if (e.keyCode === enterKeyCode) {
      localStorage.setItem(key, element.innerText);
      element.blur();
    }
  } else {
    localStorage.setItem(key, element.innerText);
  }
}

function saveName(e) {
  saveToLocalStorage(e, 'name');
}

function saveFocus(e) {
  saveToLocalStorage(e, 'focus');
}

function init() {
  nameElement.addEventListener('keydown', saveName);
  nameElement.addEventListener('blur', saveName);
  focusElement.addEventListener('keydown', saveFocus);
  focusElement.addEventListener('blur', saveFocus);
  updateTime();
  setGreetingLine();
  updateName();
  updateFocus();
}

init();