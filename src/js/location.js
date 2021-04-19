import { requests } from './constants/request-info';

export class Location {
    constructor() {
        this.latitude;
        this.longitude;
        this.language;
        this.cityName;
        this.country;        
    }

    async defineLocationByName(cityName, language) {
        const response = await fetch(`${requests.map}/${cityName}.json?types=place&autocomplete=false&fuzzyMatch=false&language=${language}&access_token=pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA`);
        const jsonResponse = await response.json();
        const placeResponseValue = jsonResponse.features[0];

        if (!placeResponseValue?.place_name) {
            return null;
        }

        this.latitude = placeResponseValue?.center[1];
        this.longitude = placeResponseValue?.center[0];
        this.country = placeResponseValue?.context.find(el => el.id.includes('country')).text;
        this.language = language;
        this.cityName = placeResponseValue?.text;
    }

    getLocationData() {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            language: this.language,
            cityName: this.cityName, 
            country: this.country,           
        };
    }    
}