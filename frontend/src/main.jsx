import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../src/store/store.js'
import AuthLoader from './routes/AuthLoader.jsx'

createRoot(document.getElementById('root')).render(
  <>
  <Provider store={store}>
    <AuthLoader>
     <App />
    </AuthLoader>
  </Provider>
  </>,
)
