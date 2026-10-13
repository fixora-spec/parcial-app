import './global.css';
import { ExpoRoot } from 'expo-router';

export default function App() {
  const rutas = require.context('./src/app');
  return <ExpoRoot context={rutas} />;
}