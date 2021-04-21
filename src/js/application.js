import { selectors } from './constants/selectors';
import { classes } from './constants/classes';
import { Location } from './location';
import { WeatherForecast } from './weather-forecast';
import { weatherIcons } from './constants/weather-icons';
import { translation } from './constants/translation';
import { degreeUnits, localStorageItems, languages, daysOfWeek } from './constants/constants';
import { requests, mapBoxAccessToken } from './constants/request-info';
import { Time } from './time';

export class Application {
    constructor() {
        this.degreeUnit = localStorage.getItem(localStorageItems.degreeUnit) || degreeUnits.celsius;
        this.language = languages.en;

        this.currentLocation = null;
        this.currentWeather = null;
        this.time = null;
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

    async defineLocation(city) {
        const location = new Location();
        await location.defineLocationByName(city, this.language);
        this.currentLocation = location.getLocationData();
    }

    async defineTimeZone() {
        this.time = new Time(this.currentLocation.latitude, this.currentLocation.longitude, this.currentLocation.language);
        await this.time.loadLocationTimezone();
        const timeZone = this.time.getTimeZone();
        await this.setLocation(this.currentLocation, timeZone);
    }

    async onLocationChange(e) {
        e.preventDefault();

        const searchInputElement = document.querySelector(selectors.SEARCH_INPUT_FIELD);
        await this.defineLocation(searchInputElement.value);

        if (this.currentLocation.cityName) {
            await this.defineTimeZone();
        } else {
            this.showErrorMessage();
        }
    }

    showDate() {
        const dateElement = document.querySelector(selectors.DATE);

        dateElement.innerHTML = this.time.getDate();
    }

    showTime() {
        const timeElement = document.querySelector(selectors.TIME);

        timeElement.innerHTML = this.time.getTime();
        setTimeout(this.showTime.bind(this), 1000);
    }

    async loadLocationByIP() {
        let response = await fetch(requests.locationByIpUrl);

        response = await response.json();
        const location = new Location();
        await location.defineLocationByName(response.city, this.language);
        this.currentLocation = location.getLocationData();

        await this.setLocation(this.currentLocation);
    }

    async setLocation({ latitude, longitude, language, cityName, country }, timezone) {
        this.currentWeather = new WeatherForecast(latitude, longitude, language);
        this.time = new Time(this.currentLocation.latitude, this.currentLocation.longitude, this.currentLocation.language, timezone);
        await this.currentWeather.loadWeather();

        this.showCoordinates(latitude, longitude, cityName, country);
        this.showMap();
        this.showDate();
        this.showTime();
        this.showLoadedWeather();
    }

    showCoordinates(latitude, longitude, cityName, country) {
        const latitudeDegreeElement = document.querySelector(selectors.LATITUDE_DEGREES);
        const longitudeDegreeElement = document.querySelector(selectors.LONGITUDE_DEGREES);
        const latitudeMinutesElement = document.querySelector(selectors.LATITUDE_MINUTES);
        const longitudeMinutesElement = document.querySelector(selectors.LONGITUDE_MINUTES);
        const locationElement = document.querySelector(selectors.LOCATION);
        const minutesPerDegree = 60;

        latitudeDegreeElement.innerHTML = Math.round(latitude);
        longitudeDegreeElement.innerHTML = Math.round(longitude);
        latitudeMinutesElement.innerHTML = Math.round((latitude - Math.trunc(latitude)) * minutesPerDegree);
        longitudeMinutesElement.innerHTML = Math.round((longitude - Math.trunc(longitude)) * minutesPerDegree);
        locationElement.innerHTML = `${cityName}, ${country}`;
    }

    showMap() {
        const { mapboxgl } = window;
        mapboxgl.accessToken = mapBoxAccessToken;
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

    async setLanguage(language, updateLocation = true) {
        this.language = language;
        const selectLanguageElement = document.querySelector(`[value=${this.language}]`);
        selectLanguageElement.setAttribute('selected', 'selected');

        this.translateContent();
        if (updateLocation) {
            await this.defineLocation(this.currentLocation.cityName);
            await this.defineTimeZone();
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
        } else {
            this.markAsNotActive(fahrenheitTemperatureBtn);
            this.markAsActive(celsiusTemperatureBtn);
        }
    }

    determineClickedButton(e) {
        const temperatureButtons = document.querySelectorAll(selectors.TEMPERATURE_BTN);
        const clickedButtonClassName = e.target.className;

        if (clickedButtonClassName.includes(classes.CELSIUS) || (clickedButtonClassName.includes(classes.FAHRENHEIT))) {
                temperatureButtons.forEach((el) => {
                    this.markAsNotActive(el);

                    if (el.className.includes(clickedButtonClassName)) {
                        this.markAsActive(el);
                    }
                });

                this.degreeUnit = clickedButtonClassName;
                localStorage.setItem(localStorageItems.degreeUnit, this.degreeUnit);
                this.showLoadedWeather();
        } else if (clickedButtonClassName.includes(classes.REFRESH_BTN)) {
            this.changeBackground();
        }
    }
}