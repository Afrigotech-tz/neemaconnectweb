import { createRoot } from 'react-dom/client'
import './index.css'

// Import i18n configuration before rendering
import './i18n';

import App from './App';

createRoot(document.getElementById("root")!).render(<App />);

