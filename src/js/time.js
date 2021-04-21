import { requests } from './constants/request-info';

export class Time {
    constructor(latitude, longitude, language, timeZone) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.language = language;
        this.timeZone = timeZone;
    }

    addZeroToFormat(value) {
        return value < 10 ? `0${value}` : value;
    }

    async loadLocationTimezone() {
        let response = await fetch(`${requests.timeZone}/timezoneJSON?lat=${this.latitude}&lng=${this.longitude}&username=geoloky`);
        response = await response.json();
        this.timeZone = response.timezoneId;
    }

    getTimeZone() {
        return this.timeZone;
    }

    getDate() {
        const dateOptions = { weekday: 'short', month: 'long', day: 'numeric' };

        if (this.timeZone) {
            dateOptions.timeZone = this.timeZone;
        }

        let currentDate = new Date();
        return currentDate.toLocaleString(`${this.language}-GB`, dateOptions).replace(',', '');
    }

    getTime() {
        const currentTime = this.timeZone
        ? new Date((new Date()).toLocaleString('en-US', { timeZone: this.timeZone }))
        : new Date();

        const hour = currentTime.getHours();
        const min = this.addZeroToFormat(currentTime.getMinutes());
        const sec = this.addZeroToFormat(currentTime.getSeconds());
        return `${hour}:${min}:${sec}`;
    }
}