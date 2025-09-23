import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Sales from '../pages/sales';
// import other pages later, e.g., Dashboard, Stations

function App() {
  return (
    <Router>
      <div>
        {/* ===== Navbar ===== */}
        <nav className="navbar">
          <div className="container nav-container">
            <Link to="/" className="nav-logo">
              Petrol Station Tracker
            </Link>
            <div className="nav-links">
              <Link to="/sales" className="nav-link">Sales</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/stations" className="nav-link">Stations</Link>
            </div>
          </div>
        </nav>

        {/* ===== Main Content ===== */}
        <div className="container main-content">
          <Switch>
            <Route path="/sales" component={Sales} />
            {/* Placeholder routes */}
            <Route path="/dashboard" render={() => <div>Dashboard Page (Coming Soon)</div>} />
            <Route path="/stations" render={() => <div>Stations Page (Coming Soon)</div>} />
            <Route path="/" exact render={() => <div>Welcome to Petrol Tracker</div>} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
