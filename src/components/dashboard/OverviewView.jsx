import { useState } from "react";
import {
  getCurrentGreeting,
  getFormattedCurrentDate,
  getTodayDateString,
} from "../../utils/dateUtils";
import QuickCapture from "./QuickCapture";
import SummaryMetrics from "./SummaryMetrics";
import UpNextSection from "./UpNextSection";
import FocusEntryWidget from "./FocusEntryWidget";
import DeadlineLabel from "../common/DeadlineLabel";
import EditTaskModal from "../tasks/EditTaskModal";

export default function OverviewView({
  tasks = [],
  focusTask,
  focusMinutes = 0,
  onAddTask,
  onToggleComplete,
  onSelectFocus,
  onDelete,
  onUpdateTask,
  onStartFocus,
  onViewAllTasks,
}) {
  const [editingTask, setEditingTask] = useState(null);
  const greeting = getCurrentGreeting();
  const currentDate = getFormattedCurrentDate();
  const today = getTodayDateString();

  const activeTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = activeTasks.filter((t) => t.dueAt && t.dueAt < today);
  const dueTodayTasks = activeTasks.filter((t) => t.dueAt && t.dueAt === today);

  return (
    <div className="overview-view">
      {/* Welcome Banner */}
      <section className="welcome-banner" aria-label="Dashboard Greeting">
        <div className="welcome-date">{currentDate}</div>
        <h1 className="welcome-title">
          {greeting}, <span className="title-accent">Scholar</span>
        </h1>
        <p className="welcome-subtitle">
          Clear your mind. Find your flow. Here is what needs your attention today.
        </p>
      </section>

      {/* Quick Capture Panel */}
      <QuickCapture onAddTask={onAddTask} />

      {/* Summary Metrics */}
      <SummaryMetrics tasks={tasks} focusMinutes={focusMinutes} />

      {/* 2-Column Main Region */}
      <div className="overview-main-grid">
        <div className="main-tasks-column">
          <UpNextSection
            tasks={tasks}
            onToggleComplete={onToggleComplete}
            onSelectFocus={onSelectFocus}
            onDelete={onDelete}
            onEditTask={(t) => setEditingTask(t)}
            onViewAllTasks={onViewAllTasks}
          />
        </div>

        <div className="sidebar-column">
          {/* Daily Focus Entry Point */}
          <FocusEntryWidget
            focusTask={focusTask}
            activeTasks={activeTasks}
            onSelectTask={onSelectFocus}
            onStartFocus={onStartFocus}
          />

          {/* Deadline Watch Card */}
          <section className="deadline-watch-card glass-panel" aria-labelledby="deadlines-heading">
            <h3 id="deadlines-heading" className="panel-title-sm">
              <span>⏳</span> Deadline Watch
            </h3>

            {overdueTasks.length === 0 && dueTodayTasks.length === 0 ? (
              <p className="watch-empty-text">No urgent deadlines pending today.</p>
            ) : (
              <ul className="deadline-list" role="list">
                {overdueTasks.map((task) => (
                  <li key={task.id} className="deadline-list-item overdue-item">
                    <span className="deadline-task-name">{task.title}</span>
                    <DeadlineLabel dueAt={task.dueAt} completed={false} />
                  </li>
                ))}
                {dueTodayTasks.map((task) => (
                  <li key={task.id} className="deadline-list-item due-today-item">
                    <span className="deadline-task-name">{task.title}</span>
                    <DeadlineLabel dueAt={task.dueAt} completed={false} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={onUpdateTask}
      />
    </div>
  );
}
