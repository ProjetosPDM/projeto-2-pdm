import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Subject {
  id: string;
  name: string;
  prof: string;
  schedule: string;
  timeStart: string;
  timeEnd: string;
  location: string;
}

interface SubjectContextData {
  mySubjects: Subject[];
  addSubjects: (subjects: Subject[]) => void;
  removeSubject: (id: string) => void;
}

const SubjectContext = createContext<SubjectContextData>({} as SubjectContextData);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);

  // O useEffect entra aqui: Por enquanto ele só avisa no console, 
  // mas é aqui que chamaremos o SQLite depois!
  useEffect(() => {
    console.log("Minha grade atualizada:", mySubjects);
  }, [mySubjects]);

  const addSubjects = (newSubjects: Subject[]) => {
    setMySubjects(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const filteredNew = newSubjects.filter(s => !existingIds.has(s.id));
      return [...prev, ...filteredNew];
    });
  };

  const removeSubject = (id: string) => {
    setMySubjects(prev => prev.filter(s => s.id !== id));
  };

  return (
    <SubjectContext.Provider value={{ mySubjects, addSubjects, removeSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);