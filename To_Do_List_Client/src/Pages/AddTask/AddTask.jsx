import { useForm } from "react-hook-form";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import "animate.css";
import useAuth from "../../Hooks/UseAuth/UseAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecureAndNormal/UseAxiosSecure";

const AddTask = () => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
  const axiosInstanceSecure = UseAxiosSecure();

  const [tasks, setTasks] = useState({
    maxLength: 50,
    length: 0
  });
  const [description, setDescription] = useState({
    maxLength: 200,
    length: 0
  });
  const { user } = useAuth();

  const onSubmit = async (data) => {
    if (!data.title) {
      // Show validation error if title is missing
      toast.error("Title is required!");
      return;
    }

    const newTask = {
      title: data.title,
      description: data.description,
      category: data.category,
      timestamp: new Date().toISOString(),
      userEmail: user?.email,
      userName: user?.displayName
    };
    console.log(newTask);

    try {
      const res = await axiosInstanceSecure.post("/tasks", newTask);
      if (res.data.status) {
        console.log("Task Data:", newTask);
        Swal.fire({
          title: "Task Added!",
          text: "Your task has been added successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "dark:bg-gray-800 dark:text-white",
            title: "dark:text-white",
            confirmButton: "dark:bg-blue-500 dark:text-white",
          },
        });
        reset();
      }
      else {
        Swal.fire({
          title: "",
          text: "Something went wrong! Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "dark:bg-gray-800 dark:text-white",
            title: "dark:text-white",
            confirmButton: "dark:bg-blue-500 dark:text-white",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while adding the task.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Update task character count and validate
  const handleTaskChange = (e) => {
    const inputValue = e.target.value.slice(0, tasks.maxLength);
    setTasks((prev) => ({
      ...prev,
      length: inputValue.length,
    }));

    if (inputValue.length > tasks.maxLength) {
      toast.error(`You can't add more than ${tasks.maxLength} characters in the title.`);
    }
  };

  // Update description character count and validate
  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value.slice(0, description.maxLength);
    setDescription((prev) => ({
      ...prev,
      length: inputValue.length,
    }));

    // Manually update form value (to keep it controlled)
    setValue("description", inputValue);

    if (inputValue.length > description.maxLength) {
      toast.error(`You can't add more than ${description.maxLength} characters in the description.`);
    }
  };

  return (
    <div className={`dark:bg-gray-900 dark:text-white bg-gray-100 text-black min-h-screen flex flex-col items-center justify-center p-4`}>
      <Helmet>
        <title>Add New Task</title>
      </Helmet>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate__animated animate__fadeIn">
        <h2 className="text-2xl font-bold text-center mb-4">Add New Task</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              {...register("title", { required: true, maxLength: tasks.maxLength })}
              onChange={handleTaskChange}
              maxLength={tasks.maxLength}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Task title...."
            />
            <p className="text-sm text-green-400">Max character {tasks.length}/{tasks.maxLength}</p>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              {...register("description", { maxLength: description.maxLength })}
              onChange={handleDescriptionChange}
              maxLength={description.maxLength}
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Task description...."
            />
            <p className="text-sm text-green-400">Max character {description.length}/{description.maxLength}</p>
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              {...register("category", { required: true })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded shadow hover:bg-blue-500"
          >
            <FaPlus /> Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
