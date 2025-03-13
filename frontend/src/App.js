import './App.css';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import for React Router v6
import StartPage from './pages/StartPage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Use element instead of component */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
