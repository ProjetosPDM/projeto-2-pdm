import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import {
	inicializarBanco,
	buscarDisciplinasDB,
	salvarDisciplinaDB,
	removerDisciplinaDB,
	buscarNomeUsuarioDB,
	atualizarNomeUsuarioDB,
	buscarFilaSyncDB,
	limparFilaSyncDB,
	salvarCatalogoDB,
	registrarAcaoOfflineDB,
} from "../utils/database";
import { Subject } from "@/types/Subject";
import { supabase } from "@/utils/supabase";
import { useAuth } from "./AuthContext";

const ordemDias: Record<string, number> = {
	segunda: 1,
	terca: 2,
	quarta: 3,
	quinta: 4,
	sexta: 5,
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
	updateUserName: (name: string) => Promise<void>;
	syncGrade: () => Promise<void>;
	saveSubjectChangesOffline: (toAddSubjects: Subject[], addIds: string[], removeIds: string[]) => Promise<void>;
}

interface SyncQueueItem {
	id: string;
	acao: "ADD" | "REMOVE";
	disciplina_id: string;
}

const SubjectContext = createContext<SubjectContextData>({} as SubjectContextData);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
	const [mySubjects, setMySubjects] = useState<Subject[]>([]);
	const [userName, setUserName] = useState<string>("Estudante");

	const { session } = useAuth();

	useEffect(() => {
		let montado = true;

		const inicializarAplicativo = async () => {
			// 1. CARREGAMENTO OFFLINE-FIRST (Imediato, sem load)
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

			if (montado) {
				setMySubjects(ordenar(formatados));
				const nomeSalvo = await buscarNomeUsuarioDB();
				if (nomeSalvo) setUserName(nomeSalvo);
			}

			// 2. BACKGROUND SYNC
			await syncGrade();
		};

		inicializarAplicativo();

		return () => {
			montado = false;
		};
	}, []);

	useEffect(() => {
		if (session?.user) {
			syncGrade();
		} else {
			setMySubjects([]);
		}
	}, [session?.user?.id]);

	// Função interna que lê a fila local e tenta enviar para o Supabase
	const processarFilaOffline = async (userId: string) => {
		const fila = (await buscarFilaSyncDB()) as SyncQueueItem[] | null;
		if (!fila || fila.length === 0) return;

		for (const item of fila) {
			try {
				if (item.acao === "ADD") {
					const { error } = await supabase.from("aluno_disciplinas").insert({
						aluno_id: userId,
						disciplina_id: item.disciplina_id,
					});
					// Código 23505 é Unique Violation (já existe no banco), podemos ignorar e remover da fila
					if (error && error.code !== "23505") throw error;
				} else if (item.acao === "REMOVE") {
					const { error } = await supabase
						.from("aluno_disciplinas")
						.delete()
						.match({ aluno_id: userId, disciplina_id: item.disciplina_id });
					if (error) throw error;
				}

				// Se a requisição HTTP deu sucesso, apaga o item da fila local!
				await limparFilaSyncDB(Number(item.id));
			} catch (e) {
				// Falha silenciosa: a internet caiu no meio, ele tenta de novo na próxima!
			}
		}
	};

	const syncGrade = async () => {
		try {
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();
			if (authError || !user) return;

			// 1. TENTA DESPACHAR A FILA PENDENTE ANTES DE ATUALIZAR
			await processarFilaOffline(user.id);

			// 2. ATUALIZA O CATÁLOGO GERAL (Para o app funcionar 100% offline na busca)
			const { data: catData, error: catError } = await supabase.from("disciplinas").select(`
          id, nome, professor, local,
          horarios_disciplina ( id, dia_semana, hora_inicio, hora_fim )
        `);

			if (!catError && catData) {
				const catalogoFormatado = catData.map((d: any) => ({
					id: d.id,
					name: d.nome,
					prof: d.professor,
					classes: d.horarios_disciplina.map((h: any) => ({
						id: h.id,
						schedule: h.dia_semana,
						timeStart: h.hora_inicio.substring(0, 5),
						timeEnd: h.hora_fim.substring(0, 5),
						location: d.local,
					})),
				}));
				await salvarCatalogoDB(catalogoFormatado); // Salva no SQLite
			}

			// 3. ATUALIZA A GRADE PESSOAL DO ALUNO
			const { data: cloudData, error: dbError } = await supabase
				.from("aluno_disciplinas")
				.select(
					`
          disciplinas (
            id, nome, professor, local,
            horarios_disciplina ( id, dia_semana, hora_inicio, hora_fim )
          )
        `,
				)
				.eq("aluno_id", user.id);

			if (dbError) return;

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
							location: d.local,
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
		} catch {
			// Ignorado para manter a fluidez
		}
	};

	// NOVA FUNÇÃO: O aluno aperta "Salvar" lá na tela de busca. Tudo acontece localmente aqui!
	const saveSubjectChangesOffline = async (toAddSubjects: Subject[], addIds: string[], removeIds: string[]) => {
		try {
			// 1. Grava as remoções locais e enfileira
			for (const subjectId of removeIds) {
				await registrarAcaoOfflineDB("REMOVE", subjectId);

				const slotsParaRemover = mySubjects.filter((s) => s.subjectId === subjectId);
				for (const slot of slotsParaRemover) {
					await removerDisciplinaDB(slot.id);
				}
			}

			// 2. Grava as adições locais e enfileira
			for (const subjectId of addIds) {
				await registrarAcaoOfflineDB("ADD", subjectId);
			}

			for (const subject of toAddSubjects) {
				await salvarDisciplinaDB(subject);
			}

			// 3. Atualiza a tela instantaneamente
			setMySubjects((prev) => {
				const afterRemove = prev.filter((s) => !removeIds.includes(s.subjectId));
				const existingIds = new Set(afterRemove.map((s) => s.id));
				const filteredNew = toAddSubjects.filter((s) => !existingIds.has(s.id));
				return ordenar([...afterRemove, ...filteredNew]);
			});

			// 4. Dispara a sincronização invisível em background
			syncGrade();
		} catch (error) {
			console.error("Erro interno ao salvar offline:", error);
		}
	};

	const updateUserName = async (newName: string) => {
		try {
			await atualizarNomeUsuarioDB(newName);
			setUserName(newName);
		} catch {}
	};

	return (
		<SubjectContext.Provider
			value={{
				mySubjects,
				userName,
				updateUserName,
				syncGrade,
				saveSubjectChangesOffline, // Expomos a nova função super poderosa
			}}
		>
			{children}
		</SubjectContext.Provider>
	);
};

export const useSubjects = () => useContext(SubjectContext);
