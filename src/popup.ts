import React from 'react';
import ReactDOM from 'react-dom';
import { PopupRootComponent } from './components/popup-root.component';

window.addEventListener('load', () => {
    ReactDOM.render(React.createElement(PopupRootComponent), document.getElementById('app'));
});
