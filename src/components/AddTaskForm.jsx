import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTaskForm = ({ isOpen, onClose, setTasks, task }) => {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("TO DO");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);

  useEffect(() => {
    if (task) {
      setTaskName(task.task_name);
      setStatus(task.status);
      setDescription(task.description || "");
      setOrder(task.order || 1);
    } else {
      setTaskName("");
      setStatus("TO DO");
      setDescription("");
      setOrder(1);
    }
  }, [isOpen, task]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedTask = {
      task_name: taskName,
      status: status,
      description: description,
      order: order,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (task) {
        const response = await axios.put(
          `https://678b2e531a6b89b27a29b982.mockapi.io/api/v1/tasks/${task.id}`,
          updatedTask
        );

        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task.id ? response.data : t))
        );
      } else {
        const newTask = {
          ...updatedTask,
          createdAt: new Date().toISOString(),
        };

        const response = await axios.post(
          "https://678b2e531a6b89b27a29b982.mockapi.io/api/v1/tasks",
          newTask
        );

        setTasks((prevTasks) => [...prevTasks, response.data]);
      }

      setTaskName("");
      setStatus("TO DO");
      setDescription("");
      setOrder(1);
      onClose();
    } catch (error) {
      console.error(
        task ? "Error updating task:" : "Error adding task:",
        error
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {task ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="TO DO">TO DO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min="1"
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              {task ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
