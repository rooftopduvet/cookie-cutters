import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  initializeIcons,
  loadTheme,
} from '@/src/theming';
import { theme } from '@/src/styles/theme';
import { App } from './App';
import '@/src/styles/initialize.scss';

const appTheme = theme;

loadTheme(appTheme);
initializeIcons();
document.body.style.background = appTheme.semanticColors.bodyBackground;
document.body.style.color = appTheme.semanticColors.bodyText;

ReactDOM.render(
  (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
  document.getElementById('root'),
);
