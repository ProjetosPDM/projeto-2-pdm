import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados
const db = SQLite.openDatabaseSync('ifpb_horario.db');

export const inicializarBanco = async () => {
  try {
    // Cria a tabela de disciplinas se não existir
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS disciplinas (
        id TEXT PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        professor TEXT NOT NULL,
        diaSemana TEXT NOT NULL,
        horaInicio TEXT NOT NULL,
        horaFim TEXT NOT NULL,
        local TEXT NOT NULL
      );
    `);
    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
  }
};

export const salvarDisciplinaDB = async (d: any) => {
  return await db.runAsync(
    'INSERT OR REPLACE INTO disciplinas (id, nome, professor, diaSemana, horaInicio, horaFim, local) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [d.id, d.name, d.prof, d.schedule, d.timeStart, d.timeEnd, d.location]
  );
};

export const buscarDisciplinasDB = async () => {
  return await db.getAllAsync('SELECT * FROM disciplinas');
};

export const removerDisciplinaDB = async (id: string) => {
  return await db.runAsync('DELETE FROM disciplinas WHERE id = ?', [id]);
};