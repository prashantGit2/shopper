import './App.css';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import {BrowserRouter as Router,Route,Routes } from "react-router-dom"
function App() {
  return (
    <>
    <Router >
      <Navbar/>
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/Product' element={<h1>Product</h1>} />
        <Route path='/Contact' element={<h1>Contact</h1>} />
        <Route path='/About' element={<h1>About</h1>} />
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;