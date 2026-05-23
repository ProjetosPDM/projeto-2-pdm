import { supabase } from '../utils/supabase'; 
import { Subject } from '../context/SubjectContext';

export const fetchSubjectsFromSupabase = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('horarios_disciplina')
    .select(`
      id,
      dia_semana,
      hora_inicio,
      hora_fim,
      disciplinas (
        nome,
        professor,
        local
      )
    `);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item: any) => ({
    id: item.id,
    subjectId: item.disciplinas.id, 
    name: item.disciplinas.nome,
    prof: item.disciplinas.professor,
    schedule: item.dia_semana,
    timeStart: item.hora_inicio.substring(0, 5), 
    timeEnd: item.hora_fim.substring(0, 5),
    location: item.disciplinas.local,
  }));
};