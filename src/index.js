import 'regenerator-runtime/runtime';
import './styles/style.scss';

import { Application } from './js/application';

function initApplication() {
    const application = new Application();
    application.init();
}

function init() {    
    window.addEventListener('DOMContentLoaded', initApplication);    
}

init();