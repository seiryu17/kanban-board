import React, { useState } from "react";

const LoginForm = ({ onSubmit, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white py-2 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
