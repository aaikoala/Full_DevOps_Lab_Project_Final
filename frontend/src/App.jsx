import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./component/Header";
// 👇 On importe la Page au lieu des composants séparés
import BudgetPage from "./pages/BudgetPage"; 

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "15px" }}>Accueil</Link>
        <Link to="/budget">Mon Budget</Link>
      </nav>

      <Header />

      <Routes>
        <Route path="/" element={<h2>Message Serveur : {message}</h2>} />
        
        {/* 👇 La route utilise maintenant la Page complète */}
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;