import { useAuth } from "./hooks/useAuth";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import "./App.css";

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleHeaderAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate("/login");
      return;
    }

    navigate("/login");
  };

  return (
    <AppLayout isAuthenticated={isAuthenticated} onAuthClick={handleHeaderAuthClick}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={() => navigate("/")} />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
