import 'regenerator-runtime/runtime';
import './styles/style.scss';

const selectors = {
    LATITUDE_DEGREES: '.latitude-degrees',
    LONGITUDE_DEGREES: '.longitude-degrees',
    LATITUDE_MINUTES: '.latitude-minutes',
    LONGITUDE_MINUTES: '.longitude-minutes',
    TIME: '.time',
    DATE: '.date',
    LOCATION: '.location',
};

let map, latitude, longitude;

function showMap() {
    const mapboxgl = window.mapboxgl;
    mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZW50aW5hLWtyIiwiYSI6ImNrbjdzenB4bTBiaG8ycHFuNTF2ZGg5bGQifQ.bzp7eMwGHnb9ZFfDNggXCA';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [longitude, latitude], 
        zoom: 8 
    });
    console.log(map);
}

function determineCoordinates(callback) {
    const LATITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LATITUDE_DEGREES);
    const LONGITUDE_DEGREES_ELEMENT = document.querySelector(selectors.LONGITUDE_DEGREES);
    const LATITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LATITUDE_MINUTES);
    const LONGITUDE_MINUTES_ELEMENT = document.querySelector(selectors.LONGITUDE_MINUTES);
    const MINUTES_PER_DEGREES = 60;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            LATITUDE_DEGREES_ELEMENT.innerHTML = Math.floor(position.coords.latitude);
            LONGITUDE_DEGREES_ELEMENT.innerHTML = Math.floor(position.coords.longitude);
            LATITUDE_MINUTES_ELEMENT.innerHTML = Math.floor((position.coords.latitude - Math.trunc(position.coords.latitude)) * MINUTES_PER_DEGREES);
            LONGITUDE_MINUTES_ELEMENT.innerHTML = Math.floor((position.coords.longitude - Math.trunc(position.coords.longitude)) * MINUTES_PER_DEGREES);
            callback();
        });
    }
}

function addZeroToFormat(value) {
    return value < 10 ? '0' + value : value;
}

function updateDate() {
    const dateElement = document.querySelector(selectors.DATE);
    const dateOptions = { weekday: 'short', month: 'long', day: 'numeric' };
    let currentDate = new Date();
    dateElement.innerHTML = currentDate.toLocaleString('en-GB', dateOptions).replace(',', '');    
}
  
function updateTime() {
    const timeElement = document.querySelector(selectors.TIME);
    let currentTime = new Date();
    let hour = currentTime.getHours();
    let min = addZeroToFormat(currentTime.getMinutes());
    let sec = addZeroToFormat(currentTime.getSeconds());

    timeElement.innerHTML = `${hour}:${min}:${sec}`;
    setTimeout(updateTime, 1000);
}

function showLocation() {
    const LOCATION_ELEMENT = document.querySelector(selectors.LOCATION);
    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    regionNames.of('US');
    fetch('https://ipinfo.io/json?token=edaa4c28dad526')
    .then((response) => response.json())
    .then((jsonResponse) => {
        LOCATION_ELEMENT.innerHTML = `${jsonResponse.city}, ${regionNames.of(jsonResponse.country)}`;
    });   
}

function init() {
    window.addEventListener('load', () => {
        determineCoordinates(showMap);
    });
    updateTime();
    updateDate();
    showLocation();    
}

init();