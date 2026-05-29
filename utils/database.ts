import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ifpb_horario.db');

export const inicializarBanco = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      -- 1. Tabela para armazenar a GRADE ATUAL DO ALUNO
      CREATE TABLE IF NOT EXISTS disciplinas (
        id TEXT PRIMARY KEY NOT NULL,
        subject_id TEXT NOT NULL,
        nome TEXT NOT NULL,
        professor TEXT NOT NULL,
        diaSemana TEXT NOT NULL,
        horaInicio TEXT NOT NULL,
        horaFim TEXT NOT NULL,
        local TEXT NOT NULL
      );

      -- 2. Tabela para configurações do app (nome, tema, etc)
      CREATE TABLE IF NOT EXISTS config (
        chave TEXT PRIMARY KEY, 
        valor TEXT
      );

      -- 3. Cache de sessão para funcionamento offline
      CREATE TABLE IF NOT EXISTS session_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );

      -- 4. Metadados de sincronização
      CREATE TABLE IF NOT EXISTS sync_meta (
        chave TEXT PRIMARY KEY,
        last_sync TEXT NOT NULL
      );

      -- === NOVAS TABELAS (OFFLINE-FIRST) === --

      -- 5. Catálogo COMPLETO de Disciplinas do IFPB (Para pesquisa offline)
      CREATE TABLE IF NOT EXISTS catalogo_disciplinas (
        id TEXT PRIMARY KEY NOT NULL,
        data_json TEXT NOT NULL
      );

      -- 6. Fila de Sincronização (Grava as ações feitas sem internet)
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        acao TEXT NOT NULL, -- 'ADD' ou 'REMOVE'
        disciplina_id TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);
    console.log("Banco de dados atualizado com suporte a Fila Offline!");
  } catch (error) {
    console.error("Erro crítico ao inicializar o banco:", error);
  }
};

/* ==========================================
   FUNÇÕES DE FILA DE SINCRONIZAÇÃO E CATÁLOGO
   ========================================== */

// Salva o catálogo completo baixado do Supabase
export const salvarCatalogoDB = async (catalogo: any[]) => {
  try {
    await db.runAsync('DELETE FROM catalogo_disciplinas'); // Limpa o antigo
    for (const item of catalogo) {
      await db.runAsync(
        'INSERT INTO catalogo_disciplinas (id, data_json) VALUES (?, ?)',
        [item.id, JSON.stringify(item)]
      );
    }
  } catch (error) {
    console.error("Erro ao salvar catálogo offline:", error);
  }
};

// Busca o catálogo para mostrar na tela de pesquisa (search-subjects)
export const buscarCatalogoDB = async () => {
  try {
    const resultado = await db.getAllAsync('SELECT data_json FROM catalogo_disciplinas');
    return resultado.map((r: any) => JSON.parse(r.data_json));
  } catch (error) {
    return [];
  }
};

// Adiciona uma ação na fila (Ex: acao='ADD', disciplina_id='1234')
export const registrarAcaoOfflineDB = async (acao: 'ADD' | 'REMOVE', disciplina_id: string) => {
  try {
    await db.runAsync(
      'INSERT INTO sync_queue (acao, disciplina_id, timestamp) VALUES (?, ?, ?)',
      [acao, disciplina_id, new Date().toISOString()]
    );
  } catch (error) {
    console.error("Erro ao registrar ação offline:", error);
  }
};

// Busca a fila para enviar ao backend quando a internet voltar
export const buscarFilaSyncDB = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM sync_queue ORDER BY timestamp ASC');
  } catch (error) {
    return [];
  }
};

// Remove itens da fila após o sucesso do envio
export const limparFilaSyncDB = async (id: number) => {
  try {
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
  } catch (error) {
    console.error("Erro ao limpar fila:", error);
  }
};

/* ==========================================
   FUNÇÕES DE PERFIL E CONFIGURAÇÃO
   ========================================== */

export const salvarPerfilOfflineDB = async (perfil: any) => {
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO session_cache (id, data) VALUES (?, ?)',
      ['user_profile', JSON.stringify(perfil)]
    );
  } catch (error) { }
};

export const buscarPerfilOfflineDB = async () => {
  try {
    const resultado = await db.getFirstAsync(
      'SELECT data FROM session_cache WHERE id = ?',
      ['user_profile']
    );
    return resultado ? JSON.parse((resultado as any).data) : null;
  } catch (error) { return null; }
};

export const limparCacheSessaoDB = async () => {
  try { await db.runAsync("DELETE FROM session_cache WHERE id = 'user_profile'"); } catch (error) { }
};

/* ==========================================
   FUNÇÕES DE DISCIPLINAS (GRADE DO ALUNO)
   ========================================== */

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
    return await db.runAsync('INSERT OR REPLACE INTO config (chave, valor) VALUES (?, ?)', ['nome_usuario', nome]);
  } catch (error) { }
};

export const buscarNomeUsuarioDB = async () => {
  try {
    const resultado = await db.getFirstAsync('SELECT valor FROM config WHERE chave = ?', ['nome_usuario']);
    return resultado ? (resultado as any).valor : "Usuário";
  } catch (error) { return "Usuário"; }
};

export const salvarTemaDB = async (tema: 'light' | 'dark' | 'system') => {
  try {
    return await db.runAsync('INSERT OR REPLACE INTO config (chave, valor) VALUES (?, ?)', ['tema_app', tema]);
  } catch (error) { }
};

export const buscarTemaDB = async () => {
  try {
    const resultado = await db.getFirstAsync('SELECT valor FROM config WHERE chave = ?', ['tema_app']);
    return resultado ? (resultado as any).valor : 'system';
  } catch (error) { return 'system'; }
};