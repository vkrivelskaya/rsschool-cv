import { selectors } from './constants/selectors';
import { classes } from './constants/classes';
import { Location } from './location';
import { WeatherForecast } from './weather-forecast';
import { weatherIcons } from './constants/weather-icons';
import { translation } from './constants/translation';
import { degreeUnits, localStorageItems, languages, daysOfWeek } from './constants/constants';
import { requests } from './constants/request-info';


export class Application {
    constructor() {
        this.degreeUnit = localStorage.getItem(localStorageItems.degreeUnit) || degreeUnits.celsius;
        this.language = languages.en;

        this.currentLocation = null;
        this.currentWeather = null;
    }

    init() { 
        this.initActiveDegreeButton();
        this.loadLocationByIP();
        this.listenButtonsAndInputChanges();        
        this.changeBackground();
        this.initLanguage();               
    }

    initLanguage() {
        const savedLanguage = localStorage.getItem(localStorageItems.language);

        if (savedLanguage && savedLanguage !== this.language) {
            this.setLanguage(savedLanguage, false);
        } 
    }

    listenButtonsAndInputChanges() {
        const searchLocationElement = document.querySelector(selectors.SEARCH_FORM);
        searchLocationElement.addEventListener('submit', this.onLocationChange.bind(this));  

        const languageButtonElement = document.querySelector(selectors.LANGUAGE_BTN);
        languageButtonElement.addEventListener('change', this.changeLanguage.bind(this)); 

        const buttonsContainer = document.querySelector(selectors.BUTTONS_CONTAINER);
        buttonsContainer.addEventListener('click', this.determineClickedButton.bind(this));
    }

    showErrorMessage() {
        const errorMessageElement = document.querySelector(selectors.ERROR_MESSAGE);
        errorMessageElement.style.display = 'block';
    
        setTimeout(() => {
            errorMessageElement.style.display = 'none';
        }, 3000);    
    }

    async onLocationChange(e) {    
        e.preventDefault();

        const searchInputElement = document.querySelector(selectors.SEARCH_INPUT_FIELD);
        const location = await Location.getLocationByName(searchInputElement.value, this.language);

        if (location) {
            await location.loadLocationTimezone();
            await this.setLocation(location);
        } else {
            this.showErrorMessage();
        }
    }

    showDate() {
        const dateElement = document.querySelector(selectors.DATE);

        dateElement.innerHTML = this.currentLocation.getDate();
    }

    showTime() {
        const timeElement = document.querySelector(selectors.TIME);

        timeElement.innerHTML = this.currentLocation.getTime();
        setTimeout(this.showTime.bind(this), 1000);
    }

    async loadLocationByIP() {
        let response = await fetch(requests.locationByIpUrl);

        response = await response.json();
        const location = await Location.getLocationByName(response.city, this.language);
        if (location) {
            await this.setLocation(location);
        }
    }

    async setLocation(location) { 
        this.currentWeather = new WeatherForecast(location);
        await this.currentWeather.loadWeather();
        this.currentLocation = location;        
           
        this.showCoordinates(location);
        this.showMap();
        this.showDate();
        this.showTime();
        this.showLoadedWeather();
    }

    showCoordinates(location) {
        const latitudeDegreeElement = document.querySelector(selectors.LATITUDE_DEGREES);
        const longitudeDegreeElement = document.querySelector(selectors.LONGITUDE_DEGREES);
        const latitudeMinutesElement = document.querySelector(selectors.LATITUDE_MINUTES);
        const longitudeMinutesElement = document.querySelector(selectors.LONGITUDE_MINUTES);
        const locationElement = document.querySelector(selectors.LOCATION);
        const minutesPerDegree = 60;

        latitudeDegreeElement.innerHTML = Math.round(location.latitude);
        longitudeDegreeElement.innerHTML = Math.round(location.longitude);
        latitudeMinutesElement.innerHTML = Math.round((location.latitude - Math.trunc(location.latitude)) * minutesPerDegree);
        longitudeMinutesElement.innerHTML = Math.round((location.longitude - Math.trunc(location.longitude)) * minutesPerDegree);
        locationElement.innerHTML = `${this.currentLocation.cityName}, ${this.currentLocation.country}`;
    }

    showMap() {
        const { mapboxgl } = window;        
        mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA';
        new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11', 
            center: [this.currentLocation.longitude, this.currentLocation.latitude], 
            zoom: 8 
        });
    }

    async changeBackground() {
        const bodyElement = document.querySelector(selectors.BODY);
        const overlayColorStyle = 'linear-gradient(180deg, rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%)';

        let response = await fetch(requests.randomPhoto);   
        response = await response.json();
        
        bodyElement.style.background = `${overlayColorStyle}, url("${response.urls.regular}")`;
        bodyElement.style.backgroundSize = 'cover';         
    }

    showTodaysWeatherDescription(todayWeather) {    
        const todaysWeatherSummaryElement = document.querySelector(selectors.SUMMARY);    
        const todaysWindElement = document.querySelector(selectors.WIND);
        const todaysHumidityElement = document.querySelector(selectors.HUMIDITY_VALUE); 
        const todaysTemperatureElement = document.querySelector(selectors.TEMPERATURE);        
        const todaysApparentTemperatureElement = document.querySelector(selectors.APPARENT_TEMPERATURE);
        
        if (this.degreeUnit === degreeUnits.celsius) {
            todaysTemperatureElement.innerHTML = todayWeather.temperatureInCelsius;
            todaysApparentTemperatureElement.innerHTML = ` ${todayWeather.apparentTemperatureInCelsius} °`; 
        } else {
            todaysTemperatureElement.innerHTML = todayWeather.temperatureInFahrenheit;
            todaysApparentTemperatureElement.innerHTML = ` ${todayWeather.apparentTemperatureInFahrenheit} °`;    
        }
               
        todaysHumidityElement.innerHTML = `${todayWeather.humidity} %`;
        todaysWeatherSummaryElement.innerHTML = todayWeather.summary;
        todaysWindElement.innerHTML = `${todayWeather.wind} m/s`;
    }
    
    showTemperatureForecast(weather) {
        [
            {
                temperatureElement: document.querySelector(selectors.TEMPERATURE_TOMORROW),
                weather: weather.getForecastForDay(1),
            },
            {
                temperatureElement: document.querySelector(selectors.TEMPERATURE_SECOND_DAY),
                weather: weather.getForecastForDay(2),
            },
            {
                temperatureElement: document.querySelector(selectors.TEMPERATURE_THIRD_DAY),
                weather: weather.getForecastForDay(3),
            },
        ].forEach(({ temperatureElement, weather }) => {
            temperatureElement.innerHTML = this.degreeUnit === degreeUnits.celsius 
            ? `${weather.temperatureInCelsius}°` 
            : `${weather.temperatureInFahrenheit}°`;
        });
    }
    
    showNextDaysOfWeek(weather) {        
        const days = this.language === languages.en ? daysOfWeek.en : daysOfWeek.ru;

        [
            {
                dayElement: document.querySelector(selectors.TOMORROW),
                date: new Date(weather.getForecastForDay(1).timestamp * 1000),
            },
            {
                dayElement: document.querySelector(selectors.SECOND_DAY),
                date: new Date(weather.getForecastForDay(2).timestamp * 1000),
            },
            {
                dayElement: document.querySelector(selectors.THIRD_DAY),
                date: new Date(weather.getForecastForDay(3).timestamp * 1000),
            }
        ].forEach(({ dayElement, date }) => {
            dayElement.innerHTML = days[date.getDay()];
        });
    }
    
    showWeatherIcons(weather) {
        [
            {
                iconElement: document.querySelector(selectors.TODAY_WEATHER_ICON),
                weather: weather.getForecastForDay(),
            },
            {
                iconElement: document.querySelector(selectors.TOMORROW_WEATHER_ICON),
                weather: weather.getForecastForDay(1),
            },
            {
                iconElement: document.querySelector(selectors.SECOND_DAY_WEATHER_ICON),
                weather: weather.getForecastForDay(2),
            },
            {
                iconElement: document.querySelector(selectors.THIRD_DAY_WEATHER_ICON),
                weather: weather.getForecastForDay(3),
            }
        ].forEach(({ iconElement, weather }) => {
            const iconFile = weatherIcons[weather.icon];

            iconElement.style.background = `center no-repeat url("../assets/images/weather icons/${iconFile}")`;            
            iconElement.style.backgroundSize = 'cover';
        });        
    }
    
    showLoadedWeather() { 
        this.showTodaysWeatherDescription(this.currentWeather.getForecastForDay());
        this.showTemperatureForecast(this.currentWeather);  
        this.showNextDaysOfWeek(this.currentWeather);  
        this.showWeatherIcons(this.currentWeather); 
    }

    setLanguage(language, updateLocation = true) {
        this.language = language;
        const selectLanguageElement = document.querySelector(`[value=${this.language}]`);
        selectLanguageElement.setAttribute('selected', 'selected');

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
        localStorage.setItem(localStorageItems.language, language);
        this.setLanguage(language); 
    }
    
    translateContent() {
        const stringsToBeResolved = document.querySelectorAll('[data-content]');

        stringsToBeResolved.forEach(el => {
            el.textContent = translation[el.attributes['data-content'].value][this.language];
        });
    }

    markAsNotActive(el) {
        el.classList.remove(classes.ACTIVE);
        el.classList.add(classes.NOT_ACTIVE);
    }
    
    markAsActive(el) {
        el.classList.remove(classes.NOT_ACTIVE);
        el.classList.add(classes.ACTIVE);
    }

    initActiveDegreeButton() {
        const fahrenheitTemperatureBtn = document.querySelector(selectors.FAHRENHEIT_TEMPERATURE_BTN);
        const celsiusTemperatureBtn = document.querySelector(selectors.CELSIUS_TEMPERATURE_BTN);

        if (this.degreeUnit === degreeUnits.fahrenheit) {
            this.markAsNotActive(celsiusTemperatureBtn);
            this.markAsActive(fahrenheitTemperatureBtn);
        } 
    }

    determineClickedButton(e) {
        const temperatureButtons = document.querySelectorAll(selectors.TEMPERATURE_BTN);
        
        if (e.target.className.includes(classes.CELSIUS) ||
            e.target.className.includes(classes.FAHRENHEIT)) {                
                temperatureButtons.forEach((el) => {
                    this.markAsNotActive(el);

                    if (el.className.includes(e.target.className)) {
                        this.markAsActive(el);
                    }                  
                });
                this.degreeUnit = e.target.className;
                localStorage.setItem(localStorageItems.degreeUnit, this.degreeUnit);
                this.showLoadedWeather();
        } else if (e.target.className.includes(classes.REFRESH_BTN)) {
            this.changeBackground();
        } 
    } 
}