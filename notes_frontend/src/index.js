import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // App now wraps with Router. No need to further wrap unless SSR etc.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
