import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ifpb_horario.db');

export const inicializarBanco = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      -- Tabela para armazenar as disciplinas da grade
      CREATE TABLE IF NOT EXISTS disciplinas (
        id TEXT PRIMARY KEY NOT NULL,
        subject_id TEXT NOT NULL, -- Coluna nova para identificar a matéria pai
        nome TEXT NOT NULL,
        professor TEXT NOT NULL,
        diaSemana TEXT NOT NULL,
        horaInicio TEXT NOT NULL,
        horaFim TEXT NOT NULL,
        local TEXT NOT NULL
      );

      -- Tabela para configurações do app
      CREATE TABLE IF NOT EXISTS config (
        chave TEXT PRIMARY KEY, 
        valor TEXT
      );

      -- Cache de sessão para funcionamento offline
      CREATE TABLE IF NOT EXISTS session_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );

      -- Metadados de sincronização
      CREATE TABLE IF NOT EXISTS sync_meta (
        chave TEXT PRIMARY KEY,
        last_sync TEXT NOT NULL
      );
    `);
    console.log("Banco de dados e todas as tabelas inicializados!");
  } catch (error) {
    console.error("Erro crítico ao inicializar o banco:", error);
  }
};

export const salvarPerfilOfflineDB = async (perfil: any) => {
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO session_cache (id, data) VALUES (?, ?)',
      ['user_profile', JSON.stringify(perfil)]
    );
  } catch (error) {
    console.error("Erro ao salvar perfil offline:", error);
  }
};

export const buscarPerfilOfflineDB = async () => {
  try {
    const resultado = await db.getFirstAsync(
      'SELECT data FROM session_cache WHERE id = ?',
      ['user_profile']
    );
    return resultado ? JSON.parse((resultado as any).data) : null;
  } catch (error) {
    return null;
  }
};

export const limparCacheSessaoDB = async () => {
  try {
    await db.runAsync("DELETE FROM session_cache WHERE id = 'user_profile'");
  } catch (error) {
    console.error("Erro ao limpar cache:", error);
  }
};


export const salvarDisciplinaDB = async (d: any) => {
  return await db.runAsync(
    'INSERT OR REPLACE INTO disciplinas (id, subject_id, nome, professor, diaSemana, horaInicio, horaFim, local) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [d.id, d.subjectId, d.name, d.prof, d.schedule, d.timeStart, d.timeEnd, d.location]
  );
};

export const buscarDisciplinasDB = async () => {
  return await db.getAllAsync('SELECT * FROM disciplinas');
};

export const removerDisciplinaDB = async (id: string) => {
  return await db.runAsync('DELETE FROM disciplinas WHERE id = ?', [id]);
};

export const atualizarNomeUsuarioDB = async (nome: string) => {
  try {
    return await db.runAsync(
      'INSERT OR REPLACE INTO config (chave, valor) VALUES (?, ?)', 
      ['nome_usuario', nome]
    );
  } catch (error) {
    console.error("Erro ao salvar nome no banco:", error);
  }
};

export const buscarNomeUsuarioDB = async () => {
  try {
    const resultado = await db.getFirstAsync(
      'SELECT valor FROM config WHERE chave = ?', 
      ['nome_usuario']
    );
    return resultado ? (resultado as any).valor : "Usuário";
  } catch (error) {
    console.error("Erro ao buscar nome no banco:", error);
    return "Usuário";
  }
};

export const salvarTemaDB = async (tema: 'light' | 'dark' | 'system') => {
  try {
    return await db.runAsync(
      'INSERT OR REPLACE INTO config (chave, valor) VALUES (?, ?)', 
      ['tema_app', tema]
    );
  } catch (error) {
    console.error("Erro ao salvar tema no banco:", error);
  }
};

export const buscarTemaDB = async () => {
  try {
    const resultado = await db.getFirstAsync(
      'SELECT valor FROM config WHERE chave = ?', 
      ['tema_app']
    );
    return resultado ? (resultado as any).valor : 'system';
  } catch (error) {
    console.error("Erro ao buscar tema no banco:", error);
    return 'system';
  }
};