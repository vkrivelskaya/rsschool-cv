import { requests } from './constants/request-info';

export class Location {
    constructor(lat, long, language, cityName, country) {
        this.latitude = lat;
        this.longitude = long;
        this.language = language;
        this.cityName = cityName;
        this.country = country;
        this.timeZone = null;
    }

    static async getLocationByName(cityName, language) {
        const response = await fetch(`${requests.map}/${cityName}.json?types=place&autocomplete=false&fuzzyMatch=false&language=${language}&access_token=pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA`);
        const jsonResponse = await response.json();
        const placeName = jsonResponse.features[0]?.place_name;

        if (!placeName) {
            return null;
        }

        const lat = jsonResponse.features[0].center[1];
        const long = jsonResponse.features[0].center[0];
        const country = jsonResponse.features[0].context.find(el => el.id.includes('country'));
        return new Location(lat, long, language,  jsonResponse.features[0].text, country.text);
    }
 
    addZeroToFormat(value) {
        return value < 10 ? `0${value}` : value;
    }

    async loadLocationTimezone() {
        let response = await fetch(`${requests.timeZone}/timezoneJSON?lat=${this.latitude}&lng=${this.longitude}&username=geoloky`);
        response = await response.json();
        this.timeZone = response.timezoneId;
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