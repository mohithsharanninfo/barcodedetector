import { createRoot } from 'react-dom/client'
import './index.css'
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-grid.css';
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './reduxstore/store.js';
import { Toaster } from 'react-hot-toast';
import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({ theme: 'legacy' });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // A new version is available
            window.dispatchEvent(new Event("newUpdateAvailable"));
          }
        };
      };
    });
  });
}

createRoot(document.getElementById('root')).render(
  <div className='mx-3 lg:mx-28 '>
    <Provider store={store}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <App />
    </Provider>
  </div>
)
