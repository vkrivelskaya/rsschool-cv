const classes = {
    ACTIVE_LINK: 'active-link',
    SIDE_BAR: 'side-bar',
    SIDE_BAR_ACTIVE: 'side-bar-active',
    HAMBURGER: 'hamburger',
    SLIDE: 'slide',
    PREV: 'prev',
    INITIAL: 'initial',
    NEXT: 'next',    
    TAG: 'tag',
    PORTFOLIO_EXAMPLES_CONTAINER: 'portfolio-examples-container',
    PORTFOLIO_EXAMPLE: 'portfolio-example',
    ACTIVE: 'active',
}
const selectors = {
    SIDE_BAR_ACTIVE: '.side-bar-active',
    SIDE_BAR: '.side-bar',
    HAMBURGER: '.hamburger',
    SLIDE: '.slide',
    ARROW_RIGHT: '.arrow-right',
    ARROW_LEFT: '.arrow-left',
    TAG: '.tag',
    PORTFOLIO_EXAMPLE: '.portfolio-example',
    PORTFOLIO_EXAMPLES_CONTAINER: '.portfolio-examples-container',
    DIV_HOME: 'div#home',
    NAV_A: 'nav a',
}
const tags = {
    HEADER: 'header',
    SECTION: 'section',
    FOOTER: 'footer',
}
const atTributes =  {
    HREF: 'href',
    ID: 'id',
}
const headerHeight = document.querySelector(tags.HEADER).offsetHeight;
const portfolioFilters = document.querySelectorAll(selectors.TAG);

let slides = document.querySelectorAll(selectors.SLIDE),
    totalSlides = slides.length,
    slide = 0;

function setActiveLink(el) {
    document.querySelectorAll(selectors.NAV_A).forEach((a) => {
        const linkId = a.getAttribute(atTributes.HREF).substring(1);
        if (el.getAttribute(atTributes.ID) !== linkId) {
            a.classList.remove(classes.ACTIVE_LINK);
        }
        else {
            a.classList.add(classes.ACTIVE_LINK);
        }
    })
}

function scroll() {
    const scrollPosition = window.scrollY + headerHeight;
    
    document.querySelectorAll(`${tags.SECTION}, ${tags.FOOTER}, ${selectors.DIV_HOME}`).forEach((el) => {
        if (el.offsetTop <= scrollPosition && 
            (el.offsetTop + el.offsetHeight) > scrollPosition) {
            setActiveLink(el);
        }
    })
}

function goToAnchor(event, anchorId) {
    event.preventDefault();    
    closeSideBar();

    const elementTop = document.querySelector(anchorId).offsetTop;

    window.scrollTo({
        top: elementTop - headerHeight,
        behavior: 'smooth'
    });
}

function closeSideBar() {
    const activeSideBar = document.querySelector(selectors.SIDE_BAR_ACTIVE);
    
    if (activeSideBar) {
        activeSideBar.classList.remove(classes.SIDE_BAR_ACTIVE);    
    }
}

function openSideBar() {
    const sideBar = document.querySelector(selectors.SIDE_BAR);

    sideBar.classList.add(classes.SIDE_BAR_ACTIVE);
}

function initSlider() {
    const arrowNext = document.querySelector(selectors.ARROW_RIGHT);
    const arrowPrev = document.querySelector(selectors.ARROW_LEFT);

    slides[totalSlides - 1].classList.add(classes.PREV);
    slides[0].classList.add(classes.INITIAL);
    slides[1].classList.add(classes.NEXT);

    arrowNext.addEventListener('click', moveToNextSlide);
    arrowPrev.addEventListener('click', moveToPrevSlide);
}

function moveToNextSlide() { 
    if (slide === (totalSlides - 1)) {
        slide = 0;
    } else {
        slide++;
    }
    moveSliderTo(slide);
}

function moveToPrevSlide() {
    if (slide === 0) {
        slide = (totalSlides - 1);
    } else {
        slide--;
    }
    moveSliderTo(slide);
}

function moveSliderTo(slide) {
    let newPrevious = slide - 1,
        newNext = slide + 1;

    if (newNext > (totalSlides - 1)) {
        newNext = 0;
    }
    if (newPrevious < 0) {
        newPrevious = totalSlides - 1;
    }
    slides.forEach((el) => {
        el.classList.remove(classes.INITIAL, classes.PREV, classes.NEXT);
    })

    slides[newPrevious].classList.add(classes.PREV);
    slides[newNext].classList.add(classes.NEXT);
    slides[slide].classList.add(classes.INITIAL);
}

function switchPortfolioImg (event) {
    const portfolioImg = document.querySelectorAll(selectors.PORTFOLIO_EXAMPLE);
    const imgArray = Array.from(portfolioImg);    
    document.querySelector(selectors.PORTFOLIO_EXAMPLES_CONTAINER)
        .replaceChildren(...imgArray.slice(1),imgArray[0]);
    portfolioFilters.forEach((el) => {
        el.classList.remove(classes.ACTIVE); 
    });
    event.target.classList.add(classes.ACTIVE);     
}

function initHamburgers() {
    document.querySelectorAll(selectors.HAMBURGER).forEach((el) => {
        el.addEventListener('click', () => {
            const activeSideBar = document.querySelector(selectors.SIDE_BAR_ACTIVE);
            if (activeSideBar) {
                closeSideBar();
            }
            else {
                openSideBar();
            }
        }) 
    });
}

function initPortfolioFilters() {
    portfolioFilters.forEach((el) => {
        el.addEventListener('click', switchPortfolioImg);
    });
}

function init() {
    window.addEventListener('scroll', scroll);
    initHamburgers();
    initSlider();
    initPortfolioFilters();
};

init();