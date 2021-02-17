let selectors = {
    DISPLAY: '.display',
    PICKER: '.picker',
    SLIDER: '.slider',
};
const canvas = document.querySelector('#draw');
let color = 'rgb(115, 10, 162)';
let width = 10;
let isDrawing = false;
let coordinateX = 0;
let coordinateY = 0;
const canvasContext = canvas.getContext('2d');

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

function getStartCoordinates(e) {
    isDrawing = true;
    coordinateX = e.offsetX
    coordinateY = e.offsetY;    
}

function getStartTouchCoordinates(e) {
    e.preventDefault();
    isDrawing = true;
    coordinateX = e.touches[0].clientX
    coordinateY = e.touches[0].clientY; 
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
        coordinateX = x
        coordinateY = y;
    } 
}

function onTouchMove(e) {    
    draw(e.touches[0].clientX, e.touches[0].clientY);
}

function onMouseMove(e) {   
    draw(e.offsetX, e.offsetY); 
}

function stopDrawing() {
    isDrawing = false;
    coordinateX = 0;
    coordinateY = 0;    
}

function init() {
    let pickerElement = document.querySelector(selectors.PICKER);
    pickerElement.addEventListener('input', pickSliderValue);
    initCanvas();
    canvas.addEventListener('mousedown', getStartCoordinates);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', getStartTouchCoordinates);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', stopDrawing);  
}

init();