import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
