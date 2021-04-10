import 'regenerator-runtime/runtime';
import './styles/style.scss';
import { weatherIcons } from './js/weather-icons';

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
};

let map, latitude, longitude;

function showMap() {
    const mapboxgl = window.mapboxgl;
    mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [longitude, latitude], 
        zoom: 8 
    });
    console.log(map);
}

function determineCoordinates(callback) {
    const LATITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LATITUDE_DEGREES);
    const LONGITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LONGITUDE_DEGREES);
    const LATITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LATITUDE_MINUTES);
    const LONGITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LONGITUDE_MINUTES);
    const MINUTES_PER_DEGREES = 60;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            LATITUDE_DEGREES_ELEMENT.innerHTML = Math.floor(position.coords.latitude);
            LONGITUDE_DEGREES_ELEMENT.innerHTML = Math.floor(position.coords.longitude);
            LATITUDE_MINUTES_ELEMENT.innerHTML = Math.floor((position.coords.latitude - Math.trunc(position.coords.latitude)) * MINUTES_PER_DEGREES);
            LONGITUDE_MINUTES_ELEMENT.innerHTML = Math.floor((position.coords.longitude - Math.trunc(position.coords.longitude)) * MINUTES_PER_DEGREES);
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
    let currentDate = new Date();
    dateElement.innerHTML = currentDate.toLocaleString('en-GB', dateOptions).replace(',', '');    
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

async function showLocation() {
    const LOCATION_ELEMENT = document.querySelector(selectors.LOCATION);
    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    regionNames.of('US');
    let response = await fetch('https://ipinfo.io/json?token=edaa4c28dad526');
    response = await response.json();
    determineCoordinates(showWeather);
    LOCATION_ELEMENT.innerHTML = `${response.city}, ${regionNames.of(response.country)}`;      
}

function showWeather() {
    const todaysTemperatureElement = document.querySelector(selectors.TEMPERATURE);
    const todaysWeatherSummaryElement = document.querySelector(selectors.SUMMARY);
    const todaysApparentTemperatureElement = document.querySelector(selectors.APPARENT_TEMPERATURE);
    const todaysWindElement = document.querySelector(selectors.WIND);
    const todaysHumidityElement = document.querySelector(selectors.HUMIDITY_VALUE);
    const tomorrowsTemperatureElement = document.querySelector(selectors.TEMPERATURE_TOMORROW);
    const secondDaysTemperatureElement = document.querySelector(selectors.TEMPERATURE_SECOND_DAY);
    const thirdDaysTemperatureElement = document.querySelector(selectors.TEMPERATURE_THIRD_DAY);
    const tomorrowDayOfWeekElement = document.querySelector(selectors.TOMORROW);
    const secondDayOfWeekElement = document.querySelector(selectors.SECOND_DAY);
    const thirdDayOfWeekElement = document.querySelector(selectors.THIRD_DAY);
    const todaysWeatherIcon = document.querySelector(selectors.TODAY_WEATHER_ICON);
    const tomorrowsWeatherIcon = document.querySelector(selectors.TOMORROW_WEATHER_ICON);
    const secondDayWeatherIcon = document.querySelector(selectors.SECOND_DAY_WEATHER_ICON);
    const thirdDayWeatherIcon = document.querySelector(selectors.THIRD_DAY_WEATHER_ICON);
    const celsiusPerKelvin = 273.15;
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=afba4e3563e6d79fdbe184a899275267`)    
    .then((response) => response.json())
    .then((jsonResponse) => {
        const todayWeatherData = jsonResponse.current;
        const tomorrowWeatherData = jsonResponse.daily[1];
        const secondDayWeatherData = jsonResponse.daily[2];
        const thirdDayWeatherData = jsonResponse.daily[3];

        const timestampTomorrow = tomorrowWeatherData.dt;
        const timestampSecondDay = secondDayWeatherData.dt;
        const timestampThirdDay = thirdDayWeatherData.dt;
        const tomorrowDate = new Date(timestampTomorrow*1000);
        const secondDayDate = new Date(timestampSecondDay*1000);
        const thirdDayDate = new Date(timestampThirdDay*1000);

        todaysTemperatureElement.innerHTML = Math.floor(todayWeatherData.temp - celsiusPerKelvin);
        todaysApparentTemperatureElement.innerHTML = ` ${Math.floor(todayWeatherData.feels_like - celsiusPerKelvin)} °`;        
        todaysHumidityElement.innerHTML = `${todayWeatherData.humidity} %`;
        todaysWeatherSummaryElement.innerHTML = todayWeatherData.weather[0].description;
        todaysWindElement.innerHTML = `${todayWeatherData.wind_speed} ${'m/s'.toLowerCase()}`;

        tomorrowsTemperatureElement.innerHTML = `${Math.floor(tomorrowWeatherData.temp.day - celsiusPerKelvin)}°`;
        secondDaysTemperatureElement.innerHTML = `${Math.floor(secondDayWeatherData.temp.day - celsiusPerKelvin)}°`;
        thirdDaysTemperatureElement.innerHTML = `${Math.floor(thirdDayWeatherData.temp.day - celsiusPerKelvin)}°`;        
        
        tomorrowDayOfWeekElement.innerHTML = days[tomorrowDate.getDay()];
        secondDayOfWeekElement.innerHTML = days[secondDayDate.getDay()];
        thirdDayOfWeekElement.innerHTML = days[thirdDayDate.getDay()]; 
        
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
        
    }); 
}

function init() {
    window.addEventListener('load', () => {
        determineCoordinates(showMap);
    });
    updateTime();
    updateDate();
    showLocation();   
}

init();