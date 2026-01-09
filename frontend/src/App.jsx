import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import BudgetPage from "./pages/BudgetPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="appShell">
        <div className="appFrame">
          <div className="topBar">
            <div className="brand">
              <span className="brandDot"></span>
              Budg'Et
              
            </div>

            <div className="nav">
              <Link to="/">Home</Link>
              <Link to="/budget">My Budget</Link>
              <Link to="/users">Users</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>

          <div className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
