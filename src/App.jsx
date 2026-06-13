import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AwayModeModal from './components/AwayModeModal';
import Landing from './pages/Landing';
import StudentDashboard from './pages/StudentDashboard';
import LibraryMap from './pages/LibraryMap';
import QRCheckin from './pages/QRCheckin';
import LibrarianCenter from './pages/LibrarianCenter';
import Analytics from './pages/Analytics';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AwayModeModal />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"          element={<Landing />} />
          <Route path="/student"   element={<StudentDashboard />} />
          <Route path="/map"       element={<LibraryMap />} />
          <Route path="/qr"        element={<QRCheckin />} />
          <Route path="/librarian" element={<LibrarianCenter />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*"          element={<Landing />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
