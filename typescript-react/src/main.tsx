import { createRoot } from 'react-dom/client';

import App from './App';

import 'sanitize.css';
import '@styles/global.scss';

const rootSelectorId = 'root';
const rootElement = document.getElementById(rootSelectorId);

if (rootElement === null) {
  throw new Error(`Could not find element with id ${rootSelectorId}`);
}

createRoot(rootElement).render(<App />);
