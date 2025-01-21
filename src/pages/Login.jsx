import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.get(
        "https://678b2e531a6b89b27a29b982.mockapi.io/api/v1/users"
      );
      const user = response.data.find(
        (u) => u.email === username && u.password === password
      );

      if (user) {
        login(user);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow-md rounded-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
};

export default Login;
