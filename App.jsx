import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MisPedidos from "./pages/MisPedidos";
import EmpleadoDashboard from "./pages/EmpleadoDashboard";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import EmpleadoRegister from "./pages/EmpleadoRegister";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/empleados" element={<EmpleadoDashboard />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/empleado-register" element={<EmpleadoRegister />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
