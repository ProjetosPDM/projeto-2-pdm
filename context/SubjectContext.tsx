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
	removeSubject: (slotId: string) => Promise<void>; // <--- ADICIONADO DE VOLTA
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
					if (error && error.code !== "23505") throw error;
				} else if (item.acao === "REMOVE") {
					const { error } = await supabase
						.from("aluno_disciplinas")
						.delete()
						.match({ aluno_id: userId, disciplina_id: item.disciplina_id });
					if (error) throw error;
				}

				await limparFilaSyncDB(Number(item.id));
			} catch (e) {
				// Falha silenciosa
			}
		}
	};

	const syncGrade = async () => {
		try {
			const { data: { user }, error: authError } = await supabase.auth.getUser();
			if (authError || !user) return;

			await processarFilaOffline(user.id);

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
				await salvarCatalogoDB(catalogoFormatado);
			}

			const { data: cloudData, error: dbError } = await supabase
				.from("aluno_disciplinas")
				.select(`
          disciplinas (
            id, nome, professor, local,
            horarios_disciplina ( id, dia_semana, hora_inicio, hora_fim )
          )
        `)
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
			// Ignorado
		}
	};

	const saveSubjectChangesOffline = async (toAddSubjects: Subject[], addIds: string[], removeIds: string[]) => {
		try {
			for (const subjectId of removeIds) {
				await registrarAcaoOfflineDB("REMOVE", subjectId);

				const slotsParaRemover = mySubjects.filter((s) => s.subjectId === subjectId);
				for (const slot of slotsParaRemover) {
					await removerDisciplinaDB(slot.id);
				}
			}

			for (const subjectId of addIds) {
				await registrarAcaoOfflineDB("ADD", subjectId);
			}

			for (const subject of toAddSubjects) {
				await salvarDisciplinaDB(subject);
			}

			setMySubjects((prev) => {
				const afterRemove = prev.filter((s) => !removeIds.includes(s.subjectId));
				const existingIds = new Set(afterRemove.map((s) => s.id));
				const filteredNew = toAddSubjects.filter((s) => !existingIds.has(s.id));
				return ordenar([...afterRemove, ...filteredNew]);
			});

			syncGrade();
		} catch (error) {
			console.error("Erro ao salvar offline:", error);
		}
	};

	// NOVA FUNÇÃO CORRIGIDA: Lixeira da tela de grade
	const removeSubject = async (slotId: string) => {
		try {
			// 1. Encontra qual é a matéria "Pai" deste horário
			const slot = mySubjects.find((s) => s.id === slotId);
			if (!slot || !slot.subjectId) return;

			const subjectIdToRemove = slot.subjectId;

			// 2. Coloca na fila para avisar o Supabase depois (Offline-First)
			await registrarAcaoOfflineDB("REMOVE", subjectIdToRemove);

			// 3. Remove todos os dias/horários dessa matéria do SQLite local
			const slotsParaRemover = mySubjects.filter((s) => s.subjectId === subjectIdToRemove);
			for (const s of slotsParaRemover) {
				await removerDisciplinaDB(s.id);
			}

			// 4. Atualiza a tela imediatamente
			setMySubjects((prev) => prev.filter((s) => s.subjectId !== subjectIdToRemove));

			// 5. Tenta enviar pro Supabase em background
			syncGrade();
		} catch (error) {
			console.error("Erro ao remover:", error);
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
				saveSubjectChangesOffline,
				removeSubject, // <--- ADICIONADO AQUI
			}}
		>
			{children}
		</SubjectContext.Provider>
	);
};

export const useSubjects = () => useContext(SubjectContext);