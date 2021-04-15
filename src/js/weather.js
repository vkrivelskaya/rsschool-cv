import { DailyWeather } from './daily-weather';

export class Weather {
    constructor(location) {
        this.location = location;
        this.forecast = [];
    }

    async loadWeather() {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.location.latitude}&lon=${this.location.longitude}&lang=${this.location.language}&exclude=minutely,hourly,alerts&appid=afba4e3563e6d79fdbe184a899275267`);    
        response = await response.json();

        this.forecast.push(new DailyWeather(
            response.current.temp,
            Date.now(),
            response.current.weather[0].icon,
            response.current.wind_speed,
            response.current.humidity,
            response.current.feels_like,
            response.current.weather[0].description
        ));
        for (let i = 1; i <= 3; i++) {
            this.forecast.push(new DailyWeather(
                response.daily[i].temp.day,
                response.daily[i].dt,
                response.daily[i].weather[0].icon
            ));
        }
    }

    getForecastForDay(dayFromNow=0) {
        return this.forecast[dayFromNow];
    }
}