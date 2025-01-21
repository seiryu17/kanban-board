import React from "react";
import { useUser } from "../context/UserContext";
import KanbanBoard from "../components/KanbanBoard";

const Dashboard = () => {
  const { user, logout } = useUser();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <KanbanBoard />
    </div>
  );
};

export default Dashboard;
