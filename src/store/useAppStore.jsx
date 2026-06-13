import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  INITIAL_DESKS,
  ACTIVITY_FEED,
  SUMMARY_STATS,
  STUDENTS,
  CURRENT_STUDENT,
} from '../data/mockData';

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  desks: INITIAL_DESKS,
  activityFeed: [...ACTIVITY_FEED].reverse().slice(0, 20),
  stats: { ...SUMMARY_STATS },
  currentStudent: CURRENT_STUDENT,
  students: STUDENTS,
  // The desk the current student is sitting at
  myDeskId: 'C07',
  awayModal: { open: false, deskId: null },
  // highlighted desks for smart seat finder
  highlightedDesks: [],
  notification: null,
};

// ── Reducer ───────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'CHECKIN': {
      const { deskId, studentId } = action.payload;
      const student = state.students.find(s => s.id === studentId) ?? state.currentStudent;
      const updatedDesks = state.desks.map(d =>
        d.id === deskId
          ? { ...d, status: 'occupied', student: studentId, checkIn: new Date().toISOString() }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: deskId,
        action: 'Occupied',
        student: student.name,
        icon: 'check-in',
      };
      const newStats = computeStats(updatedDesks, state.stats);
      return {
        ...state,
        desks: updatedDesks,
        myDeskId: studentId === state.currentStudent.id ? deskId : state.myDeskId,
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: newStats,
        highlightedDesks: [],
        notification: { type: 'success', message: `Checked into Desk ${deskId}` },
      };
    }

    case 'MARK_AWAY': {
      const { deskId } = action.payload;
      const desk = state.desks.find(d => d.id === deskId);
      if (!desk) return state;
      const student = state.students.find(s => s.id === desk.student);
      const updatedDesks = state.desks.map(d =>
        d.id === deskId
          ? { ...d, status: 'away', awayStart: new Date().toISOString() }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: deskId,
        action: 'Away',
        student: student?.name ?? 'Unknown',
        icon: 'away',
      };
      return {
        ...state,
        desks: updatedDesks,
        awayModal: { open: true, deskId },
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: computeStats(updatedDesks, state.stats),
      };
    }

    case 'RETURN': {
      const { deskId } = action.payload;
      const desk = state.desks.find(d => d.id === deskId);
      const student = state.students.find(s => s.id === desk?.student);
      const updatedDesks = state.desks.map(d =>
        d.id === deskId
          ? { ...d, status: 'occupied', awayStart: null }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: deskId,
        action: 'Returned',
        student: student?.name ?? 'Unknown',
        icon: 'check-in',
      };
      return {
        ...state,
        desks: updatedDesks,
        awayModal: { open: false, deskId: null },
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: computeStats(updatedDesks, state.stats),
        notification: { type: 'info', message: `Welcome back! Desk ${deskId} is yours.` },
      };
    }

    case 'RELEASE': {
      const { deskId } = action.payload;
      const desk = state.desks.find(d => d.id === deskId);
      const student = state.students.find(s => s.id === desk?.student);
      const updatedDesks = state.desks.map(d =>
        d.id === deskId
          ? { ...d, status: 'available', student: null, checkIn: null, awayStart: null }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: deskId,
        action: 'Released',
        student: student?.name ?? 'Unknown',
        icon: 'release',
      };
      return {
        ...state,
        desks: updatedDesks,
        myDeskId: state.myDeskId === deskId ? null : state.myDeskId,
        awayModal: { open: false, deskId: null },
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: computeStats(updatedDesks, state.stats),
        notification: { type: 'warning', message: `Desk ${deskId} released and available.` },
      };
    }

    case 'ABANDON': {
      const { deskId } = action.payload;
      const desk = state.desks.find(d => d.id === deskId);
      const student = state.students.find(s => s.id === desk?.student);
      const updatedDesks = state.desks.map(d =>
        d.id === deskId
          ? { ...d, status: 'abandoned' }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: deskId,
        action: 'Abandoned',
        student: student?.name ?? 'Unknown',
        icon: 'abandoned',
      };
      return {
        ...state,
        desks: updatedDesks,
        awayModal: { open: false, deskId: null },
        myDeskId: state.myDeskId === deskId ? null : state.myDeskId,
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: computeStats(updatedDesks, state.stats),
      };
    }

    case 'RESET_DESK': {
      const { deskId } = action.payload;
      const updatedDesks = state.desks.map(d =>
        d.id === deskId
          ? { ...d, status: 'available', student: null, checkIn: null, awayStart: null }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: deskId,
        action: 'Reset by Librarian',
        student: 'Librarian',
        icon: 'release',
      };
      return {
        ...state,
        desks: updatedDesks,
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: computeStats(updatedDesks, state.stats),
        notification: { type: 'success', message: `Desk ${deskId} reset to available.` },
      };
    }

    case 'RESET_ALL_ABANDONED': {
      const updatedDesks = state.desks.map(d =>
        d.status === 'abandoned'
          ? { ...d, status: 'available', student: null, checkIn: null, awayStart: null }
          : d
      );
      const newEntry = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        desk: 'ALL',
        action: 'Mass Reset by Librarian',
        student: 'Librarian',
        icon: 'release',
      };
      return {
        ...state,
        desks: updatedDesks,
        activityFeed: [newEntry, ...state.activityFeed].slice(0, 50),
        stats: computeStats(updatedDesks, state.stats),
        notification: { type: 'success', message: 'All abandoned desks have been reset.' },
      };
    }

    case 'CLOSE_AWAY_MODAL':
      return { ...state, awayModal: { open: false, deskId: null } };

    case 'SET_HIGHLIGHTED_DESKS':
      return { ...state, highlightedDesks: action.payload };

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };

    default:
      return state;
  }
}

// ── Helpers ───────────────────────────────────────────────────
function computeStats(desks, prevStats) {
  const available = desks.filter(d => d.status === 'available').length;
  const occupied  = desks.filter(d => d.status === 'occupied').length;
  const away      = desks.filter(d => d.status === 'away').length;
  const abandoned = desks.filter(d => d.status === 'abandoned').length;
  const total     = desks.length;
  const occupancyPercent = Math.round(((occupied + away) / total) * 100);
  return { ...prevStats, available, occupied, away, abandoned, totalDesks: total, occupancyPercent };
}

// ── Context ───────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const checkIn      = useCallback((deskId, studentId) => dispatch({ type: 'CHECKIN',     payload: { deskId, studentId } }), []);
  const markAway     = useCallback((deskId)             => dispatch({ type: 'MARK_AWAY',   payload: { deskId } }),            []);
  const returnDesk   = useCallback((deskId)             => dispatch({ type: 'RETURN',      payload: { deskId } }),            []);
  const releaseDesk  = useCallback((deskId)             => dispatch({ type: 'RELEASE',     payload: { deskId } }),            []);
  const abandonDesk  = useCallback((deskId)             => dispatch({ type: 'ABANDON',     payload: { deskId } }),            []);
  const resetDesk    = useCallback((deskId)             => dispatch({ type: 'RESET_DESK',  payload: { deskId } }),            []);
  const resetAllAbandoned = useCallback(() => dispatch({ type: 'RESET_ALL_ABANDONED' }), []);
  const closeAwayModal    = useCallback(() => dispatch({ type: 'CLOSE_AWAY_MODAL' }),    []);
  const setHighlighted    = useCallback((ids) => dispatch({ type: 'SET_HIGHLIGHTED_DESKS', payload: ids }), []);
  const clearNotification = useCallback(() => dispatch({ type: 'CLEAR_NOTIFICATION' }),  []);

  const getStudent = useCallback((id) => state.students.find(s => s.id === id) ?? null, [state.students]);
  const getMyDesk  = useCallback(() => state.desks.find(d => d.id === state.myDeskId) ?? null, [state.desks, state.myDeskId]);

  return (
    <AppContext.Provider value={{
      state,
      checkIn, markAway, returnDesk, releaseDesk, abandonDesk,
      resetDesk, resetAllAbandoned, closeAwayModal, setHighlighted, clearNotification,
      getStudent, getMyDesk,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
