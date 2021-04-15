export class DailyWeather {
    constructor(temperature, timestamp, icon, wind, humidity, apparentTemperature, summary) {
        this.temperature = temperature;
        this.timestamp = timestamp;
        this.icon = icon;
        this.wind = wind;
        this.humidity = humidity;
        this.apparentTemperature = apparentTemperature;
        this.summary = summary;
    }

    convertKelvinToCelsius(temp) {
        const celsiusPerKelvin = 273.15;
        return Math.round(temp - celsiusPerKelvin);
    }

    convertKelvinInFahrenheit(temp) {
        return Math.round((temp - 273.15) * 9 / 5 + 32);
    }

    get temperatureInCelsius() {
        return this.convertKelvinToCelsius(this.temperature);
    }

    get temperatureInFahrenheit() {
        return this.convertKelvinInFahrenheit(this.temperature);
    }

    get apparentTemperatureInCelsius() {
        return this.convertKelvinToCelsius(this.apparentTemperature);
    }

    get apparentTemperatureInFahrenheit() {
        return this.convertKelvinInFahrenheit(this.apparentTemperature);
    }
}