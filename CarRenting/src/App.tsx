
import { useEffect } from 'react';

import { AuthProvider } from './config/AuthProvider';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  useEffect(() => {
    // Añadir Bootstrap CSS
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);

    // Añadir Bootstrap JS
    const bootstrapJS = document.createElement('script');
    bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    bootstrapJS.defer = true;
    document.body.appendChild(bootstrapJS);

  }, []);
  return (
    <AuthProvider>
    <AppRoutes />
  </AuthProvider>
  )
}

export default App
