/**
 * Storage Service for CaseCraft
 * Provides robust, fault-tolerant persistence for active consultation sessions
 * in browser localStorage to prevent loss of case transcripts and notes
 * during unexpected interruptions or page refreshes.
 */

const ACTIVE_SESSION_KEY = 'casecraft_active_session_v1';

export const storageService = {
  /**
   * Save the active consultation session to localStorage
   */
  saveActiveSession(sessionData) {
    if (!sessionData) return;
    try {
      const payload = {
        version: 1,
        savedAt: new Date().toISOString(),
        scenarioId: sessionData.scenarioId,
        currentScenario: sessionData.currentScenario,
        scenariosList: sessionData.scenariosList,
        messages: sessionData.messages || [],
        caseNotes: sessionData.caseNotes || {},
        probedCategories: sessionData.probedCategories || {},
        evaluationReport: sessionData.evaluationReport || null
      };
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('[StorageService] Failed to save active case session to localStorage:', err);
    }
  },

  /**
   * Load the active consultation session from localStorage
   * Returns parsed session or null if empty/invalid
   */
  loadActiveSession() {
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.scenarioId || !Array.isArray(data.messages)) {
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[StorageService] Failed to load active case session from localStorage:', err);
      return null;
    }
  },

  /**
   * Clear the active consultation session from localStorage
   */
  clearActiveSession() {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (err) {
      console.warn('[StorageService] Failed to clear active case session from localStorage:', err);
    }
  },

  /**
   * Check if an active consultation session exists in localStorage
   */
  hasActiveSession() {
    try {
      return Boolean(localStorage.getItem(ACTIVE_SESSION_KEY));
    } catch {
      return false;
    }
  }
};
