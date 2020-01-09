import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "antd/dist/antd.css";
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'rsuite/dist/styles/rsuite-default.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './compo/reducers/index';

const store = createStore(rootReducer,  composeWithDevTools() );





ReactDOM.render(
    <Provider store = {store} >

        <Router >
            <App />
        </Router>

    </Provider>
   
    , document.getElementById('root')
);


