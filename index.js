import { registerRootComponent } from 'expo';
import App from './App';

if (__DEV__) {
  console.log('Running in development mode');
}

// Register the main component
registerRootComponent(App); 