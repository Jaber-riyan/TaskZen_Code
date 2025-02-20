import { FaClipboardList } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing the edit and delete icons
import { useState } from "react";
import { Link } from "react-router-dom";

const TaskCard = ({ task, onDelete, onCategoryChange }) => {
    const [selectedCategory, setSelectedCategory] = useState(task.category);
    const [slice, setSlice] = useState(true)

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        onCategoryChange(task._id, newCategory); // Passing updated category to parent
    };

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-xl p-5 transition-all flex flex-col gap-3 w-full min-h-[250px] flex-grow">
            {/* Task Title */}
            <h3 className="text-xl font-bold flex items-center gap-2 flex-shrink-0">
                <FaClipboardList className="text-blue-500 dark:text-blue-400" />
                {task.title}
            </h3>

            {/* Task Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                {slice ? task.description.slice(0, 60) || "No description provided." : task.description || "No description provided."}
                <span onClick={() => setSlice(!slice)} className="font-semibold cursor-pointer italic">
                    {slice ? "see more..." : "see less..."}
                </span>
            </p>

            {/* Category Dropdown */}
            <div className="relative">
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="appearance-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:ring-2 dark:ring-blue-500 transition-all duration-300"
                >
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-0 top-0 mt-3 mr-3">
                    <svg
                        className="w-4 h-4 text-white transform transition-transform duration-300 group-hover:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-base">
                <MdDateRange className="mr-1" />
                {new Date(task.timestamp).toLocaleString()}
            </div>

            {/* Edit and Delete Buttons */}
            <div className="flex gap-3 mt-3">
                <Link to={`/task/${task?._id}`}
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                    <FaEdit className="text-lg" />
                </Link>
                <button
                    onClick={() => onDelete(task?._id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    <FaTrashAlt className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
