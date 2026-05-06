import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  inicializarBanco,
  buscarDisciplinasDB,
  salvarDisciplinaDB,
  removerDisciplinaDB,
  buscarNomeUsuarioDB,
  atualizarNomeUsuarioDB,
} from "../utils/database";
import { Subject } from "@/types/Subject";

const ordemDias: Record<string, number> = {
  "Segunda-feira": 1,
  "Terça-feira": 2,
  "Quarta-feira": 3,
  "Quinta-feira": 4,
  "Sexta-feira": 5,
};

const ordenar = (lista: Subject[]) => {
  return [...lista].sort((a, b) => {
    const diaA = ordemDias[a.schedule] ?? 99;
    const diaB = ordemDias[b.schedule] ?? 99;

    const diaDiff = diaA - diaB;
    if (diaDiff !== 0) return diaDiff;

    return a.timeStart.localeCompare(b.timeStart);
  });
};

interface SubjectContextData {
  mySubjects: Subject[];
  userName: string;
  addSubjects: (subjects: Subject[]) => Promise<void>;
  removeSubject: (id: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  removeSubjectGroup: (baseId: string) => Promise<void>;
}

const SubjectContext = createContext<SubjectContextData>(
  {} as SubjectContextData,
);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [userName, setUserName] = useState<string>("Estudante");

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      await inicializarBanco();

      const dadosDoBanco = await buscarDisciplinasDB();
      const formatados = (dadosDoBanco as any[]).map((d) => ({
        id: d.id,
        name: d.nome,
        prof: d.professor,
        schedule: d.diaSemana,
        timeStart: d.horaInicio,
        timeEnd: d.horaFim,
        location: d.local,
      }));

      setMySubjects(ordenar(formatados));

      const nomeSalvo = await buscarNomeUsuarioDB();
      if (nomeSalvo) setUserName(nomeSalvo);
    };

    carregarDadosIniciais();
  }, []);

  const addSubjects = async (newSubjects: Subject[]) => {
    try {
      for (const subject of newSubjects) {
        await salvarDisciplinaDB(subject);
      }

      setMySubjects((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const filteredNew = newSubjects.filter((s) => !existingIds.has(s.id));
        return ordenar([...prev, ...filteredNew]);
      });
    } catch (error) {
      console.error("Erro ao adicionar no banco:", error);
    }
  };

  const removeSubject = async (id: string) => {
    try {
      await removerDisciplinaDB(id);
      setMySubjects((prev) => ordenar(prev.filter((s) => s.id !== id)));
    } catch (error) {
      console.error("Erro ao remover do banco:", error);
    }
  };

  const removeSubjectGroup = async (baseId: string) => {
    try {
      const idsParaRemover = mySubjects
        .filter((s) => s.id.replace(/[a-z]/g, "") === baseId)
        .map((s) => s.id);

      for (const id of idsParaRemover) {
        await removerDisciplinaDB(id);
      }

      setMySubjects((prev) => 
        ordenar(prev.filter((s) => !idsParaRemover.includes(s.id)))
      );
    } catch (error) {
      console.error("Erro ao remover grupo de disciplinas do banco:", error);
    }
  };

  const updateUserName = async (newName: string) => {
    try {
      await atualizarNomeUsuarioDB(newName);
      setUserName(newName);
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
    }
  };

  return (
    <SubjectContext.Provider
      value={{
        mySubjects,
        userName,
        addSubjects,
        removeSubject,
        removeSubjectGroup,
        updateUserName,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);
