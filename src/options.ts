import React from 'react';
import ReactDOM from 'react-dom';
import { OptionsRootComponent } from './components/options-root.component';

window.addEventListener('load', () => {
    ReactDOM.render(React.createElement(OptionsRootComponent), document.getElementById('app'));
});
