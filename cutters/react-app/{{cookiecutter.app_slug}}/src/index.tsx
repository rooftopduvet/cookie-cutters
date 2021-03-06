import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import {
  initializeIcons,
  loadTheme,
} from '@/src/theming'
import { theme } from '@/src/styles/theme'
import { App } from './App'
import '@/src/styles/initialize.scss'

loadTheme(theme)
initializeIcons()
document.body.style.background = theme.semanticColors.bodyBackground

ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
  ,document.getElementById('root')
)