
import {TodoCategory } from '@/app/(DashboardLayout)/types/apps/kanban'
import mock from '../mock';

const KanbanData : TodoCategory[] =  [
  {
    id: '1',
    name: 'Todo',
    child: [
      {
        id: '101',
        task: 'This is first task',
        taskImage: '/images/kanban/kanban-img-1.jpg',
        taskText: '',
        date: '24 july',
        taskProperty: 'Design',
       
      },
      {
        id: '102',
        task: 'lets do some task on pd',
        taskImage: '',
        taskText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, o eiusmod tempor incid.',
        date: '24 july',
        taskProperty: 'Mobile',
        
      },
      {
        id: '103',
        task: 'Do some projects on React Native with Flutter',
        taskImage: '',
        taskText: '',
        date: '24 july',
        taskProperty: 'Mobile',
       
      },
    ],
  },
  {
    id: '2',
    name: 'Progress',
    child: [
      {
        id: '104',
        task: 'Design navigation changes',
        taskImage: '',
        taskText: '',
        date: '24 july',
        taskProperty: 'Mobile',
        category: ''
      },
      {
        id: '105',
        task: 'Battle with fire',
        taskImage: '/images/kanban/kanban-img-2.jpg',
        taskText: '',
        date: '24 july',
        taskProperty: 'Design',
        category: ''
      },
      {
        id: '106',
        task: 'First design concept',
        taskImage: '',
        taskText: '',
        date: '24 july',
        taskProperty: 'Mobile',
        category: ''
      },
    ],
  },
  {
    id: '3',
    name: 'Pending',
    child: [
      {
        id: '107',
        task: 'Persona development',
        taskImage: '',
        taskText:
          'Create user personas based on the research data to represent different user groups and their characteristics, gols, and behaviors..',
        date: '24 july',
        taskProperty: 'UX Stage',
        category: 'Pending',
      },
      {
        id: '108',
        task: 'Redesign overview',
        taskImage: '/images/kanban/kanban-img-3.jpg',
        taskText: '',
        date: '14 july',
        taskProperty: 'Design',
        category: 'Pending',
      },
    ],
  },
  {
    id: '4',
    name: 'Done',
    child: [
      {
        id: '109',
        task: 'Usability testing',
        taskImage: '/images/kanban/kanban-img-4.jpg',
        taskText: '',
        date: '24 july',
        taskProperty: 'Research',
        category: 'Done',
      },
      {
        id: '110',
        task: 'Introduce new navigation',
        taskImage: '',
        taskText: '',
        date: '24 july',
        taskProperty: 'Data Science',
        category: 'Done',
      },
      {
        id: '111',
        task: 'Branding visual identity',
        taskImage: '',
        taskText: '',
        date: '4 july',
        taskProperty: 'Branding',
        category: 'Done',
      },
      {
        id: '112',
        task: 'Competitor research',
        taskImage: '',
        taskText:
          'research competitors and identify weakness and strengths each of them. comparing their product features, quelity...',
        date: '14 july',
        taskProperty: 'UX Stage',
        category: 'Done',
      },
    ],
  },
];

// Extracting unique task properties from TodoData
const taskPropertiesSet = new Set<string>();

// Using forEach loops instead of flatMap
KanbanData.forEach((category) => {
  category.child.forEach((task) => {
    taskPropertiesSet.add(task.taskProperty);
  });
});

// Convert Set to array
export const TaskProperties = Array.from(taskPropertiesSet);

// Mock API endpoint to fetch TodoData
mock.onGet('/api/TodoData').reply(200, KanbanData);

// Mock API endpoint to delete a category
mock.onDelete('/api/TodoData').reply((config) => {
  const { id } = JSON.parse(config.data);
  const updatedTodoData = KanbanData.filter((category) => category.id !== id);
  return [200, updatedTodoData];
});

// Mock API endpoint to clear all tasks from a category
mock.onDelete('/api/TodoData/clearTasks').reply((config) => {
  const { categoryId } = JSON.parse(config.data);
  const updatedTodoData = KanbanData.map((category) => {
    if (category.id === categoryId) {
      return { ...category, child: [] };
    }
    return category;
  });
  return [200, updatedTodoData];
});

// Mock API endpoint to add a new task
mock.onPost('/api/TodoData/addTask').reply((config) => {
  const { categoryId, newTaskData } = JSON.parse(config.data);
  const updatedTodoData = KanbanData.map((category) => {
    if (category.id === categoryId) {
      return { ...category, child: [...category.child, newTaskData] };
    }
    return category;
  });
  return [200, updatedTodoData];
});

// Mock API endpoint to add a new category
mock.onPost('/api/TodoData/addCategory').reply((config) => {
  const { categoryName } = JSON.parse(config.data);
  const newCategory = {
    id: Math.random(),
    name: categoryName,
    child: [],
  };
  KanbanData.push(newCategory);
  return [200, newCategory];
});

// Mock API endpoint to update the name of a category
mock.onPost('/api/TodoData/updateCategory').reply((config) => {
  const { categoryId, categoryName } = JSON.parse(config.data);
  const updatedTodoData = KanbanData.map((category) => {
    if (category.id === categoryId) {
      return { ...category, name: categoryName };
    }
    return category;
  });
  return [200, updatedTodoData];
});

// Mock API endpoint to edit a task
mock.onPut('/api/TodoData/editTask').reply((config) => {
  const { taskId, newData } = JSON.parse(config.data);
  KanbanData.forEach((category) => {
    category.child.forEach((task) => {
      if (task.id === taskId) {
        Object.assign(task, newData);
      }
    });
  });
  return [200, KanbanData];
});

// Mock API endpoint to delete a task
mock.onDelete('/api/TodoData/deleteTask').reply((config) => {
  const { taskId } = JSON.parse(config.data);
  const updatedTodoData = KanbanData.filter((task) => task.id !== taskId);
  return [200, updatedTodoData];
});

export default KanbanData;
