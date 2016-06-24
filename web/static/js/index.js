import React from 'react';
import ReactDOM from 'react-dom';
import Index from './containers';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
ReactDOM.render(<Index />, document.getElementById('index'));
