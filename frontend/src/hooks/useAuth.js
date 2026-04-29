import { useState } from "react";
import { login, register, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
      navigate("/configuracion");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await register(userData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    isAuthenticated,
  };
};
