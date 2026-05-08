import * as SQLite from 'expo-sqlite';

// Abre a conexão com o banco de dados
const db = SQLite.openDatabaseSync('ifpb_horario.db');

/**
 * Inicializa o banco de dados criando as tabelas necessárias
 */
export const inicializarBanco = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      -- Tabela para armazenar as disciplinas da grade
      CREATE TABLE IF NOT EXISTS disciplinas (
        id TEXT PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        professor TEXT NOT NULL,
        diaSemana TEXT NOT NULL,
        horaInicio TEXT NOT NULL,
        horaFim TEXT NOT NULL,
        local TEXT NOT NULL
      );

      -- Tabela para configurações do app (nome, tema, etc)
      CREATE TABLE IF NOT EXISTS config (
        chave TEXT PRIMARY KEY, 
        valor TEXT
      );
    `);
    console.log("Banco de dados e tabelas inicializados!");
  } catch (error) {
    console.error("Erro crítico ao inicializar o banco:", error);
  }
};

/**
 * Funções para Gerenciamento de Disciplinas
 */

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

/**
 * Funções para Gerenciamento de Configurações (Perfil e Tema)
 */

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
    // Se não houver nada salvo, o padrão é seguir o sistema do celular
    return resultado ? (resultado as any).valor : 'system';
  } catch (error) {
    console.error("Erro ao buscar tema no banco:", error);
    return 'system';
  }
};