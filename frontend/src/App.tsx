import './App.css'
import XMB from './rice/XMB.tsx'
// import { TestDirectories, TestWebsocket } from './fileManager/TestBackend.tsx';

function App() {
  const now = new Date();
  const minute = now.getMinutes();

  const hueOffset = (minute / 60) * 360;

  // Test the API functions - these will log to console
  // TestDirectories();
  // TestWebsocket();

  return (
        <XMB hue={hueOffset} />
  )
}

export default App
