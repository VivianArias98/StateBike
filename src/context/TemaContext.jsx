import React, { createContext, useContext, useState, useEffect } from 'react';

const CLAVE_TEMA = 'stationbike.tema';
const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_TEMA);
      if (guardado === 'oscuro' || guardado === 'claro') {
        return guardado;
      }
    } catch {
      // Ignorar fallo de acceso a localStorage
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'oscuro';
    }
    return 'claro';
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-tema', tema);
      localStorage.setItem(CLAVE_TEMA, tema);
    } catch {
      // Ignorar en caso de error
    }
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));
  };

  return (
    <TemaContext.Provider
      value={{
        tema,
        alternarTema,
        esOscuro: tema === 'oscuro',
      }}
    >
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    return {
      tema: 'claro',
      esOscuro: false,
      alternarTema: () => {},
    };
  }
  return context;
}

