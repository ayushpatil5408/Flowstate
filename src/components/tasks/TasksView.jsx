import { useState, useMemo } from "react";
import TaskItem from "./TaskItem";
import EditTaskModal from "./EditTaskModal";

export default function TasksView({
  tasks = [],
  onToggleComplete,
  onSelectFocus,
  onDelete,
  onAddTask,
  onUpdateTask,
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'high' | 'medium' | 'low' | 'completed'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("priority"); // 'priority' | 'due' | 'created'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueAt, setNewDueAt] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          if (!t.title.toLowerCase().includes(query)) return false;
        }

        // Status / Priority filter
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
        if (filter === "high") return !t.completed && t.priority === "high";
        if (filter === "medium") return !t.completed && t.priority === "medium";
        if (filter === "low") return !t.completed && t.priority === "low";
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return (
            (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2)
          );
        }
        if (sortBy === "due") {
          if (a.dueAt && b.dueAt) return a.dueAt.localeCompare(b.dueAt);
          if (a.dueAt && !b.dueAt) return -1;
          if (!a.dueAt && b.dueAt) return 1;
          return 0;
        }
        // Recently created
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tasks, filter, searchQuery, sortBy]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      dueAt: newDueAt || null,
      completed: false,
    });

    setNewTitle("");
    setNewDueAt("");
    setShowAddModal(false);
  };

  const filterTabs = [
    { id: "all", label: "All Tasks", count: tasks.length },
    {
      id: "active",
      label: "Active",
      count: tasks.filter((t) => !t.completed).length,
    },
    {
      id: "high",
      label: "High Priority",
      count: tasks.filter((t) => !t.completed && t.priority === "high").length,
    },
    {
      id: "medium",
      label: "Medium",
      count: tasks.filter((t) => !t.completed && t.priority === "medium").length,
    },
    {
      id: "low",
      label: "Low",
      count: tasks.filter((t) => !t.completed && t.priority === "low").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: tasks.filter((t) => t.completed).length,
    },
  ];

  return (
    <div className="tasks-view">
      <div className="view-header">
        <div>
          <h1 className="view-title">My Tasks</h1>
          <p className="view-subtitle">
            Manage, organize, and prioritize your workload.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={() => setShowAddModal(true)}
        >
          <span>+ New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar" role="tablist" aria-label="Task Filters">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            className={`filter-tab ${filter === tab.id ? "active" : ""}`}
            onClick={() => setFilter(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Controls row: Search + Sort */}
      <div className="tasks-controls-row">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Search tasks..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            className="select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="priority">Priority (High to Low)</option>
            <option value="due">Due Date</option>
            <option value="created">Recently Created</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-content">
        {filteredTasks.length === 0 ? (
          <div className="empty-state glass-panel">
            <span className="empty-icon">📂</span>
            <p className="empty-title">No tasks found</p>
            <p className="empty-subtitle">
              {searchQuery
                ? `No tasks matched "${searchQuery}". Try a different keyword.`
                : "No tasks in this category. Click '+ New Task' to create one."}
            </p>
          </div>
        ) : (
          <div className="tasks-list" role="list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onSelectFocus={onSelectFocus}
                onDelete={onDelete}
                onEdit={(t) => setEditingTask(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={onUpdateTask}
      />

      {/* New Task Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-panel glass-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <h3 id="modal-title" className="modal-title">
                Create New Task
              </h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowAddModal(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-task-title" className="form-label">
                  Task Title *
                </label>
                <input
                  id="modal-task-title"
                  type="text"
                  className="task-input"
                  placeholder="e.g. Finish research paper chapter"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-task-priority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="modal-task-priority"
                    className="select-control"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modal-task-due" className="form-label">
                    Deadline (optional)
                  </label>
                  <input
                    id="modal-task-due"
                    type="date"
                    className="date-control"
                    value={newDueAt}
                    onChange={(e) => setNewDueAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="action-btn-quiet"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
