import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../src/store/store.js'
import AuthLoader from './routes/AuthLoader.jsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

createRoot(document.getElementById('root')).render(
  <>
  <Provider store={store}>
    <AuthLoader>
     <App />
    </AuthLoader>
  </Provider>
  </>,
)
