import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import "animate.css";
import UseAxiosSecure from "../../Hooks/UseAxiosSecureAndNormal/UseAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

const UpdateTask = () => {
  const axiosInstanceSecure = UseAxiosSecure();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch task data
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axiosInstanceSecure.get(`/task/${id}`);
      return res.data.data;
    },
    onError: () => {
      toast.error("Failed to load task data!");
    },
  });

  // Initialize form with default values
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: task ? { title: task.title, description: task.description } : {},
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description });
    }
  }, [task, reset]);

  // Mutation for updating the task
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      return axiosInstanceSecure.patch(`/tasks/${id}`, updatedTask);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Task Updated!",
        text: "Your task has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "dark:bg-gray-800 dark:text-white",
          title: "dark:text-white",
          confirmButton: "dark:bg-blue-500 dark:text-white",
        },
      });
      queryClient.invalidateQueries(["task", id]);
      navigate("/");
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Something went wrong! Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const onSubmit = (data) => {
    updateTaskMutation.mutate({ title: data.title, description: data.description });
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-100 text-black min-h-screen flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Update Task</title>
      </Helmet>

      {isLoading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate__animated animate__fadeIn">
          <h2 className="text-2xl font-bold text-center mb-4">Update Task</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Task title..."
              />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Task description..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded shadow hover:bg-blue-500"
              disabled={updateTaskMutation.isLoading}
            >
              <FaEdit /> {updateTaskMutation.isLoading ? "Updating..." : "Update Task"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateTask;
