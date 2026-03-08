import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useLocation } from 'react-router-dom';
import Home from './pages/Home';

import Study from './pages/Study';
import AI from './pages/AI';
import Games from './pages/Games';
import Compiler from './pages/Compiler';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Community from './pages/Community';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/ai']; // Add routes where footer should be hidden

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/games" element={<Games />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/portfolio/:username" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </main>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
