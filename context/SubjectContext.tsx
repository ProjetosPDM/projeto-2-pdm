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
import { supabase } from "@/utils/supabase";

const ordemDias: Record<string, number> = {
  "segunda": 1,
  "terca": 2,
  "quarta": 3,
  "quinta": 4,
  "sexta": 5,
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
  removeSubjectGroup: (subjectId: string) => Promise<void>;
  syncGrade: () => Promise<void>;
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

      const dadosDoBanco = (await buscarDisciplinasDB()) as any[];
      
      const formatados = dadosDoBanco.map((d) => ({
        id: d.id,
        subjectId: d.subject_id,
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

  const syncGrade = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cloudData, error } = await supabase
        .from('aluno_disciplinas')
        .select(`
          disciplinas (
            id, nome, professor, local,
            horarios_disciplina ( id, dia_semana, hora_inicio, hora_fim )
          )
        `)
        .eq('aluno_id', user.id);

      if (error) throw error;

      const gradeSincronizada: Subject[] = [];
      cloudData.forEach((item: any) => {
        const d = item.disciplinas;
        if (d && d.horarios_disciplina) {
          d.horarios_disciplina.forEach((h: any) => {
            gradeSincronizada.push({
              id: h.id,
              subjectId: d.id,
              name: d.nome,
              prof: d.professor,
              schedule: h.dia_semana,
              timeStart: h.hora_inicio.substring(0, 5),
              timeEnd: h.hora_fim.substring(0, 5),
              location: d.local
            });
          });
        }
      });
      const atuaisNoSQLite = (await buscarDisciplinasDB()) as any[];
      
      for (const s of atuaisNoSQLite) {
        await removerDisciplinaDB(s.id);
      }

      for (const s of gradeSincronizada) {
        await salvarDisciplinaDB(s);
      }

      setMySubjects(ordenar(gradeSincronizada));
      console.log("Sincronização concluída com sucesso!");

    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      throw error;
    }
  };

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

  const removeSubjectGroup = async (subjectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('aluno_disciplinas')
          .delete()
          .match({ aluno_id: user.id, disciplina_id: subjectId });
      }

      const slotsParaRemover = mySubjects.filter(s => s.subjectId === subjectId);
      
      for (const slot of slotsParaRemover) {
        await removerDisciplinaDB(slot.id);
      }

      setMySubjects(prev => prev.filter(s => s.subjectId !== subjectId));

    } catch (error) {
      console.error("Erro ao remover grupo:", error);
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
        syncGrade,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);
export { Subject };