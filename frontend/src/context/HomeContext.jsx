import React, { createContext, useContext } from 'react';

export const HomeContext = createContext();

export const useHomeContext = () => useContext(HomeContext);
