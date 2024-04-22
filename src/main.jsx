import React from 'react';
import ReactDOM from 'react-dom/client';
import StateContext from './context/StateContext';
import App from './App';
import FunctionsContext from './context/FunctionsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StateContext>
      <FunctionsContext>
        <App/>
      </FunctionsContext>
    </StateContext>
);
