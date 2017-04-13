import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MediaEditor from './media_editor'
import LinkEditor from './link_editor'

ReactDOM.render(
  <div>
  <LinkEditor />
  <App />
  <MediaEditor/>
  </div>,
  document.getElementById('root')
);
