import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddItemForm from './components/AddItemForm';
import ItemsList from './components/ItemsList';
import EditItemForm from './components/EditItemForm';
import AddUser from './components/AddUser';
import PurchaseHistory from './components/PurchaseHistory';
import AddPurchaseModal from './components/AddPurchaseModal';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app-container">
        <nav>
          <div className="nav-content">
            <ul className="nav-links">
              <li>
                <Link to="/">Tabak Liste</Link>
              </li>
              <li>
                <Link to="/add-item">Tabak Hinzufügen</Link>
              </li>
              <li>
                <Link to="/add-user">Benutzer Hinzufügen</Link>
              </li>
              <li>
                <Link to="/purchase-history">Tabak Kauf verlauf</Link> {/* New Link */}
              </li>
            </ul>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'} 
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ItemsList />} />
            <Route path="/add-User" element={<AddUser />} />
            <Route path="/add-item" element={<AddItemForm />} />
            <Route path="/edit-item/:id" element={<EditItemForm />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/purchase-history" element={<AddPurchaseModal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;