/**
 * Storage Service for FLOWSTATE
 * Handles versioned localStorage persistence with resilience, corruption recovery,
 * and clearly marked initial sample data (PRD §7.9, §11.3).
 */

import { getTodayDateString, getTomorrowDateString } from "../utils/dateUtils";

const STORAGE_KEYS = {
  TASKS: "FLOWSTATE_TASKS_V1",
  SETTINGS: "FLOWSTATE_SETTINGS_V1",
  SESSIONS: "FLOWSTATE_SESSIONS_V1",
};

/**
 * Initial sample demonstration tasks.
 * Clearly marked with isSample: true as mandated by PRD §1.1.
 */
export function getInitialSampleTasks() {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  return [
    {
      id: "sample-task-1",
      title: "Review machine learning assignment & verify benchmark metrics",
      priority: "high",
      dueAt: today,
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      completedAt: null,
      isSample: true,
    },
    {
      id: "sample-task-2",
      title: "Prepare presentation slides for architecture design sprint",
      priority: "high",
      dueAt: tomorrow,
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      completedAt: null,
      isSample: true,
    },
    {
      id: "sample-task-3",
      title: "Conduct literature survey and summarize findings for thesis topic",
      priority: "medium",
      dueAt: null,
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      completedAt: null,
      isSample: true,
    },
    {
      id: "sample-task-4",
      title: "Audit and clean up local repository documentation & dependencies",
      priority: "low",
      dueAt: null,
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      completedAt: null,
      isSample: true,
    },
    {
      id: "sample-task-5",
      title: "Submit weekly progress summary to project lead",
      priority: "medium",
      dueAt: today,
      completed: true,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      isSample: true,
    },
  ];
}

const DEFAULT_SETTINGS = {
  defaultFocusMinutes: 25,
  backgroundIntensity: "vibrant", // 'vibrant' | 'muted' | 'minimal' | 'off'
  soundEnabled: true,
  themePalette: "Nebula",
};

export const storageService = {
  loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!raw) {
        const initial = getInitialSampleTasks();
        this.saveTasks(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : getInitialSampleTasks();
    } catch (err) {
      console.warn("Storage load error, falling back to sample tasks:", err);
      return getInitialSampleTasks();
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (err) {
      console.error("Storage save failed:", err);
      return false;
    }
  },

  loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },

  loadFocusSessions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveFocusSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return true;
    } catch {
      return false;
    }
  },

  resetToSampleData() {
    const samples = getInitialSampleTasks();
    this.saveTasks(samples);
    return samples;
  },

  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      return [];
    } catch {
      return [];
    }
  },
};
