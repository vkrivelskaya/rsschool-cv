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
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?types=place&autocomplete=false&fuzzyMatch=false&language=${language}&access_token=pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA`);
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
        return value < 10 ? '0' + value : value;
    }

    async loadLocationTimezone() {
        let response = await fetch(`http://api.geonames.org/timezoneJSON?lat=${this.latitude}&lng=${this.longitude}&username=geoloky`);
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
        let currentTime = new Date();

        if (this.timeZone) {
            currentTime = new Date(currentTime.toLocaleString('en-US', {timeZone: this.timeZone}));
        }
        
        let hour = currentTime.getHours();
        let min = this.addZeroToFormat(currentTime.getMinutes());
        let sec = this.addZeroToFormat(currentTime.getSeconds());
        return `${hour}:${min}:${sec}`;
    }    
}