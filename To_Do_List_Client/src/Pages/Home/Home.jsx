import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { createSwapy } from "swapy";
import UseAxiosSecure from "../../Hooks/UseAxiosSecureAndNormal/UseAxiosSecure";
import TaskCard from "../../components/TaskCard/TaskCard";
import Loading from "../Shared/Loading/Loading";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/UseAuth/UseAuth";

const Home = () => {
    const swapy = useRef(null);
    const container = useRef(null);
    const { user } = useAuth();
    const axiosInstanceSecure = UseAxiosSecure();

    // Fetch tasks using react-query
    const { data: tasks, refetch: tasksRefetch, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const { data } = await axiosInstanceSecure.get(`/tasks/${user?.email}`);
            return data.data;
        }
    });

    // Task deletion function
    const onDelete = (taskId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This task will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel",
            background: "#1f2937", 
            color: "#fff", 
            customClass: {
                popup: "dark:bg-gray-800 dark:text-white",
                title: "dark:text-white",
                confirmButton: "dark:bg-red-600 dark:text-white",
                cancelButton: "dark:bg-blue-600 dark:text-white",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstanceSecure.delete(`/tasks/${taskId}`)
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your task has been deleted.",
                                icon: "success",
                                background: "#1f2937",
                                color: "#fff",
                                confirmButtonColor: "#10b981", 
                                customClass: {
                                    popup: "dark:bg-gray-800 dark:text-white",
                                    title: "dark:text-white",
                                    confirmButton: "dark:bg-green-600 dark:text-white",
                                },
                            });
                            tasksRefetch();
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "Something went wrong.",
                                icon: "error",
                                background: "#1f2937",
                                color: "#fff",
                                confirmButtonColor: "#d33",
                                customClass: {
                                    popup: "dark:bg-gray-800 dark:text-white",
                                    title: "dark:text-white",
                                    confirmButton: "dark:bg-red-600 dark:text-white",
                                },
                            });
                        }
                    })
                    .catch((err) => {
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete task.",
                            icon: "error",
                            background: "#1f2937",
                            color: "#fff",
                            confirmButtonColor: "#d33",
                            customClass: {
                                popup: "dark:bg-gray-800 dark:text-white",
                                title: "dark:text-white",
                                confirmButton: "dark:bg-red-600 dark:text-white",
                            },
                        });
                        console.error("Delete Error:", err);
                    });
            }
        });
    };

    // Task category change function
    const onCategoryChange = (taskId, newCategory) => {
        const res = axiosInstanceSecure.patch(`/tasks-category/${taskId}`, { category: newCategory })
        if (res?.data?.status) {
            Swal.fire({
                title: "Task Category!",
                text: "Your task category has been updated!",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: "dark:bg-gray-800 dark:text-white",
                    title: "dark:text-white",
                    confirmButton: "dark:bg-blue-500 dark:text-white",
                },
            });
            tasksRefetch();
        }
    };

    // Swapy initialization and cleanup
    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current);

            swapy.current.onSwap((e) => {
                console.log('Swapped item:', e);
            });
        }

        return () => {
            swapy.current?.destroy();
        };
    }, []);

    if (tasksLoading) {
        return <Loading />;
    }

    return (
        <div className="dark:bg-gray-900 pt-24 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-[85%] justify-center items-stretch min-h-[80vh] mx-auto" ref={container}>
                {
                    tasks?.length > 0 ?
                        tasks.map((task, index) => (
                            <div key={task.id} data-swapy-slot={index}>
                                <div data-swapy-item={index}>
                                    <TaskCard
                                        task={task}
                                        onDelete={onDelete}
                                        onCategoryChange={onCategoryChange}
                                    />
                                </div>
                            </div>
                        )) :
                        <h2 className="dark:text-white text-3xl font-semibold">No Task</h2>
                }
            </div>
        </div>
    );
};

export default Home;
