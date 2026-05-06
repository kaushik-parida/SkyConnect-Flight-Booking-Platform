import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (loginData) => {
    const { token, role, user: userData } = loginData;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userProfile", JSON.stringify(userData));
    localStorage.setItem("userId", userData.userId);

    setUser(userData);
    setRole(role);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, isAuthenticated, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
