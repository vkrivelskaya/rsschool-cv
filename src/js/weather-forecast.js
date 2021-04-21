import { DailyWeather } from './daily-weather';
import { requests } from './constants/request-info';

export class WeatherForecast {
    constructor(lat, long, language) {
        this.latitude = lat;
        this.longitude = long;
        this.language = language;
        this.forecast = [];
    }

    async loadWeather() {
        const response = await fetch(`${requests.weatherForecast}/onecall?lat=${this.latitude}&lon=${this.longitude}&lang=${this.language}&exclude=minutely,hourly,alerts&appid=afba4e3563e6d79fdbe184a899275267`);    
        const { current, daily } = await response.json();

        this.forecast.push(new DailyWeather(
            current.temp,
            Date.now(),
            current.weather[0].icon,
            current.wind_speed,
            current.humidity,
            current.feels_like,
            current.weather[0].description
        ));
        for (let i = 1; i <= 3; i++) {
            this.forecast.push(new DailyWeather(
                daily[i].temp.day,
                daily[i].dt,
                daily[i].weather[0].icon
            ));
        }
    }

    getForecastForDay(dayFromNow=0) {
        return this.forecast[dayFromNow];
    }
}