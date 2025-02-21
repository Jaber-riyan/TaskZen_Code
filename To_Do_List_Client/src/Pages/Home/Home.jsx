import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";
import UseAxiosSecure from "../../Hooks/UseAxiosSecureAndNormal/UseAxiosSecure";
import TaskCard from "../../components/TaskCard/TaskCard";
import Loading from "../Shared/Loading/Loading";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/UseAuth/UseAuth";
import TaskColumn from "../../components/Taskcolumn/Taskcolumn";

const Home = () => {
    const swapy = useRef(null);
    const container = useRef(null);
    const { user } = useAuth();
    const axiosInstanceSecure = UseAxiosSecure();
    const [activeCard, setActiveCard] = useState(null)

    // Fetch tasks using react-query
    const { data: tasks, refetch: tasksRefetch, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const { data } = await axiosInstanceSecure.get(`/tasks/${user?.email}`);
            return data.data;
        }
    });



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

    // Task category change function
    const onCategoryChange = (taskId, newCategory) => {
        // const res = axiosInstanceSecure.patch(`/tasks-category/${taskId}`, { category: newCategory })
        // if (res?.data?.status) {
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
        // }
    };

    const onDrop = async (status, position) => {
        if (activeCard === null || activeCard === undefined) return;

        const task = tasks[activeCard]

        if (task.category === status) {
            // Reordering logic
            let updatedTasks = tasks.filter((t, i) => i !== activeCard); // Remove the dragged task
            updatedTasks.splice(position, 0, task); // Insert it at the new position 

            // Update the backend with the new order
            const res = await axiosInstanceSecure.patch(`/tasks-reorder`, { updatedTasks });
            console.log(res.data);

            tasksRefetch();
        } else {
            // If changing category
            const res = await axiosInstanceSecure.patch(`/tasks-category/${task?._id}`, { category: status });
            if (res.data.status) {
                tasksRefetch();
            }
        }
    };


    if (tasksLoading) {
        return <Loading />;
    }

    return (
        <div className="dark:bg-gray-900 pt-24 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-[85%] justify-center items-stretch min-h-[80vh] mx-auto">
                {/* {
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
                } */}
                <TaskColumn
                    title="To Do"
                    icon="📌"
                    status={"To Do"}
                    setActiveCard={setActiveCard}
                    tasks={tasks}
                    tasksRefetch={tasksRefetch}
                    tasksLoading={tasksLoading}
                    onDrop={onDrop}
                ></TaskColumn>
                <TaskColumn
                    title="In Progress"
                    icon="⚙️"
                    status={"In Progress"}
                    setActiveCard={setActiveCard}
                    tasks={tasks}
                    tasksRefetch={tasksRefetch}
                    tasksLoading={tasksLoading}
                    onDrop={onDrop}
                ></TaskColumn>
                <TaskColumn
                    title="Done"
                    icon="✅"
                    status={"Done"}
                    setActiveCard={setActiveCard}
                    tasks={tasks}
                    tasksRefetch={tasksRefetch}
                    tasksLoading={tasksLoading}
                    onDrop={onDrop}
                ></TaskColumn>
            </div>
        </div>
    );
};

export default Home;
