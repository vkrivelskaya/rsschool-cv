function setFilter(e) {
    if (e.target.nodeName === 'INPUT') {
        const suffix = e.target.dataset.sizing || '';
        document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + suffix);
    }   
}

function init() {
    const filtersContainerElement = document.querySelector('.controls');

    filtersContainerElement.addEventListener('change', setFilter);
    filtersContainerElement.addEventListener('mousemove',setFilter);
}

init();