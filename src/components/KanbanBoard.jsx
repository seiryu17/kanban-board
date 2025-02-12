import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTaskForm from "./AddTaskForm";

const BASE_URL = "https://678b2e531a6b89b27a29b982.mockapi.io/api/v1";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);

  const columns = ["TO DO", "DOING", "DONE"];

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === result.draggableId) {
        return {
          ...task,
          status: destination.droppableId,
          order: destination.index,
        };
      }
      if (task.order > source.index) {
        return { ...task, order: task.order - 1 };
      }
      if (task.order >= destination.index) {
        return { ...task, order: task.order + 1 };
      }
      return task;
    });

    updatedTasks.sort((a, b) => a.order - b.order);
    setTasks(updatedTasks);

    try {
      const draggedTask = tasks.find((task) => task.id === result.draggableId);
      await axios.put(`${BASE_URL}/tasks/${draggedTask.id}`, {
        status: destination.droppableId,
        order: destination.index,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleTaskClick = (task) => setSelectedTask(task);

  const handleEditTask = async (taskId) => {
    setIsEditMode(true);
    setLoadingEditData(true);
    setIsModalOpen(true);

    try {
      const response = await axios.get(`${BASE_URL}/tasks/${taskId}`);
      setSelectedTask(response.data);
    } catch (error) {
      console.error("Error fetching task for edit:", error);
    } finally {
      setLoadingEditData(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const sortedTasks = (column) =>
    tasks
      .filter((task) => task.status === column)
      .sort((a, b) => a.order - b.order);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add New Task
      </button>
      <AddTaskForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        setTasks={setTasks}
        isEditMode={isEditMode}
        task={selectedTask}
        loading={loadingEditData}
      />
      {selectedTask && !isEditMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">{selectedTask.task_name}</h2>
            <p>
              <strong>Status:</strong> {selectedTask.status}
            </p>
            <p>
              <strong>Description:</strong> {selectedTask.description}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedTask.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(selectedTask.updatedAt).toLocaleString()}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEditTask(selectedTask.id)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-200 p-4 rounded"
                >
                  <h2 className="text-lg font-bold mb-2">{column}</h2>
                  {sortedTasks(column).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 rounded shadow mb-2 cursor-pointer"
                          onClick={() => handleTaskClick(task)}
                        >
                          {task.task_name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;
