import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Importação das funções do utilitário de banco de dados
import { 
  inicializarBanco, 
  buscarDisciplinasDB, 
  salvarDisciplinaDB, 
  removerDisciplinaDB 
} from '../utils/database';

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
  addSubjects: (subjects: Subject[]) => Promise<void>; // Mudou para Promise pois é async
  removeSubject: (id: string) => Promise<void>;       // Mudou para Promise pois é async
}

const SubjectContext = createContext<SubjectContextData>({} as SubjectContextData);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);

  // 1. Carregamento Inicial: Roda assim que o App abre
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      // Garante que a tabela existe
      await inicializarBanco();
      
      // Busca o que já está salvo no SQLite
      const dadosDoBanco = await buscarDisciplinasDB();
      
      // Mapeia os dados do banco para o formato da interface Subject
      const formatados = (dadosDoBanco as any[]).map(d => ({
        id: d.id,
        name: d.nome,
        prof: d.professor,
        schedule: d.diaSemana,
        timeStart: d.horaInicio,
        timeEnd: d.horaFim,
        location: d.local
      }));

      setMySubjects(formatados);
      console.log("Grade carregada do SQLite:", formatados.length, "disciplinas.");
    };

    carregarDadosIniciais();
  }, []);

  // 2. Adicionar Disciplinas (Salva no Banco + Memória)
  const addSubjects = async (newSubjects: Subject[]) => {
    try {
      // Salva cada disciplina nova no banco de dados
      for (const subject of newSubjects) {
        await salvarDisciplinaDB(subject);
      }

      // Atualiza o estado da memória para refletir na UI imediatamente
      setMySubjects(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const filteredNew = newSubjects.filter(s => !existingIds.has(s.id));
        return [...prev, ...filteredNew];
      });
    } catch (error) {
      console.error("Erro ao adicionar no banco:", error);
    }
  };

  // 3. Remover Disciplina (Apaga do Banco + Memória)
  const removeSubject = async (id: string) => {
    try {
      // Remove do SQLite
      await removerDisciplinaDB(id);
      
      // Remove do estado local
      setMySubjects(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Erro ao remover do banco:", error);
    }
  };

  return (
    <SubjectContext.Provider value={{ mySubjects, addSubjects, removeSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);