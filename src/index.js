import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// import MediaEditor from './media_editor'
// import LinkEditor from './link_editor'
import CustomHTMLEditor from './custom_html_editor'

ReactDOM.render(
  <div>
    <CustomHTMLEditor />
  </div>,
  document.getElementById('root')
);
