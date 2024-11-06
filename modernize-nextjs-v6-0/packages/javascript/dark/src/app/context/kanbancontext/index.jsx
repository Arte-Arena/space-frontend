"use client";
import { createContext, useState, useEffect } from "react"
import axios from '@/utils/axios';


export const KanbanDataContext = createContext();
const config = {
    todoCategories: [],
    error: null,
}

export const KanbanDataContextProvider = ({ children }) => {
    const [todoCategories, setTodoCategories] = useState(config.todoCategories);
    const [error, setError] = useState(config.error);
    // Fetch todo data from the API 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/TodoData');
                setTodoCategories(response.data);
                setError(null);
            } catch (error) {
                handleError(error.message);
            }
        };
        fetchData();
    }, []);


    const moveTask = (taskId, sourceCategoryId, destinationCategoryId, sourceIndex, destinationIndex) => {
        setTodoCategories((prevCategories) => {
            // Find the source and destination categories
            const sourceCategoryIndex = prevCategories.findIndex(cat => cat.id.toString() === sourceCategoryId);
            const destinationCategoryIndex = prevCategories.findIndex(cat => cat.id.toString() === destinationCategoryId);

            if (sourceCategoryIndex === -1 || destinationCategoryIndex === -1) {
                return prevCategories; // Return previous state if categories are not found
            }
            // Clone the source and destination categories
            const updatedCategories = [...prevCategories];
            const sourceCategory = { ...updatedCategories[sourceCategoryIndex] };
            const destinationCategory = { ...updatedCategories[destinationCategoryIndex] };

            // Remove the task from the source category
            const taskToMove = sourceCategory.child.splice(sourceIndex, 1)[0];

            // Insert the task into the destination category at the specified index
            destinationCategory.child.splice(destinationIndex, 0, taskToMove);

            // Update the categories in the state
            updatedCategories[sourceCategoryIndex] = sourceCategory;
            updatedCategories[destinationCategoryIndex] = destinationCategory;

            return updatedCategories;
        });
    };

    // Function to handle errors
    const handleError = (errorMessage) => {
        setError(errorMessage);
    };
    // Function to delete a category
    const deleteCategory = async (categoryId, setTodoCategories) => {
        try {
            const response = await axios.delete('/api/TodoData', { data: { id: categoryId } });
            setTodoCategories(response.data);
            setError(null);
        } catch (error) {
            handleError(error.message);
        }
    };
    // Function to clear all tasks in a category
    const clearAllTasks = async (categoryId) => {
        try {
            const response = await axios.delete('/api/TodoData/clearTasks', { data: { categoryId } });
            const updatedTodoData = response.data;
            setTodoCategories(updatedTodoData);
            setError(null);
        } catch (error) {
            handleError(error.message);
        }
    };
    // Function to add a new category
    const addCategory = async (categoryName) => {
        try {
            const response = await axios.post('/api/TodoData/addCategory', { categoryName });
            setTodoCategories(prevCategories => [...prevCategories, response.data]);
            setError(null);
        } catch (error) {
            handleError(error.message);
        }
    };
    // Function to delete a todo task
    const deleteTodo = async (taskId, setTodoCategories) => {
        try {
            const response = await axios.delete('/api/TodoData/deleteTask', { data: { taskId } });
            setTodoCategories(response.data);

        } catch (error) {
            handleError(error.message);
        }
    };
    return (
        <KanbanDataContext.Provider value={{ todoCategories, addCategory, deleteCategory, clearAllTasks, deleteTodo, setError, moveTask }}>
            {children}
        </KanbanDataContext.Provider>
    );
}



