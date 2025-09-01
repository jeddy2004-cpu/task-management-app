import React, { useState, useEffect, useReducer } from 'react';
import { 
  Plus, Trash2, Edit2, Check, X, Search, Filter, Calendar, 
  Clock, User, Star, Archive, Bell, Settings, LogOut, 
  Layout, List, Grid, Moon, Sun, ArrowUp, ArrowDown,
  AlertCircle, MessageCircle, Share2, Eye, EyeOff
} from 'lucide-react';

// Mock data
const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Draft and finalize the Q3 project proposal for client review",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-12-15",
    createdAt: "2023-12-01",
    tags: ["work", "important"],
    assignee: "John Doe",
    completed: false,
    progress: 65,
    estimatedTime: 8,
    actualTime: 5,
    reminders: ["2023-12-10T09:00"],
    comments: [
      { id: 1, user: "Alice", text: "Great start on this!", timestamp: "2023-12-02T10:30" },
      { id: 2, user: "Bob", text: "Need to add budget details", timestamp: "2023-12-03T14:15" }
    ],
    isFavorite: true,
    dependencies: [],
    timeLogged: [
      { date: "2023-12-02", hours: 2 },
      { date: "2023-12-03", hours: 3 }
    ]
  },
  {
    id: 2,
    title: "Design homepage mockup",
    description: "Create wireframes and high-fidelity designs for the new homepage",
    status: "todo",
    priority: "medium",
    dueDate: "2023-12-20",
    createdAt: "2023-12-02",
    tags: ["design", "ui"],
    assignee: "Sarah Wilson",
    completed: false,
    progress: 0,
    estimatedTime: 12,
    actualTime: 0,
    reminders: ["2023-12-18T10:00"],
    comments: [],
    isFavorite: false,
    dependencies: [1],
    timeLogged: []
  },
  {
    id: 3,
    title: "Review code pull requests",
    description: "Review and merge pending pull requests from team members",
    status: "done",
    priority: "low",
    dueDate: "2023-12-05",
    createdAt: "2023-12-03",
    tags: ["development", "code"],
    assignee: "Mike Johnson",
    completed: true,
    progress: 100,
    estimatedTime: 4,
    actualTime: 3.5,
    reminders: [],
    comments: [
      { id: 3, user: "Team", text: "All PRs merged successfully", timestamp: "2023-12-05T16:45" }
    ],
    isFavorite: false,
    dependencies: [],
    timeLogged: [
      { date: "2023-12-04", hours: 2 },
      { date: "2023-12-05", hours: 1.5 }
    ]
  },
  {
    id: 4,
    title: "Prepare weekly report",
    description: "Compile metrics and insights for the weekly team meeting",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-12-08",
    createdAt: "2023-12-04",
    tags: ["report", "meeting"],
    assignee: "Emma Davis",
    completed: false,
    progress: 40,
    estimatedTime: 6,
    actualTime: 2.5,
    reminders: ["2023-12-07T08:00"],
    comments: [
      { id: 4, user: "Manager", text: "Include Q3 revenue metrics", timestamp: "2023-12-05T09:20" }
    ],
    isFavorite: true,
    dependencies: [],
    timeLogged: [
      { date: "2023-12-05", hours: 2.5 }
    ]
  }
];

const initialProjects = [
  { id: 1, name: "Q3 Product Launch", tasks: [1, 2], color: "bg-blue-500" },
  { id: 2, name: "Website Redesign", tasks: [2, 4], color: "bg-purple-500" },
  { id: 3, name: "Internal Tools", tasks: [3], color: "bg-green-500" }
];

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'UPDATE_TASK':
      return state.map(task => 
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'TOGGLE_COMPLETE':
      return state.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'SET_FAVORITE':
      return state.map(task =>
        task.id === action.payload.taskId 
          ? { ...task, isFavorite: action.payload.isFavorite } 
          : task
      );
    default:
      return state;
  }
};

const App = () => {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [projects] = useState(initialProjects);
  const [viewMode, setViewMode] = useState('board'); // 'board', 'list', 'calendar'
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: [],
    assignee: '',
    estimatedTime: 0,
    reminders: []
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesProject = !selectedProject || selectedProject.tasks.includes(task.id);
    
    return matchesSearch && matchesPriority && matchesStatus && matchesProject;
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      completed: false,
      progress: 0,
      actualTime: 0,
      comments: [],
      isFavorite: false,
      dependencies: [],
      timeLogged: []
    };
    
    dispatch({ type: 'ADD_TASK', payload: task });
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      tags: [],
      assignee: '',
      estimatedTime: 0,
      reminders: []
    });
    setShowAddTask(false);
  };

  const updateTask = (taskId, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, ...updates } });
  };

  const toggleComplete = (taskId) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: taskId });
  };

  const setFavorite = (taskId, isFavorite) => {
    dispatch({ type: 'SET_FAVORITE', payload: { taskId, isFavorite } });
  };

  const deleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    setShowTaskDetail(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const TaskCard = ({ task }) => {
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    const isOverdue = daysUntilDue < 0 && !task.completed;
    const showDueWarning = daysUntilDue <= 3 && daysUntilDue >= 0 && !task.completed;

    return (
      <div 
        className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
          task.completed ? 'opacity-75' : ''
        }`}
        onClick={() => setShowTaskDetail(task.id)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComplete(task.id);
              }}
              className={`w-5 h-5 rounded border flex items-center justify-center ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {task.completed && <Check size={12} />}
            </button>
            <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFavorite(task.id, !task.isFavorite);
            }}
            className={`p-1 rounded ${
              task.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Star size={16} fill={task.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
          {task.dueDate && (
            <div className={`flex items-center text-xs ${
              isOverdue ? 'text-red-600' : 
              showDueWarning ? 'text-orange-600' : 'text-gray-600'
            }`}>
              <Calendar size={12} className="mr-1" />
              {formatDate(task.dueDate)}
              {isOverdue && <AlertCircle size={12} className="ml-1" />}
            </div>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {task.assignee && (
          <div className="flex items-center text-sm text-gray-600">
            <User size={14} className="mr-1" />
            {task.assignee}
          </div>
        )}

        {task.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TaskBoard = () => {
    const columns = [
      { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
      { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
      { id: 'done', title: 'Done', color: 'bg-green-100' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(task => task.status === column.id);
          
          return (
            <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-96`}>
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
                {column.title}
                <span className="ml-2 bg-white bg-opacity-70 text-sm px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </h2>
              <div className="space-y-3">
                {columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TaskList = () => {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="divide-y divide-gray-200">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setShowTaskDetail(task.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(task.id);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed && <Check size={12} />}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    {task.dueDate && (
                      <>
                        <Calendar size={14} className="mr-1" />
                        {formatDate(task.dueDate)}
                      </>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorite(task.id, !task.isFavorite);
                    }}
                    className={`p-1 rounded ${
                      task.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star size={16} fill={task.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 ml-9">
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {task.progress > 0 && (
                  <div className="w-32">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No tasks found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TaskDetailModal = ({ task, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });
    const [newComment, setNewComment] = useState('');

    const handleSave = () => {
      updateTask(task.id, editedTask);
      setEditMode(false);
    };

    const addComment = () => {
      if (!newComment.trim()) return;
      
      const comment = {
        id: Date.now(),
        user: 'Current User',
        text: newComment,
        timestamp: new Date().toISOString()
      };
      
      const updatedComments = [...task.comments, comment];
      updateTask(task.id, { comments: updatedComments });
      setNewComment('');
    };

    if (!task) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFavorite(task.id, !task.isFavorite)}
                  className={`p-2 rounded ${
                    task.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star size={20} fill={task.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editedTask.status}
                      onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={editedTask.dueDate}
                      onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={editedTask.assignee}
                      onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mb-4">{task.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {formatDate(task.dueDate)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Assignee</label>
                    <div className="flex items-center text-sm">
                      <User size={14} className="mr-1 text-gray-400" />
                      {task.assignee || 'Unassigned'}
                    </div>
                  </div>
                </div>

                {(task.tags.length > 0 || task.dependencies.length > 0) && (
                  <div className="border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {task.dependencies.map(depId => {
                        const depTask = tasks.find(t => t.id === depId);
                        return depTask ? (
                          <span key={depId} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Depends: {depTask.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {task.progress > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Time Tracking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Estimated Time</label>
                      <div className="flex items-center text-sm">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {task.estimatedTime} hours
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Actual Time</label>
                      <div className="flex items-center text-sm">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {task.actualTime} hours
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Comments</h4>
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {task.comments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No comments yet</p>
                    ) : (
                      task.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleDateString()} at 
                              {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addComment()}
                    />
                    <button
                      onClick={addComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Post
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Task
                  </button>
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      task.completed 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <ArrowDown size={16} className="mr-2" />
                        Mark Incomplete
                      </>
                    ) : (
                      <>
                        <Check size={16} className="mr-2" />
                        Mark Complete
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AddTaskModal = () => {
    if (!showAddTask) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
              <button
                onClick={() => setShowAddTask(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter assignee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (hours)</label>
                <input
                  type="number"
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
              >
                <Layout size={20} />
              </button>
              <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-md ${
                  darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center space-x-2">
                <img
                  src="https://placehold.co/32x32/3b82f6/FFFFFF?text=U"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm min-h-screen p-4`}>
            <nav className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                Projects
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                  !selectedProject 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Layout size={16} />
                <span>All Tasks</span>
              </button>
              
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                    selectedProject?.id === project.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                  <span>{project.name}</span>
                </button>
              ))}

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                  Filters
                </h3>
                
                <div className="space-y-2 px-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`w-full px-2 py-1 text-sm border rounded ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className={`w-full px-2 py-1 text-sm border rounded ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                  View
                </h3>
                <div className="space-y-1 px-2">
                  <button
                    onClick={() => setViewMode('board')}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                      viewMode === 'board'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Layout size={16} />
                    <span>Board</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <List size={16} />
                    <span>List</span>
                  </button>
                </div>
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedProject ? selectedProject.name : 'All Tasks'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Task View */}
            {viewMode === 'board' ? <TaskBoard /> : <TaskList />}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showTaskDetail && (
        <TaskDetailModal 
          task={tasks.find(t => t.id === showTaskDetail)} 
          onClose={() => setShowTaskDetail(null)} 
        />
      )}
      
      <AddTaskModal />
    </div>
  );
};


export default App;
