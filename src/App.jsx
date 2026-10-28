import { useState, useEffect, useCallback, useMemo } from "react";
import AppShell from "./components/layout/AppShell";
import OverviewView from "./components/dashboard/OverviewView";
import TasksView from "./components/tasks/TasksView";
import FocusView from "./components/focus/FocusView";
import SettingsView from "./components/settings/SettingsView";
import { storageService } from "./services/storage";
import { useFocusTimer } from "./hooks/useFocusTimer";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => storageService.loadTasks());
  const [settings, setSettings] = useState(() => storageService.loadSettings());
  const [activeView, setActiveView] = useState("overview"); // 'overview' | 'tasks' | 'focus' | 'settings'
  const [focusTaskId, setFocusTaskId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Focus sessions tracking
  const [focusSessions, setFocusSessions] = useState(() =>
    storageService.loadFocusSessions()
  );

  // Compute total recorded focus minutes
  const totalFocusMinutes = useMemo(() => {
    return focusSessions.reduce((acc, sess) => acc + (sess.duration || 0), 0);
  }, [focusSessions]);

  // Derived active focus task
  const focusTask = useMemo(() => {
    return tasks.find((t) => t.id === focusTaskId) || null;
  }, [tasks, focusTaskId]);

  // Sync tasks to local storage whenever modified
  const updateTasks = useCallback((newTasks) => {
    setTasks(newTasks);
    storageService.saveTasks(newTasks);
  }, []);

  // Sync settings
  const handleUpdateSettings = useCallback((updatedPartial) => {
    setSettings((prev) => {
      const next = { ...prev, ...updatedPartial };
      storageService.saveSettings(next);
      return next;
    });
  }, []);

  // Add new task
  const handleAddTask = useCallback(
    (newTaskData) => {
      const nowIso = new Date().toISOString();
      const createdTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: newTaskData.title,
        priority: newTaskData.priority || "medium",
        dueAt: newTaskData.dueAt || null,
        completed: false,
        createdAt: nowIso,
        updatedAt: nowIso,
        completedAt: null,
        isSample: false, // Explicitly user-created, not sample
      };

      updateTasks([createdTask, ...tasks]);
    },
    [tasks, updateTasks]
  );

  // Update existing task (PRD §7.3, FIX 2)
  const handleUpdateTask = useCallback(
    (taskId, updates) => {
      const updated = tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            title: updates.title !== undefined ? updates.title : t.title,
            priority: updates.priority !== undefined ? updates.priority : t.priority,
            dueAt: updates.dueAt !== undefined ? updates.dueAt : t.dueAt,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      updateTasks(updated);
    },
    [tasks, updateTasks]
  );

  // Toggle complete / reopen task (PRD §7.3, §7.4)
  const handleToggleComplete = useCallback(
    (taskId) => {
      const updated = tasks.map((t) => {
        if (t.id === taskId) {
          const willComplete = !t.completed;
          return {
            ...t,
            completed: willComplete,
            updatedAt: new Date().toISOString(),
            completedAt: willComplete ? new Date().toISOString() : null,
          };
        }
        return t;
      });
      updateTasks(updated);
    },
    [tasks, updateTasks]
  );

  // Delete task safely (PRD §15: deleting selected focus task leaves focus view valid)
  const handleDeleteTask = useCallback(
    (taskId) => {
      if (focusTaskId === taskId) {
        setFocusTaskId(null);
      }
      const updated = tasks.filter((t) => t.id !== taskId);
      updateTasks(updated);
    },
    [tasks, focusTaskId, updateTasks]
  );

  // Select task to focus on
  const handleSelectFocus = useCallback((task) => {
    setFocusTaskId(task ? task.id : null);
  }, []);

  // Record completed focus session (PRD §7.6, FIX 3)
  const handleRecordFocusMinutes = useCallback(
    (minutes) => {
      const newSession = {
        id: `session-${Date.now()}`,
        taskId: focusTaskId || null,
        duration: minutes,
        completedAt: new Date().toISOString(),
      };
      setFocusSessions((prev) => {
        const updated = [newSession, ...prev];
        storageService.saveFocusSessions(updated);
        return updated;
      });
    },
    [focusTaskId]
  );

  // Authoritative focus timer hook that stays mounted across all view switches (FIX 3)
  const timer = useFocusTimer({
    initialMinutes: settings.defaultFocusMinutes || 25,
    onRecordSession: handleRecordFocusMinutes,
  });

  // Start focus flow from widget or preset buttons
  const handleStartFocus = useCallback(
    (presetMinutes) => {
      if (presetMinutes) {
        timer.setDuration(presetMinutes);
      }
      setActiveView("focus");
    },
    [timer]
  );

  // Reset to sample data
  const handleResetSampleData = useCallback(() => {
    const samples = storageService.resetToSampleData();
    setTasks(samples);
    setFocusTaskId(null);
  }, []);

  // Clear all data
  const handleClearAllData = useCallback(() => {
    storageService.clearAllData();
    setTasks([]);
    setFocusSessions([]);
    setFocusTaskId(null);
  }, []);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Track fullscreen changes from ESC key
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const activeTaskCount = tasks.filter((t) => !t.completed).length;

  return (
    <AppShell
      activeView={activeView}
      onNavigate={setActiveView}
      activeTaskCount={activeTaskCount}
      isFullscreen={isFullscreen}
      onToggleFullscreen={handleToggleFullscreen}
      settings={settings}
    >
      {activeView === "overview" && (
        <OverviewView
          tasks={tasks}
          focusTask={focusTask}
          focusMinutes={totalFocusMinutes}
          onAddTask={handleAddTask}
          onToggleComplete={handleToggleComplete}
          onSelectFocus={(t) => {
            handleSelectFocus(t);
            setActiveView("focus");
          }}
          onDelete={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          onStartFocus={handleStartFocus}
          onViewAllTasks={() => setActiveView("tasks")}
        />
      )}

      {activeView === "tasks" && (
        <TasksView
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onSelectFocus={(t) => {
            handleSelectFocus(t);
            setActiveView("focus");
          }}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {activeView === "focus" && (
        <FocusView
          focusTask={focusTask}
          activeTasks={tasks.filter((t) => !t.completed)}
          onSelectFocusTask={handleSelectFocus}
          onCompleteTask={handleToggleComplete}
          timer={timer}
        />
      )}

      {activeView === "settings" && (
        <SettingsView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetSampleData={handleResetSampleData}
          onClearAllData={handleClearAllData}
        />
      )}
    </AppShell>
  );
}