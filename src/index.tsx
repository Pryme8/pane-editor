import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Editor} from './editor';
import { v4 as getUid } from 'uuid';

ReactDOM.render(
  <React.StrictMode>
    <Editor uid={getUid()} />
  </React.StrictMode>,
  document.getElementById('editor-root')
);
