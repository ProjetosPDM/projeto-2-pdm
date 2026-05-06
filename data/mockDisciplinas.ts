import { SubjectSearch } from "@/types/SubjectSearch";

export const MOCK_DISCIPLINAS: SubjectSearch[] = [
  // --- 1º PERÍODO ---
  {
    id: "1",
    name: "LPT I",
    prof: "Anne Alves",
    classes: [
      { id: "1a", schedule: "Quarta-feira", timeStart: "08:40", timeEnd: "10:40", location: "A definir" }
    ],
  },
  {
    id: "2",
    name: "Inglês I",
    prof: "Victoria Oliveira",
    classes: [
      { id: "2a", schedule: "Quarta-feira", timeStart: "10:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "3",
    name: "Algoritmos 1/2",
    prof: "André Almeida",
    classes: [
      { id: "3a", schedule: "Segunda-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "4",
    name: "MAC",
    prof: "Suemilton Gervazio",
    classes: [
      { id: "4a", schedule: "Terça-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "5",
    name: "Algoritmos 2/2",
    prof: "Álvaro Magnum",
    classes: [
      { id: "5a", schedule: "Quinta-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "6",
    name: "Introdução à Computação",
    prof: "Arlindo",
    classes: [
      { id: "6a", schedule: "Sexta-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },

  // --- 2º PERÍODO ---
  {
    id: "7",
    name: "Programação Orientada a Objetos (POO)",
    prof: "Antonio Dias",
    classes: [
      { id: "7a", schedule: "Terça-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" },
      { id: "7b", schedule: "Segunda-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "8",
    name: "PE",
    prof: "Suemilton Gervazio",
    classes: [
      { id: "8a", schedule: "Quarta-feira", timeStart: "10:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "9",
    name: "Inglês II",
    prof: "Victoria Oliveira",
    classes: [
      { id: "9a", schedule: "Quinta-feira", timeStart: "10:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "10",
    name: "Redes",
    prof: "Renata Pontes",
    classes: [
      { id: "10a", schedule: "Terça-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "11",
    name: "LPT II",
    prof: "Antonio Melo",
    classes: [
      { id: "11a", schedule: "Quinta-feira", timeStart: "13:20", timeEnd: "15:00", location: "A definir" }
    ],
  },
  {
    id: "12",
    name: "LTG",
    prof: "Artur Oliveira",
    classes: [
      { id: "12a", schedule: "Quinta-feira", timeStart: "15:20", timeEnd: "17:00", location: "A definir" }
    ],
  },

  // --- 3º PERÍODO ---
  {
    id: "13",
    name: "Estrutura de Dados e Algoritmos (EDA)",
    prof: "Renata Pontes",
    classes: [
      { id: "13a", schedule: "Segunda-feira", timeStart: "08:40", timeEnd: "12:20", location: "Lab 1" },
      { id: "13b", schedule: "Terça-feira", timeStart: "08:40", timeEnd: "10:40", location: "Lab 1" }
    ],
  },
  {
    id: "14",
    name: "PP",
    prof: "Álvaro Magnum",
    classes: [
      { id: "14a", schedule: "Quinta-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "15",
    name: "MPC",
    prof: "Larissa Lavor",
    classes: [
      { id: "15a", schedule: "Terça-feira", timeStart: "10:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "16",
    name: "Banco de Dados I",
    prof: "Hugo Figueiredo",
    classes: [
      { id: "16a", schedule: "Terça-feira", timeStart: "13:20", timeEnd: "17:00", location: "Lab 2" }
    ],
  },
  {
    id: "17",
    name: "DAW I",
    prof: "Jaindson Santana",
    classes: [
      { id: "17a", schedule: "Quinta-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },

  // --- 4º PERÍODO ---
  {
    id: "18",
    name: "APS",
    prof: "Artur Oliveira",
    classes: [
      { id: "18a", schedule: "Quinta-feira", timeStart: "08:40", timeEnd: "10:40", location: "A definir" },
      { id: "18b", schedule: "Sexta-feira", timeStart: "13:20", timeEnd: "15:00", location: "A definir" }
    ],
  },
  {
    id: "19",
    name: "Sistemas Operacionais (SO)",
    prof: "Artur Oliveira",
    classes: [
      { id: "19a", schedule: "Sexta-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "20",
    name: "Banco de Dados II",
    prof: "Hugo Figueiredo",
    classes: [
      { id: "20a", schedule: "Terça-feira", timeStart: "10:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "21",
    name: "RHT",
    prof: "Helltonn Maciel",
    classes: [
      { id: "21a", schedule: "Quinta-feira", timeStart: "10:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "22",
    name: "DAW II",
    prof: "Jaindson Santana",
    classes: [
      { id: "22a", schedule: "Terça-feira", timeStart: "13:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "23",
    name: "Introdução à Administração",
    prof: "Helltonn Maciel",
    classes: [
      { id: "23a", schedule: "Quinta-feira", timeStart: "13:20", timeEnd: "15:00", location: "A definir" }
    ],
  },
  {
    id: "24",
    name: "STI",
    prof: "Pedro Pinto",
    classes: [
      { id: "24a", schedule: "Quinta-feira", timeStart: "15:20", timeEnd: "17:00", location: "A definir" }
    ],
  },

  // --- 5º PERÍODO ---
  {
    id: "25",
    name: "DAW III",
    prof: "Gabriel Lima",
    classes: [
      { id: "25a", schedule: "Terça-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "26",
    name: "PJ I (2/2)",
    prof: "Hugo Figueiredo",
    classes: [
      { id: "26a", schedule: "Quarta-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "27",
    name: "PDM",
    prof: "André Almeida",
    classes: [
      { id: "27a", schedule: "Sexta-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "28",
    name: "IA",
    prof: "Gabriel Lima",
    classes: [
      { id: "28a", schedule: "Segunda-feira", timeStart: "13:20", timeEnd: "15:00", location: "A definir" }
    ],
  },
  {
    id: "29",
    name: "Empreendedorismo",
    prof: "Helltonn Maciel",
    classes: [
      { id: "29a", schedule: "Segunda-feira", timeStart: "15:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "30",
    name: "PJ I (1/2)",
    prof: "Anne Alves",
    classes: [
      { id: "30a", schedule: "Quinta-feira", timeStart: "13:20", timeEnd: "15:00", location: "A definir" }
    ],
  },

  // --- 6º PERÍODO ---
  {
    id: "31",
    name: "JD",
    prof: "Álvaro Magnum",
    classes: [
      { id: "31a", schedule: "Terça-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "32",
    name: "PJ II (2/2)",
    prof: "Renata Pontes",
    classes: [
      { id: "32a", schedule: "Quarta-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "33",
    name: "TT",
    prof: "Jaindson Santana",
    classes: [
      { id: "33a", schedule: "Quinta-feira", timeStart: "08:40", timeEnd: "12:20", location: "A definir" }
    ],
  },
  {
    id: "34",
    name: "Segurança da Informação",
    prof: "Antonio Dias",
    classes: [
      { id: "34a", schedule: "Terça-feira", timeStart: "13:20", timeEnd: "15:00", location: "A definir" }
    ],
  },
  {
    id: "35",
    name: "GCM",
    prof: "Álvaro Magnum",
    classes: [
      { id: "35a", schedule: "Terça-feira", timeStart: "15:20", timeEnd: "17:00", location: "A definir" }
    ],
  },
  {
    id: "36",
    name: "PJ II (1/2)",
    prof: "Anne Alves",
    classes: [
      { id: "36a", schedule: "Quinta-feira", timeStart: "15:20", timeEnd: "17:00", location: "A definir" }
    ]
  }
];