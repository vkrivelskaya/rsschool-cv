import { selectors } from './constants/selectors';
import { classes } from './constants/classes';
import { Location } from './location';
import { Weather } from './weather';
import { weatherIcons } from './weather-icons';
import { translation } from './translation';

export class Application {
    constructor() {
        this.degreeUnit = localStorage.getItem('degreeUnit') || 'celsius';
        this.language = 'en';

        this.currentLocation;
        this.currentWeather;
    }

    init() { 
        this.initActiveDegreeButton();
        const SEARCH_LOCATION_ELEMENT = document.querySelector(selectors.SEARCH_FORM);
        SEARCH_LOCATION_ELEMENT.addEventListener('submit', this.onLocationChange.bind(this));  

        const LANGUAGE_BUTTON_ELEMENT = document.querySelector(selectors.LANGUAGE_BTN);
        LANGUAGE_BUTTON_ELEMENT.addEventListener('change', this.changeLanguage.bind(this)); 

        const BUTTONS_CONTAINER = document.querySelector(selectors.BUTTONS_CONTAINER);
        BUTTONS_CONTAINER.addEventListener('click', this.determineClickedButton.bind(this));
        
        this.changeBackground();
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage != this.language) {
            this.setLanguage(savedLanguage, false);
        }
        this.loadLocationByIP();
    }

    showErrorMessage() {
        const ERROR_MESSAGE_ELEMENT = document.querySelector(selectors.ERROR_MESSAGE);
        ERROR_MESSAGE_ELEMENT.style.display = 'block';
    
        setTimeout(() => {
            ERROR_MESSAGE_ELEMENT.style.display = 'none';
        }, 3000);    
    }

    async onLocationChange(e) {    
        e.preventDefault();

        const SEARCH_INPUT_ELEMENT = document.querySelector(selectors.SEARCH_INPUT_FIELD);
        const location = await Location.getLocationByName(SEARCH_INPUT_ELEMENT.value, this.language);

        if (location) {
            await location.loadLocationTimezone();
            await this.setLocation(location);
        } else {
            this.showErrorMessage();
        }
    }

    showDate() {
        const DATE_ELEMENT = document.querySelector(selectors.DATE);

        DATE_ELEMENT.innerHTML = this.currentLocation.getDate();
    }

    showTime() {
        const TIME_ELEMENT = document.querySelector(selectors.TIME);

        TIME_ELEMENT.innerHTML = this.currentLocation.getTime();
        setTimeout(this.showTime.bind(this), 1000);
    }

    async loadLocationByIP() {
        let response = await fetch('https://ipinfo.io/json?token=edaa4c28dad526');

        response = await response.json();
        const location = await Location.getLocationByName(response.city, this.language);
        if (location) {
            await this.setLocation(location);
        }
    }

    async setLocation(location) {
        const LATITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LATITUDE_DEGREES);
        const LONGITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LONGITUDE_DEGREES);
        const LATITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LATITUDE_MINUTES);
        const LONGITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LONGITUDE_MINUTES);
        const LOCATION_ELEMENT = document.querySelector(selectors.LOCATION);
        const MINUTES_PER_DEGREES = 60;

        this.currentWeather = new Weather(location);
        await this.currentWeather.loadWeather();
        this.currentLocation = location;        
    
        LATITUDE_DEGREES_ELEMENT.innerHTML = Math.round(location.latitude);
        LONGITUDE_DEGREES_ELEMENT.innerHTML = Math.round(location.longitude);
        LATITUDE_MINUTES_ELEMENT.innerHTML = Math.round((location.latitude - Math.trunc(location.latitude)) * MINUTES_PER_DEGREES);
        LONGITUDE_MINUTES_ELEMENT.innerHTML = Math.round((location.longitude - Math.trunc(location.longitude)) * MINUTES_PER_DEGREES);
        LOCATION_ELEMENT.innerHTML = `${this.currentLocation.cityName}, ${this.currentLocation.country}`;

        this.showMap();
        this.showDate();
        this.showTime();
        this.showLoadedWeather(this.currentWeather);
    }

    showMap() {
        const mapboxgl = window.mapboxgl;
        mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA';
        new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11', 
            center: [this.currentLocation.longitude, this.currentLocation.latitude], 
            zoom: 8 
        });
    }

    changeBackground() {
        const BODY_ELEMENT = document.querySelector(selectors.BODY);
        const overlayColorStyle = 'linear-gradient(180deg, rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%)';

        fetch('https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=VHn7mGC7u8zX-WMTIzK3gPFXjBAZ5CyepHbt2rKr6xg')    
        .then((response) => response.json())
        .then((jsonResponse) => {
            BODY_ELEMENT.style.background = `${overlayColorStyle}, url("${jsonResponse.urls.regular}")`;
            BODY_ELEMENT.style.backgroundSize = 'cover';
        }); 
    }

    showTodaysWeatherDescription(todayWeather) {    
        const TODAYS_WEATHER_SUMMARY_ELEMENT = document.querySelector(selectors.SUMMARY);    
        const TODAYS_WIND_ELEMENT = document.querySelector(selectors.WIND);
        const TODAYS_HUMIDITY_ELEMENT = document.querySelector(selectors.HUMIDITY_VALUE); 
        const TODAYS_TEMPERATURE_ELEMENT = document.querySelector(selectors.TEMPERATURE);        
        const TODAYS_APPARENT_TEMPERATURE_ELEMENT = document.querySelector(selectors.APPARENT_TEMPERATURE);
        
        if (this.degreeUnit === 'celsius') {
            TODAYS_TEMPERATURE_ELEMENT.innerHTML = todayWeather.temperatureInCelsius;
            TODAYS_APPARENT_TEMPERATURE_ELEMENT.innerHTML = ` ${todayWeather.apparentTemperatureInCelsius} °`; 
        } else {
            TODAYS_TEMPERATURE_ELEMENT.innerHTML = todayWeather.temperatureInFahrenheit;
            TODAYS_APPARENT_TEMPERATURE_ELEMENT.innerHTML = ` ${todayWeather.apparentTemperatureInFahrenheit} °`;    
        }
               
        TODAYS_HUMIDITY_ELEMENT.innerHTML = `${todayWeather.humidity} %`;
        TODAYS_WEATHER_SUMMARY_ELEMENT.innerHTML = todayWeather.summary;
        TODAYS_WIND_ELEMENT.innerHTML = `${todayWeather.wind} m/s`;
    }
    
    showTemperatureForecast(weather) {
        const weatherTomorrow = weather.getForecastForDay(1);
        const weatherSecondDay = weather.getForecastForDay(2);
        const weatherThirdDay = weather.getForecastForDay(3);
        const TOMORROWS_TEMPERATURE_ELEMENT = document.querySelector(selectors.TEMPERATURE_TOMORROW);
        const SECOND_DAYS_TEMPERATURE_ELEMENT = document.querySelector(selectors.TEMPERATURE_SECOND_DAY);
        const THIRD_DAYS_TEMPERATURE_ELEMENT = document.querySelector(selectors.TEMPERATURE_THIRD_DAY);

        if (this.degreeUnit === 'celsius') {
            TOMORROWS_TEMPERATURE_ELEMENT.innerHTML = `${weatherTomorrow.temperatureInCelsius}°`;
            SECOND_DAYS_TEMPERATURE_ELEMENT.innerHTML = `${weatherSecondDay.temperatureInCelsius}°`;
            THIRD_DAYS_TEMPERATURE_ELEMENT.innerHTML = `${weatherThirdDay.temperatureInCelsius}°`;
        } else {
            TOMORROWS_TEMPERATURE_ELEMENT.innerHTML = `${weatherTomorrow.temperatureInFahrenheit}°`;
            SECOND_DAYS_TEMPERATURE_ELEMENT.innerHTML = `${weatherSecondDay.temperatureInFahrenheit}°`;
            THIRD_DAYS_TEMPERATURE_ELEMENT.innerHTML = `${weatherThirdDay.temperatureInFahrenheit}°`;
        }     
    }
    
    showNextDaysOfWeek(weather) {
        const daysEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const daysRu = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
        const TOMORROW_DAY_OF_WEEK_ELEMENT = document.querySelector(selectors.TOMORROW);
        const SECOND_DAY_OF_WEEK_ELEMENT = document.querySelector(selectors.SECOND_DAY);
        const THIRD_DAY_OF_WEEK_ELEMENT = document.querySelector(selectors.THIRD_DAY);

        const weatherTomorrow = weather.getForecastForDay(1);
        const weatherSecondDay = weather.getForecastForDay(2);
        const weatherThirdDay = weather.getForecastForDay(3);

        const tomorrowDate = new Date(weatherTomorrow.timestamp * 1000);
        const secondDayDate = new Date(weatherSecondDay.timestamp * 1000);
        const thirdDayDate = new Date(weatherThirdDay.timestamp * 1000);

        const days = this.language == 'en' ? daysEn : daysRu;
        TOMORROW_DAY_OF_WEEK_ELEMENT.innerHTML = days[tomorrowDate.getDay()];
        SECOND_DAY_OF_WEEK_ELEMENT.innerHTML = days[secondDayDate.getDay()];
        THIRD_DAY_OF_WEEK_ELEMENT.innerHTML = days[thirdDayDate.getDay()]; 
    }
    
    showWeatherIcons(weather) {
        const weatherToday = weather.getForecastForDay();
        const weatherTomorrow = weather.getForecastForDay(1);
        const weatherSecondDay = weather.getForecastForDay(2);
        const weatherThirdDay = weather.getForecastForDay(3);
    
        const TODAYS_WEATHER_ICON = document.querySelector(selectors.TODAY_WEATHER_ICON);
        const TOMORROWS_WEATHER_ICON = document.querySelector(selectors.TOMORROW_WEATHER_ICON);
        const SECOND_DAYS_WEATHER_ICON = document.querySelector(selectors.SECOND_DAY_WEATHER_ICON);
        const THIRD_DAYS_WEATHER_ICON = document.querySelector(selectors.THIRD_DAY_WEATHER_ICON);    
    
        const todaysWeatherIconFile = weatherIcons[weatherToday.icon];
        const tomorrowsWeatherIconFile = weatherIcons[weatherTomorrow.icon];
        const secondDaysWeatherIconFile = weatherIcons[weatherSecondDay.icon];
        const thirdDaysWeatherIconFile = weatherIcons[weatherThirdDay.icon];
    
        TODAYS_WEATHER_ICON.style.background = `center no-repeat url("../assets/images/icons/${todaysWeatherIconFile}")`;
        TODAYS_WEATHER_ICON.style.backgroundSize = 'cover';
    
        TOMORROWS_WEATHER_ICON.style.background = `center no-repeat url("../assets/images/icons/${tomorrowsWeatherIconFile}")`;
        TOMORROWS_WEATHER_ICON.style.backgroundSize = 'cover';
    
        SECOND_DAYS_WEATHER_ICON.style.background = `center no-repeat url("../assets/images/icons/${secondDaysWeatherIconFile}")`;
        SECOND_DAYS_WEATHER_ICON.style.backgroundSize = 'cover';
    
        THIRD_DAYS_WEATHER_ICON.style.background = `center no-repeat url("../assets/images/icons/${thirdDaysWeatherIconFile}")`;
        THIRD_DAYS_WEATHER_ICON.style.backgroundSize = 'cover';
    }
    
    showLoadedWeather(weather) { 
        this.showTodaysWeatherDescription(weather.getForecastForDay());
        this.showTemperatureForecast(weather);  
        this.showNextDaysOfWeek(weather);  
        this.showWeatherIcons(weather); 
    }

    setLanguage(language, updateLocation=true) {
        this.language = language;
        const SELECT_LANGUAGE_ELEMENT = document.querySelector(`[value=${this.language}]`);
        SELECT_LANGUAGE_ELEMENT.setAttribute('selected', 'selected');

        this.translateContent();
        if (updateLocation) {
            
            Location.getLocationByName(this.currentLocation.cityName, this.language)
            .then(async (location) => {
                await location.loadLocationTimezone();
                await this.setLocation(location);
            });            
        }
    }
    
    changeLanguage(e) {
        const language = e.target.value;
        localStorage.setItem('language', language);
        this.setLanguage(language); 
    }
    
    translateContent() {
        const stringsToBeResolved = document.querySelectorAll('[data-content]');

        stringsToBeResolved.forEach(el => {
            el.textContent = translation[el.attributes['data-content'].value][this.language];
        });
    }

    initActiveDegreeButton() {
        const FAHRENHEIT_TEMPERATURE_BTN = document.querySelector(selectors.FAHRENHEIT_TEMPERATURE_BTN);
        const CELSIUS_TEMPERATURE_BTN = document.querySelector(selectors.CELSIUS_TEMPERATURE_BTN);

        if (this.degreeUnit === 'fahrenheit') {
            FAHRENHEIT_TEMPERATURE_BTN.classList.remove(classes.NOT_ACTIVE);
            FAHRENHEIT_TEMPERATURE_BTN.classList.add(classes.ACTIVE);
            CELSIUS_TEMPERATURE_BTN.classList.remove(classes.ACTIVE);
            CELSIUS_TEMPERATURE_BTN.classList.add(classes.NOT_ACTIVE);
        } 
    }

    determineClickedButton(e) {
        const TEMPERATURE_BUTTONS = document.querySelectorAll(selectors.TEMPERATURE_BTN);
        
        if (e.target.className.includes(classes.CELSIUS) ||
            e.target.className.includes(classes.FAHRENHEIT)) {                
                TEMPERATURE_BUTTONS.forEach((el) => {
                    el.classList.remove(classes.ACTIVE);
                    el.classList.add(classes.NOT_ACTIVE);

                    if (el.className.includes(e.target.className)) {
                        el.classList.remove(classes.NOT_ACTIVE);
                        el.classList.add(classes.ACTIVE);
                    }                  
                });
                this.degreeUnit = e.target.className;
                localStorage.setItem('degreeUnit', this.degreeUnit);
                this.showLoadedWeather(this.currentWeather);
        } else if (e.target.className.includes(classes.REFRESH_BTN)) {
            this.changeBackground();
        } 
    } 
}