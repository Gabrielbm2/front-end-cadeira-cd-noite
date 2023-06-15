/* eslint-disable no-unused-vars */
// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PacienteList from './components/PacienteList';
import PacienteProvider from './context/PacienteContext';

function App() {
  return (
    <PacienteProvider>
      <Routes>
          <Route path="/" element={<PacienteList />} />
          <Route path="/paciente/:id" element={<PacienteList />} />
      </Routes>
    </PacienteProvider>
  );
}

export default App;
