import 'regenerator-runtime/runtime';
import './styles/style.scss';
import { weatherIcons } from './js/weather-icons';
import { translation } from './js/translation';

const selectors = {
    LATITUDE_DEGREES: '.latitude-degrees',
    LONGITUDE_DEGREES: '.longitude-degrees',
    LATITUDE_MINUTES: '.latitude-minutes',
    LONGITUDE_MINUTES: '.longitude-minutes',
    TIME: '.time',
    DATE: '.date',
    LOCATION: '.location',
    TEMPERATURE: '.today-temperature',
    SUMMARY: '.summary-value',
    APPARENT_TEMPERATURE: '.apparent-temperature-value',
    WIND: '.wind-value',
    HUMIDITY_VALUE: '.humidity-value',
    TEMPERATURE_TOMORROW: '.forecast-temperature-tomorrow',
    TEMPERATURE_SECOND_DAY: '.forecast-temperature-second-day',
    TEMPERATURE_THIRD_DAY: '.forecast-temperature-third-day',
    TOMORROW: '.tomorrow',
    SECOND_DAY:'.second-day',
    THIRD_DAY:'.third-day',
    TODAY_WEATHER_ICON:'.weather-icon-today',
    TOMORROW_WEATHER_ICON:'.weather-icon-tomorrow',
    SECOND_DAY_WEATHER_ICON:'.weather-icon-second-day',
    THIRD_DAY_WEATHER_ICON:'.weather-icon-third-day',
    TEMPERATURE_BTN_CONTAINER: '.temperature',
    FAHRENHEIT_TEMPERATURE_BTN: '.fahrenheit-temperature',
    CELSIUS_TEMPERATURE_BTN: '.celsius-temperature',
    BODY: 'body',
    BUTTONS_CONTAINER: '.buttons-container',
    SEARCH_FORM: '.search-container',
    SEARCH_INPUT_FIELD: '.input-field',
    LANGUAGE_BTN: '.language-button',
    ERROR_MESSAGE:'.error-message',
};

const classes = {
    FAHRENHEIT: 'fahrenheit',
    CELSIUS:'celsius',
    REFRESH_BTN: 'refresh-button',
    NOT_ACTIVE: 'not-active-button',
    ACTIVE: 'active-button',
};

const todaysTemperatureElement = document.querySelector(selectors.TEMPERATURE);
const tomorrowsTemperatureElement = document.querySelector(selectors.TEMPERATURE_TOMORROW);
const secondDaysTemperatureElement = document.querySelector(selectors.TEMPERATURE_SECOND_DAY);
const thirdDaysTemperatureElement = document.querySelector(selectors.TEMPERATURE_THIRD_DAY);
const todaysApparentTemperatureElement = document.querySelector(selectors.APPARENT_TEMPERATURE);
const fahrenheitTemperatureButtonElement = document.querySelector(selectors.FAHRENHEIT_TEMPERATURE_BTN);
const celsiusTemperatureButtonElement = document.querySelector(selectors.CELSIUS_TEMPERATURE_BTN);
const languageButtonElement = document.querySelector(selectors.LANGUAGE_BTN);
const LOCATION_ELEMENT = document.querySelector(selectors.LOCATION);
const searchInputElement = document.querySelector(selectors.SEARCH_INPUT_FIELD);
const celsiusPerKelvin = 273.15;
const overlayColorStyle = 'linear-gradient(180deg, rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%)';

let latitude; 
let longitude;
let timeZone;
let degreeUnit = 'celsius';
let language = 'en';
let currentLocation;

function showMap() {
    const mapboxgl = window.mapboxgl;
    mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA';
    new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [longitude, latitude], 
        zoom: 8 
    });
}

function setCoordinates(lat, long) {
    const LATITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LATITUDE_DEGREES);
    const LONGITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LONGITUDE_DEGREES);
    const LATITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LATITUDE_MINUTES);
    const LONGITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LONGITUDE_MINUTES);
    const MINUTES_PER_DEGREES = 60;

    latitude = lat;
    longitude = long;

    LATITUDE_DEGREES_ELEMENT.innerHTML = Math.round(latitude);
    LONGITUDE_DEGREES_ELEMENT.innerHTML = Math.round(longitude);
    LATITUDE_MINUTES_ELEMENT.innerHTML = Math.round((latitude - Math.trunc(latitude)) * MINUTES_PER_DEGREES);
    LONGITUDE_MINUTES_ELEMENT.innerHTML = Math.round((longitude - Math.trunc(longitude)) * MINUTES_PER_DEGREES);
}

function determineCoordinates(callback) {   

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            setCoordinates(position.coords.latitude, position.coords.longitude);
            callback();            
        });
    }
}

function addZeroToFormat(value) {
    return value < 10 ? '0' + value : value;
}

function updateDate() {
    const dateElement = document.querySelector(selectors.DATE);
    const dateOptions = { weekday: 'short', month: 'long', day: 'numeric' };
    if (timeZone) {
        dateOptions.timeZone = timeZone;
    }
    let currentDate = new Date();
    dateElement.innerHTML = currentDate.toLocaleString(`${language}-GB`, dateOptions).replace(',', '');    
}
  
function updateTime() {
    const timeElement = document.querySelector(selectors.TIME);
    let currentTime = new Date();
    if (timeZone) {
        currentTime = new Date(currentTime.toLocaleString('en-US', {timeZone: timeZone}));
    }
    let hour = currentTime.getHours();
    let min = addZeroToFormat(currentTime.getMinutes());
    let sec = addZeroToFormat(currentTime.getSeconds());

    timeElement.innerHTML = `${hour}:${min}:${sec}`;
    setTimeout(updateTime, 1000);
}

async function showLocation() {
    let response = await fetch('https://ipinfo.io/json?token=edaa4c28dad526');
    response = await response.json();
    setLocation(response.city);  
    currentLocation = response.city; 
}

function recalculateTemperatureFromCelsiusInFahrenheit(temperatureInCelsius) {
    return Math.round(temperatureInCelsius * 9 / 5 + 32);
}

function recalculateTemperatureFromKelvinInFahrenheit(temperatureInKelvin) {
    return Math.round((temperatureInKelvin - 273.15) * 9 / 5 + 32);
}

function recalculateTemperatureFromFahrenheitInCelsius(temperatureInFahrenheit) {
    return Math.round((temperatureInFahrenheit - 32) * 5 / 9 );
}

function initTemperatureButton() {
    degreeUnit = localStorage.getItem('degreeUnit') || 'celsius';

    if (degreeUnit === 'fahrenheit') {
        fahrenheitTemperatureButtonElement.classList.remove(classes.NOT_ACTIVE);
        fahrenheitTemperatureButtonElement.classList.add(classes.ACTIVE);
        celsiusTemperatureButtonElement.classList.add(classes.NOT_ACTIVE);
    } 
}

function showTodaysWeatherDescription(data) {    
    const todaysWeatherSummaryElement = document.querySelector(selectors.SUMMARY);    
    const todaysWindElement = document.querySelector(selectors.WIND);
    const todaysHumidityElement = document.querySelector(selectors.HUMIDITY_VALUE); 
    
    degreeUnit = localStorage.getItem('degreeUnit') || 'celsius';
    if (degreeUnit === 'celsius') {
        todaysTemperatureElement.innerHTML = Math.round(data.temp - celsiusPerKelvin);
        todaysApparentTemperatureElement.innerHTML = ` ${Math.round(data.feels_like - celsiusPerKelvin)} °`; 
    } else {
        todaysTemperatureElement.innerHTML = recalculateTemperatureFromKelvinInFahrenheit(data.temp);  
        todaysApparentTemperatureElement.innerHTML = ` ${recalculateTemperatureFromKelvinInFahrenheit(data.feels_like)} °`;      
    }
           
    todaysHumidityElement.innerHTML = `${data.humidity} %`;
    todaysWeatherSummaryElement.innerHTML = data.weather[0].description;
    todaysWindElement.innerHTML = `${data.wind_speed} ${'m/s'.toLowerCase()}`;
}

function showTemperatureForecast(data) {
    degreeUnit = localStorage.getItem('degreeUnit') || 'celsius';
    if (degreeUnit === 'celsius') {
        tomorrowsTemperatureElement.innerHTML = `${Math.round(data.daily[1].temp.day - celsiusPerKelvin)}°`;
        secondDaysTemperatureElement.innerHTML = `${Math.round(data.daily[2].temp.day - celsiusPerKelvin)}°`;
        thirdDaysTemperatureElement.innerHTML = `${Math.round(data.daily[3].temp.day - celsiusPerKelvin)}°`;
    } else {
        tomorrowsTemperatureElement.innerHTML = `${recalculateTemperatureFromKelvinInFahrenheit(data.daily[1].temp.day)}°`;
        secondDaysTemperatureElement.innerHTML = `${recalculateTemperatureFromKelvinInFahrenheit(data.daily[2].temp.day)}°`;
        thirdDaysTemperatureElement.innerHTML = `${recalculateTemperatureFromKelvinInFahrenheit(data.daily[3].temp.day)}°`;
    }     
}

function showNextDaysOfWeek(data) {
    const daysEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const daysRu = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    const tomorrowDayOfWeekElement = document.querySelector(selectors.TOMORROW);
    const secondDayOfWeekElement = document.querySelector(selectors.SECOND_DAY);
    const thirdDayOfWeekElement = document.querySelector(selectors.THIRD_DAY);

    const tomorrowWeatherData = data.daily[1];
    const secondDayWeatherData = data.daily[2];
    const thirdDayWeatherData = data.daily[3];

    const timestampTomorrow = tomorrowWeatherData.dt;
    const timestampSecondDay = secondDayWeatherData.dt;
    const timestampThirdDay = thirdDayWeatherData.dt;
    const tomorrowDate = new Date(timestampTomorrow * 1000);
    const secondDayDate = new Date(timestampSecondDay * 1000);
    const thirdDayDate = new Date(timestampThirdDay * 1000);

    if (language === 'en') {
        tomorrowDayOfWeekElement.innerHTML = daysEn[tomorrowDate.getDay()];
        secondDayOfWeekElement.innerHTML = daysEn[secondDayDate.getDay()];
        thirdDayOfWeekElement.innerHTML = daysEn[thirdDayDate.getDay()]; 
    } else if (language === 'ru') {
        tomorrowDayOfWeekElement.innerHTML = daysRu[tomorrowDate.getDay()];
        secondDayOfWeekElement.innerHTML = daysRu[secondDayDate.getDay()];
        thirdDayOfWeekElement.innerHTML = daysRu[thirdDayDate.getDay()]; 
    }    
}

function showWeatherIcons(data) {
    const todayWeatherData = data.current;
    const tomorrowWeatherData = data.daily[1];
    const secondDayWeatherData = data.daily[2];
    const thirdDayWeatherData = data.daily[3];

    const todaysWeatherIcon = document.querySelector(selectors.TODAY_WEATHER_ICON);
    const tomorrowsWeatherIcon = document.querySelector(selectors.TOMORROW_WEATHER_ICON);
    const secondDayWeatherIcon = document.querySelector(selectors.SECOND_DAY_WEATHER_ICON);
    const thirdDayWeatherIcon = document.querySelector(selectors.THIRD_DAY_WEATHER_ICON);    

    const todaysWeatherIconFile = weatherIcons[todayWeatherData.weather[0].icon];
    const tomorrowsWeatherIconFile = weatherIcons[tomorrowWeatherData.weather[0].icon];
    const secondDaysWeatherIconFile = weatherIcons[secondDayWeatherData.weather[0].icon];
    const thirdDaysWeatherIconFile = weatherIcons[thirdDayWeatherData.weather[0].icon];

    todaysWeatherIcon.style.background = `center no-repeat url("../assets/images/icons/${todaysWeatherIconFile}")`;
    todaysWeatherIcon.style.backgroundSize = 'cover';

    tomorrowsWeatherIcon.style.background = `center no-repeat url("../assets/images/icons/${tomorrowsWeatherIconFile}")`;
    tomorrowsWeatherIcon.style.backgroundSize = 'cover';

    secondDayWeatherIcon.style.background = `center no-repeat url("../assets/images/icons/${secondDaysWeatherIconFile}")`;
    secondDayWeatherIcon.style.backgroundSize = 'cover';

    thirdDayWeatherIcon.style.background = `center no-repeat url("../assets/images/icons/${thirdDaysWeatherIconFile}")`;
    thirdDayWeatherIcon.style.backgroundSize = 'cover';
}

async function loadWeather() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=${language}&exclude=minutely,hourly,alerts&appid=afba4e3563e6d79fdbe184a899275267`);    
    return await response.json();
}

function showLoadedWeather(response) {
    const todayWeatherData = response.current;
        
    showTodaysWeatherDescription(todayWeatherData);
    showTemperatureForecast(response);  
    showNextDaysOfWeek(response);  
    showWeatherIcons(response); 
}

function showTemperatureInCelsius() {
    degreeUnit = localStorage.getItem('degreeUnit') || 'celsius';
    if (degreeUnit === 'fahrenheit') {
        const tomorrowsTemperatureValue = tomorrowsTemperatureElement.innerHTML.slice(0, tomorrowsTemperatureElement.innerHTML.length - 1);
        const secondDaysTemperatureValue = secondDaysTemperatureElement.innerHTML.slice(0, secondDaysTemperatureElement.innerHTML.length - 1);
        const thirdDaysTemperatureValue = thirdDaysTemperatureElement.innerHTML.slice(0, thirdDaysTemperatureElement.innerHTML.length - 1);
        const todaysApparentTemperatureValue = todaysApparentTemperatureElement.innerHTML.slice(0, todaysApparentTemperatureElement.innerHTML.length - 1);

        todaysTemperatureElement.innerHTML = recalculateTemperatureFromFahrenheitInCelsius(todaysTemperatureElement.innerHTML);        
        tomorrowsTemperatureElement.innerHTML = `${recalculateTemperatureFromFahrenheitInCelsius(tomorrowsTemperatureValue)}°`;
        secondDaysTemperatureElement.innerHTML = `${recalculateTemperatureFromFahrenheitInCelsius(secondDaysTemperatureValue)}°`;
        thirdDaysTemperatureElement.innerHTML = `${recalculateTemperatureFromFahrenheitInCelsius(thirdDaysTemperatureValue)}°`;
        todaysApparentTemperatureElement.innerHTML = `${recalculateTemperatureFromFahrenheitInCelsius(todaysApparentTemperatureValue)}°`;

        celsiusTemperatureButtonElement.classList.remove(classes.NOT_ACTIVE);
        celsiusTemperatureButtonElement.classList.add(classes.ACTIVE);
        fahrenheitTemperatureButtonElement.classList.add(classes.NOT_ACTIVE);

        localStorage.setItem('degreeUnit', 'celsius');
    }
}

function showTemperatureInFahrenheit() {
    degreeUnit = localStorage.getItem('degreeUnit') || 'celsius';

    if (degreeUnit === 'celsius') {
        const tomorrowsTemperatureValue = tomorrowsTemperatureElement.innerHTML.slice(0, tomorrowsTemperatureElement.innerHTML.length - 1);
        const secondDaysTemperatureValue = secondDaysTemperatureElement.innerHTML.slice(0, secondDaysTemperatureElement.innerHTML.length - 1);
        const thirdDaysTemperatureValue = thirdDaysTemperatureElement.innerHTML.slice(0, thirdDaysTemperatureElement.innerHTML.length - 1);
        const todaysApparentTemperatureValue = todaysApparentTemperatureElement.innerHTML.slice(0, todaysApparentTemperatureElement.innerHTML.length - 1);

        todaysTemperatureElement.innerHTML = recalculateTemperatureFromCelsiusInFahrenheit(todaysTemperatureElement.innerHTML);        
        tomorrowsTemperatureElement.innerHTML = `${recalculateTemperatureFromCelsiusInFahrenheit(tomorrowsTemperatureValue)}°`;
        secondDaysTemperatureElement.innerHTML = `${recalculateTemperatureFromCelsiusInFahrenheit(secondDaysTemperatureValue)}°`;
        thirdDaysTemperatureElement.innerHTML = `${recalculateTemperatureFromCelsiusInFahrenheit(thirdDaysTemperatureValue)}°`;
        todaysApparentTemperatureElement.innerHTML = `${recalculateTemperatureFromCelsiusInFahrenheit(todaysApparentTemperatureValue)}°`;        

        fahrenheitTemperatureButtonElement.classList.remove(classes.NOT_ACTIVE);
        fahrenheitTemperatureButtonElement.classList.add(classes.ACTIVE);
        celsiusTemperatureButtonElement.classList.add(classes.NOT_ACTIVE);

        localStorage.setItem('degreeUnit', 'fahrenheit');
    }
}

function changeBackground() {
    const bodyElement = document.querySelector(selectors.BODY);
    fetch('https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=VHn7mGC7u8zX-WMTIzK3gPFXjBAZ5CyepHbt2rKr6xg')    
    .then((response) => response.json())
    .then((jsonResponse) => {
        bodyElement.style.background = `${overlayColorStyle}, url("${jsonResponse.urls.regular}")`;
        bodyElement.style.backgroundSize = 'cover';
    }); 
}

function determineClickedButton(e) {
    if (e.target.className.includes(classes.CELSIUS)) {
        showTemperatureInCelsius();        
    } else if (e.target.className.includes(classes.FAHRENHEIT)) {
        showTemperatureInFahrenheit();        
    }  else if (e.target.className.includes(classes.REFRESH_BTN)) {
        changeBackground();
    } 
} 

async function loadLocationTime(lat, long) {
    const response = await fetch(` http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${long}&username=geoloky`);
    return await response.json();
}

function applyLocationTimeResponse(response) {
    timeZone = response.timezoneId;
    updateDate();
    updateTime();
}

function showErrorMessage() {
    const errorMessageElement = document.querySelector(selectors.ERROR_MESSAGE);
    errorMessageElement.style.display = 'block';

    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 3000);    
}

async function setLocation(location) {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?types=place&autocomplete=false&fuzzyMatch=false&language=${language}&access_token=pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA`);
    const jsonResponse = await response.json();

    const placeName = jsonResponse.features[0]?.place_name;
    if (placeName) {
        const lat = jsonResponse.features[0].center[1];
        const long = jsonResponse.features[0].center[0];

        const responses = await Promise.all([
            loadLocationTime(lat, long),
            loadWeather()
        ]);

        const country = jsonResponse.features[0].context.find(el => el.id.includes('country'));
        LOCATION_ELEMENT.innerHTML = `${jsonResponse.features[0].text}, ${country.text}`;
        setCoordinates(lat, long);

        showMap();
        applyLocationTimeResponse(responses[0]);
        showLoadedWeather(responses[1]);

    } else {
        showErrorMessage();  
    }   
}

function onLocationChange(e) {    
    e.preventDefault();
    setLocation(searchInputElement.value);
    currentLocation = searchInputElement.value;
}

function setLanguage(language) {
    const selectedLanguageElement = document.querySelector(`[value=${language}]`);
    selectedLanguageElement.setAttribute('selected', 'selected');
    translateContent();
}

function changeLanguage(e) {
    language = e.target.value;
    localStorage.setItem('language', language);
    setLanguage(e.target.value);
    updateDate();
    setLocation(currentLocation);
}

function translateContent() {
    const stringsToBeResolved = document.querySelectorAll('[data-content]');
    stringsToBeResolved.forEach(el => {
        el.textContent = translation[el.attributes['data-content'].value][language];
    });

}

function init() {
    const buttonsContainer = document.querySelector(selectors.BUTTONS_CONTAINER);
    const searchLocationElement = document.querySelector(selectors.SEARCH_FORM);
    language = localStorage.getItem('language') || language;   
    setLanguage(language); 

    window.addEventListener('load', () => {
        determineCoordinates(showMap);
        changeBackground();
    });
    updateTime();
    updateDate();
    showLocation(); 
    initTemperatureButton();
    buttonsContainer.addEventListener('click', determineClickedButton);
    searchLocationElement.addEventListener('submit', onLocationChange);
    languageButtonElement.addEventListener('change', changeLanguage);    
}

init();