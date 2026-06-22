import React, { createContext, useState, useEffect, useContext } from 'react';
import { cities } from '../data/mockData';

const CityContext = createContext();

export const useCity = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isGeolocationPrompt, setIsGeolocationPrompt] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    if (savedCity) {
      setSelectedCity(cities.find(c => c.id === savedCity) || cities[0]);
    } else {
      // Имитация определения по геолокации
      setTimeout(() => {
        // Допустим, определили Алматы по IP
        const detectedCity = cities.find(c => c.id === 'almaty');
        setSelectedCity(detectedCity);
        setIsGeolocationPrompt(true); // Покажем плашку "Вы из Алматы?"
      }, 1000);
    }
  }, []);

  const changeCity = (cityId) => {
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      localStorage.setItem('userCity', city.id);
      setIsCityModalOpen(false);
      setIsGeolocationPrompt(false);
    }
  };

  return (
    <CityContext.Provider value={{
      selectedCity,
      isCityModalOpen,
      setIsCityModalOpen,
      changeCity,
      isGeolocationPrompt,
      setIsGeolocationPrompt
    }}>
      {children}
    </CityContext.Provider>
  );
};
