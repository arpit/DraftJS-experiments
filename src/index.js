import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MediaEditorExample from './editor2'
import LinkEditorExample from './link_editor'

ReactDOM.render(
  <div>
  <LinkEditorExample />
  <App />
  <MediaEditorExample/>
  </div>,
  document.getElementById('root')
);
