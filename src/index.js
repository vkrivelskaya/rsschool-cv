import 'regenerator-runtime/runtime';
import './styles/style.scss';

import { Application } from './js/application';

function init() {
    const application = new Application();
    window.addEventListener('load', application.init.bind(application));    
}

init();