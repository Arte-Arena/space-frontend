"use client"
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/utils/axios';
import { TodoCategory, TodoTask } from '@/app/(DashboardLayout)/types/apps/kanban';

interface KanbanDataContextProps {
    children: ReactNode;
}

interface KanbanContextType {
    todoCategories: TodoCategory[];
    addCategory: (categoryName: string) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    clearAllTasks: (categoryId: string) => Promise<void>;
    deleteTodo: (taskId: number) => Promise<void>;
    setError: (errorMessage: string | null) => void;
    moveTask: (
        taskId: number,
        sourceCategoryId: string,
        destinationCategoryId: string,
        sourceIndex: number,
        destinationIndex: number
    ) => void;
}

export const KanbanDataContext = createContext<KanbanContextType>({} as KanbanContextType);

export const KanbanDataContextProvider: React.FC<KanbanDataContextProps> = ({ children }) => {
    const [todoCategories, setTodoCategories] = useState<TodoCategory[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch todo data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<TodoCategory[]>('/api/TodoData');
                setTodoCategories(response.data);
                setError(null);
            } catch (error: any) {
                handleError(error.message);
            }
        };
        fetchData();
    }, []);



    const moveTask = (taskId: any, sourceCategoryId: any, destinationCategoryId: any, sourceIndex: number, destinationIndex: number) => {

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

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const response = await axios.delete<TodoCategory[]>(`/api/TodoData?id=${categoryId}`);
            setTodoCategories(response.data);
            setError(null);
        } catch (error: any) {
            handleError(error.message);
        }
    };

    const clearAllTasks = async (categoryId: string) => {
        try {
            const response = await axios.delete<TodoCategory[]>(`/api/TodoData/clearTasks?id=${categoryId}`);
            setTodoCategories(response.data);
            setError(null);
        } catch (error: any) {
            handleError(error.message);
        }
    };

    const addCategory = async (categoryName: string) => {
        try {
            const response = await axios.post<TodoCategory>('/api/TodoData/addCategory', { categoryName });
            setTodoCategories((prevCategories) => [...prevCategories, response.data]);
            setError(null);
        } catch (error: any) {
            handleError(error.message);
        }
    };

    const deleteTodo = async (taskId: number) => {
        try {
            const response = await axios.delete<TodoCategory[]>(`/api/TodoData/deleteTask?id=${taskId}`);
            setTodoCategories(response.data);
        } catch (error: any) {
            handleError(error.message);
        }
    };

    return (
        <KanbanDataContext.Provider value={{ todoCategories, addCategory, deleteCategory, clearAllTasks, deleteTodo, setError, moveTask }}>
            {children}
        </KanbanDataContext.Provider>
    );
};




