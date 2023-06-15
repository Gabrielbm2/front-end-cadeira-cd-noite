/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// PacienteContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PacienteContext = createContext();

const PacienteProvider = ({ children }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://randomuser.me/api/?page=${page}&results=50`
      );
      const newPacientes = response.data.results.map((result) => ({
        ...result,
        name: `${result.name.title} ${result.name.first} ${result.name.last}`,
        gender: result.gender,
      }));
      setPacientes(prevState => [...prevState, ...newPacientes]);
      setPage(prevState => prevState + 1)
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <PacienteContext.Provider value={{ pacientes, loading, fetchPacientes }}>
      {children}
    </PacienteContext.Provider>
  );
};

export default PacienteProvider;
