import './App.css';
import Camera from './components/Camera';

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-lg p-4">
        <Camera />
      </div>
    </div>
  );
}

export default App;