'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type NatureItem = {
  id: number;
  title: string;
};

type NatureContextType = {
  items: NatureItem[];
  addNatureItem: (item: NatureItem) => void;
};

const NatureContext = createContext<NatureContextType | undefined>(undefined);

export const NatureProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<NatureItem[]>([]);

  const addNatureItem = (item: NatureItem) => {
    setItems([...items, item]);
  };

  return (
    <NatureContext.Provider value={{ items, addNatureItem }}>
      {children}
    </NatureContext.Provider>
  );
};

export const useNatureContext = () => {
  const context = useContext(NatureContext);
  if (context === undefined) {
    throw new Error('useNatureContext must be used within a NatureProvider');
  }
  return context;
};
