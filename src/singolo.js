// Anchors
window.addEventListener('scroll', scroll);
const headerHeight = document.querySelector('header').offsetHeight;
const hamburger = document.querySelector('.hamburger');

function scroll (event) {
    const scrollPosition = window.scrollY + headerHeight;
    
    document.querySelectorAll('section, footer, div#home').forEach((el) => {
        if (el.offsetTop <= scrollPosition && 
            (el.offsetTop + el.offsetHeight) > scrollPosition) {
            document.querySelectorAll('nav a').forEach((a) => {
                const linkId = a.getAttribute('href').substring(1);
                if (el.getAttribute('id') !== linkId) {
                    a.classList.remove('active');
                }
                else {
                    a.classList.add('active');
                }
            })
        }
    })
}

function goToAnchor(anchorId) {
    const elTop = document.querySelector(anchorId).offsetTop;
    closeModalWindow();
    window.scrollTo({
        top: elTop - headerHeight,
        behavior: "smooth"
    });
    return false;
}

// Modal window
function closeModalWindow() {
    const activeModal = document.querySelector('.modal-window');
    
    if (activeModal !== null) {
        activeModal.classList.remove('modal-window');
        hamburger.classList.remove('hamburger-active');
        const divModal = document.querySelector('.modal-content');
        if (divModal !== null) {
            divModal.parentNode.prepend(...divModal.children);
            divModal.remove();
        }
    }
}

function openModalWindow() {
    const headerWrapper = document.querySelector('.header-wrapper');

    hamburger.classList.add('hamburger-active');
    headerWrapper.classList.add('modal-window');

    if (document.querySelector('.modal-content') === null) {
        const divModal = document.createElement('div');
        divModal.classList.add('modal-content');
        wrap(headerWrapper, divModal);
    }
}

function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

hamburger.addEventListener('click', () => {
    openModalWindow();
}) 

//Slides

let items = document.querySelectorAll(".slide"),
    totalItems = items.length,
    slide = 0;

function setInitialClasses() {
    items[totalItems - 1].classList.add("prev");
    items[0].classList.add("initial");
    items[1].classList.add("next");
}
 
function setEventListeners() {
    const arrowNext = document.querySelector('.arrow-right');
    const arrowPrev = document.querySelector('.arrow-left');

    arrowNext.addEventListener('click', moveNext);
    arrowPrev.addEventListener('click', movePrev);
}

function moveNext() { 
    if (slide === (totalItems - 1)) {
        slide = 0;
    } else {
        slide++;
    }
    moveCarouselTo(slide);
}

function movePrev() {
    if (slide === 0) {
        slide = (totalItems - 1);
    } else {
        slide--;
    }
    moveCarouselTo(slide);
}

function moveCarouselTo(slide) {
    let newPrevious = slide - 1,
        newNext = slide + 1;

    if (newNext > (totalItems - 1)) {
        newNext = 0;
    }
    if (newPrevious < 0) {
        newPrevious = totalItems - 1;
    }
    items.forEach((el) => {
        el.classList.remove('initial', 'prev', 'next');
    })

    items[newPrevious].classList.add("prev");
    items[newNext].classList.add("next");
    items[slide].classList.add("initial");
}

setInitialClasses();
setEventListeners();

//Portfolio

const tags = document.querySelectorAll('.tag');
tags.forEach((el) => {
    el.addEventListener('click', switchPortfolioImg);
})



function switchPortfolioImg (event) {
    const portfolioImg = document.querySelectorAll('.layout-4-colum img');
    const imgArray = Array.from(portfolioImg);
    const shiftImg = imgArray.shift();
    imgArray.push(shiftImg);
    document.querySelector('.layout-4-colum').replaceChildren(...imgArray);
    tags.forEach((el) => {
        el.classList.remove('active'); 
    });
    event.target.classList.add('active');  
    
}