import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { user } = useUser();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const AppWrapper = () => (
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>
);

export default AppWrapper;
