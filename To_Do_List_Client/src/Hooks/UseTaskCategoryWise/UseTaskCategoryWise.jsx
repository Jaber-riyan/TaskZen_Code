import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../UseAxiosSecureAndNormal/UseAxiosSecure";

const UseTaskCategoryWise = ({ category }) => {
    const axiosInstanceSecure = UseAxiosSecure();
    console.log(category);
    const { data: taskCategoryWise, refetch: refetchTaskCategoryWise, isLoading: isLoadingTaskCategoryWise } = useQuery({
        queryKey: ['tasks', category],
        queryFn: async () => {
            const { data } = await axiosInstanceSecure.get(`/tasks-category/${category}`);
            return data.data;
        }
    })


    return { taskCategoryWise, refetchTaskCategoryWise, isLoadingTaskCategoryWise };
};

export default UseTaskCategoryWise;