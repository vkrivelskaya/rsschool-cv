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

function addZeroFirstFormat(value){
  return value < 10 ? '0' + value : value;
}

function showTime() {
  const timeElement = document.querySelector(selectors.TIME);
  let currentTime = new Date();
  let hour = currentTime.getHours();
  let min = addZeroFirstFormat(currentTime.getMinutes());
  let sec = addZeroFirstFormat(currentTime.getSeconds());

  timeElement.innerHTML = `${hour}:${min}:${sec}`;
  setTimeout(showTime, 1000);
}

function setGreetingLine() {
  const greetingElement = document.querySelector(selectors.GREETING);
  let currentTime = new Date();
  let hour = currentTime.getHours();

  if (hour < 12) {
    greetingElement.textContent = 'Good Morning, ';
    document.body.classList.add(classes.MORNING);    
  } else if (hour < 18) {
    greetingElement.textContent = 'Good Afternoon, ';
    document.body.classList.add(classes.AFTERNOON); 
  } else {
    greetingElement.textContent = 'Good Evening, ';
    document.body.classList.add(classes.EVENING);
  }
}

function getName() {
  const nameItem = localStorage.getItem('name');

  nameElement.textContent = nameItem ? nameItem : '(your name)';  
}

function getFocus() {
  const focusItem = localStorage.getItem('focus');

  focusElement.textContent = focusItem ? focusItem : '(your focus)';  
}

function setItem(e, key) {
  const element = e.target;
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      element.blur();
    }
  } else {
    localStorage.setItem(key, element.innerText);
  }
}

function setName(e) {
  setItem(e, 'name');
}

function setFocus(e) {
  setItem(e, 'focus');
}

function init() {
  nameElement.addEventListener('keypress', setName);
  nameElement.addEventListener('blur', setName);
  focusElement.addEventListener('keypress', setFocus);
  focusElement.addEventListener('blur', setFocus);
  showTime();
  setGreetingLine();
  getName();
  getFocus();
}

init();