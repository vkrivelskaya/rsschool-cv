let selectors = {
    DISPLAY: '.display',
    PICKER: '.picker',
    SLIDER: '.slider',
};
const canvasElement = document.querySelector('#draw');
let color = 'rgb(115, 10, 162)';
let width = 10;
let isDrawing = false;
let coordinateX = 0;
let coordinateY = 0;
const canvasContext = canvasElement.getContext('2d');

function initCanvas() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
}

function pickSliderValue(e) {
    const displayElement = document.querySelector(selectors.DISPLAY);
    const values = {};   

    for (let element of document.querySelectorAll(selectors.SLIDER)) {
        values[element.id] = element.value;
    }    
    color = `rgb(${values.red}, ${values.green}, ${values.blue})`;
    width = values.width;
    displayElement.style.background = color;
}

function determineStartCoordinates(e) {
    isDrawing = true;
    coordinateX = e.offsetX;
    coordinateY = e.offsetY;    
}

function determineStartTouchCoordinates(e) {
    const touchItem = e.touches[0];
    e.preventDefault();
    isDrawing = true;
    coordinateX = touchItem.clientX;
    coordinateY = touchItem.clientY; 
}

function draw(x, y) {
    if (isDrawing) {
        canvasContext.beginPath();  
        canvasContext.strokeStyle = color;
        canvasContext.lineJoin = 'round';
        canvasContext.lineCap = 'round';
        canvasContext.lineWidth = width;     
        canvasContext.moveTo(coordinateX, coordinateY);    
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        canvasContext.closePath();
        coordinateX = x;
        coordinateY = y;
    } 
}

function onTouchMove(e) {  
    const touchItem = e.touches[0];  
    draw(touchItem.clientX, touchItem.clientY);
}

function onMouseMove(e) {   
    draw(e.offsetX, e.offsetY); 
}

function stopDrawing() {
    isDrawing = false;
    coordinateX = 0;
    coordinateY = 0;    
}

function listenCanvasChanges() {
    canvasElement.addEventListener('mousedown', determineStartCoordinates);
    canvasElement.addEventListener('mousemove', onMouseMove);
    canvasElement.addEventListener('mouseup', stopDrawing);
    canvasElement.addEventListener('touchstart', determineStartTouchCoordinates);
    canvasElement.addEventListener('touchmove', onTouchMove);
    canvasElement.addEventListener('touchend', stopDrawing);  
}

function init() {
    let pickerElement = document.querySelector(selectors.PICKER);
    pickerElement.addEventListener('input', pickSliderValue);
    initCanvas();
    listenCanvasChanges();    
}

init();