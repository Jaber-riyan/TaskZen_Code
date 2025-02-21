import React, { useEffect } from 'react';
import UseTaskCategoryWise from '../../Hooks/UseTaskCategoryWise/UseTaskCategoryWise';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../Hooks/UseAxiosSecureAndNormal/UseAxiosSecure';
import TaskCard from '../TaskCard/TaskCard';
import Swal from 'sweetalert2';
import DropArea from '../DropArea/DropArea';
import Loading from '../../Pages/Shared/Loading/Loading';

const TaskColumn = ({ title, icon, status, setActiveCard, tasks, tasksLoading, tasksRefetch, onDrop }) => {
    // const {taskCategoryWise, refetchTaskCategoryWise, isLoadingTaskCategoryWise} = UseTaskCategoryWise(status)
    const axiosInstanceSecure = UseAxiosSecure()
    const { data: taskCategoryWise, refetch: refetchTaskCategoryWise, isLoading: isLoadingTaskCategoryWise } = useQuery({
        queryKey: ['tasks', status],
        queryFn: async () => {
            const { data } = await axiosInstanceSecure.get(`/tasks-category/${status}`);
            return data.data;
        }
    })

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
                            tasksRefetch();
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



    // console.log(taskCategoryWise);

    if (tasksLoading) {
        return <Loading />;
    }
    return (
        <div className={`${status === "To Do" ? 'dark:bg-blue-950 bg-blue-400' : status === "In Progress" ? 'dark:bg-orange-800 bg-orange-400' : 'dark:bg-green-900 bg-green-400'} p-5 rounded-xl`}>
            <div>
                <h3 className='text-2xl dark:text-white font-bold text-center mb-2'>{title}{icon}</h3>
                <DropArea onDrop={() => onDrop(status, 0)}></DropArea>
            </div>
            <div className='mt-5 space-y-5'>
                {
                    tasks ?
                        tasks.map((task, index) =>
                            task?.category === status && (
                                <React.Fragment key={index}>
                                    <TaskCard onDelete={onDelete} task={task} index={index} setActiveCard={setActiveCard}></TaskCard>
                                    <DropArea onDrop={() => onDrop(status, index + 1)}></DropArea>
                                </React.Fragment>
                            )
                        )
                        :
                        <h2 className='text-center dark:text-white'>No Task</h2>
                }
            </div>
        </div>
    );
};

export default TaskColumn;