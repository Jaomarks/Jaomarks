// Dados fictícios para o protótipo — nenhuma informação real da Lifeshape.

export type PersonaId = "universitario" | "profissional" | "pastor";

export const personas: {
  id: PersonaId;
  label: string;
  description: string;
}[] = [
  { id: "universitario", label: "Universitário", description: "Cursando ou recém-formado" },
  { id: "profissional", label: "Profissional", description: "Mercado de trabalho e gestão" },
  { id: "pastor", label: "Pastor ou líder", description: "Liderando uma casa ou ministério" },
];

export const student = {
  name: "Lucas Andrade",
  initial: "L",
  persona: "universitario" as PersonaId,
  turma: "Liderança 24",
  memberSince: "Fevereiro de 2024",
  sementes: 1240,
  streak: 12,
  longestStreak: 19,
  level: 4,
  levelLabel: "Engajado",
  xpIntoLevel: 740,
  xpForNextLevel: 1000,
  weeklyRings: {
    presenca: 90,
    progresso: 75,
    servico: 55,
  },
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content: string;
  material?: { name: string; size: string };
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type CourseIcon = "briefcase" | "compass" | "users" | "book";

export type Course = {
  slug: string;
  title: string;
  category: string;
  turma: string;
  icon: CourseIcon;
  modules: Module[];
};

export const courses: Course[] = [
  {
    slug: "gestao-e-lideranca",
    title: "Gestão e Liderança",
    category: "Profissionais",
    turma: "Liderança 24",
    icon: "briefcase",
    modules: [
      {
        id: "m1",
        title: "Fundamentos da Liderança",
        lessons: [
          {
            id: "l1",
            title: "O Chamado para Liderar",
            duration: "14:10",
            completed: true,
            content:
              "O que diferencia liderar por posição e liderar por influência real. Você mapeou onde já exerce liderança hoje, mesmo sem o título.",
          },
          {
            id: "l2",
            title: "Caráter Antes de Dons",
            duration: "16:45",
            completed: true,
            content:
              "Dons abrem portas, caráter mantém você nelas. Exercício: liste uma área de caráter que precisa de mais atenção que seus talentos.",
          },
          {
            id: "l3",
            title: "Servir para Liderar",
            duration: "12:30",
            completed: true,
            content:
              "Liderança que serve constrói confiança mais rápido do que liderança que manda. Estudo de caso de uma equipe real da Lifeshape.",
          },
        ],
      },
      {
        id: "m2",
        title: "Visão e Estratégia",
        lessons: [
          {
            id: "l4",
            title: "Construindo uma Visão Clara",
            duration: "18:20",
            completed: true,
            content:
              "Visão sem clareza vira frustração pra equipe. Você escreveu a visão do seu próximo projeto em uma frase.",
          },
          {
            id: "l5",
            title: "Planejamento e Metas",
            duration: "15:05",
            completed: true,
            content:
              "Transformando visão em metas trimestrais realistas, com indicadores simples de acompanhar.",
            material: { name: "Modelo de plano trimestral.pdf", size: "1,1 MB" },
          },
          {
            id: "l6",
            title: "Tomada de Decisão em Equipe",
            duration: "13:50",
            completed: true,
            content:
              "Quando decidir sozinho e quando decidir com o grupo — e como comunicar a decisão depois.",
          },
        ],
      },
      {
        id: "m3",
        title: "Identidade e Propósito",
        lessons: [
          {
            id: "l7",
            title: "O Espelho e a Máscara",
            duration: "17:15",
            completed: true,
            content:
              "A diferença entre quem você é e quem você mostra ser sob pressão — e por que isso importa pra liderança.",
          },
          {
            id: "l8",
            title: "De Onde Vem Meu Valor",
            duration: "15:40",
            completed: true,
            content:
              "Separando valor pessoal de performance e resultado. Uma conversa honesta sobre autoestima e propósito.",
          },
          {
            id: "l9",
            title: "Identidade e Propósito",
            duration: "18:32",
            completed: false,
            content:
              "Nesta aula exploramos como propósito e identidade sustentam a liderança em meio à pressão. Antes do próximo encontro, registre no diário: em que momento desta semana você agiu de acordo com quem quer ser?",
            material: { name: "Apostila · Módulo 3.pdf", size: "2,4 MB" },
          },
          {
            id: "l10",
            title: "Dons e Chamado",
            duration: "14:55",
            completed: false,
            content: "Como identificar seus dons naturais e diferenciá-los do seu chamado de vida.",
          },
          {
            id: "l11",
            title: "Vocação vs. Profissão",
            duration: "16:10",
            completed: false,
            content: "Nem sempre vocação e profissão coincidem — como viver as duas com integridade.",
          },
          {
            id: "l12",
            title: "Identidade em Comunidade",
            duration: "13:25",
            completed: false,
            content: "Por que identidade não se constrói sozinho — o papel da turma nesse processo.",
          },
          {
            id: "l13",
            title: "Resistindo à Comparação",
            duration: "12:40",
            completed: false,
            content: "Comparação rouba propósito. Ferramentas práticas para reconhecer o padrão e sair dele.",
          },
          {
            id: "l14",
            title: "Vivendo o Propósito — Estudo de Caso",
            duration: "20:00",
            completed: false,
            content: "Encerramento do módulo com um estudo de caso real de um ex-aluno da Lifeshape.",
          },
        ],
      },
    ],
  },
  {
    slug: "fundamentos-da-fe",
    title: "Fundamentos da Fé",
    category: "Universitários",
    turma: "Fé & Vida 24",
    icon: "compass",
    modules: [
      {
        id: "m1",
        title: "As Grandes Perguntas",
        lessons: [
          {
            id: "l1",
            title: "Por Que Eu Existo",
            duration: "16:00",
            completed: true,
            content: "Uma primeira conversa sobre propósito, antes de qualquer resposta pronta.",
          },
          {
            id: "l2",
            title: "Deus é Real?",
            duration: "19:30",
            completed: true,
            content: "Argumentos, dúvidas honestas e espaço pra perguntar sem julgamento.",
          },
          {
            id: "l3",
            title: "A Bíblia é Confiável?",
            duration: "17:45",
            completed: false,
            content: "Como a Bíblia chegou até nós e por que isso importa pra fé de hoje.",
          },
        ],
      },
      {
        id: "m2",
        title: "Vivendo a Fé",
        lessons: [
          {
            id: "l4",
            title: "Oração no Dia a Dia",
            duration: "12:15",
            completed: false,
            content: "Oração como conversa real, não como fórmula. Práticas simples pra começar.",
          },
          {
            id: "l5",
            title: "Comunidade e Igreja",
            duration: "14:50",
            completed: false,
            content: "Por que fé de verdade não se vive sozinho.",
          },
          {
            id: "l6",
            title: "Fé em Tempos Difíceis",
            duration: "18:05",
            completed: false,
            content: "O que fazer quando a fé parece não fazer sentido nenhuma na prática.",
          },
        ],
      },
    ],
  },
  {
    slug: "impacto-2025",
    title: "Impacto 2025 — Preparação de Equipe",
    category: "Serviço",
    turma: "Impacto 2025",
    icon: "users",
    modules: [
      {
        id: "m1",
        title: "Preparação da Equipe",
        lessons: [
          {
            id: "l1",
            title: "História do Impacto",
            duration: "11:20",
            completed: false,
            content: "De onde veio a temporada Impacto e por que ela existe até hoje.",
          },
          {
            id: "l2",
            title: "Seu Papel na Equipe",
            duration: "13:40",
            completed: false,
            content: "Cada função importa — encontrando onde você mais soma no time.",
          },
          {
            id: "l3",
            title: "Cuidado e Segurança",
            duration: "15:10",
            completed: false,
            content: "Protocolos práticos de cuidado com quem estamos servindo e uns com os outros.",
          },
        ],
      },
    ],
  },
  {
    slug: "lideres-de-casa",
    title: "Fundamentos para Líderes de Casa",
    category: "Pastores e líderes",
    turma: "Líderes 24",
    icon: "book",
    modules: [
      {
        id: "m1",
        title: "Pastoreando Pessoas",
        lessons: [
          {
            id: "l1",
            title: "Cuidado Pastoral Básico",
            duration: "20:10",
            completed: true,
            content: "O que fazer — e o que não fazer — ao cuidar de alguém em crise no seu grupo.",
          },
          {
            id: "l2",
            title: "Conflitos em Grupos Pequenos",
            duration: "17:55",
            completed: false,
            content: "Sinais de conflito antes que ele quebre o grupo, e como mediar com maturidade.",
          },
          {
            id: "l3",
            title: "Multiplicando Líderes",
            duration: "16:30",
            completed: false,
            content: "Como identificar e preparar a próxima pessoa a liderar uma casa.",
          },
        ],
      },
    ],
  },
];

export function courseProgress(course: Course): number {
  const all = course.modules.flatMap((m) => m.lessons);
  if (all.length === 0) return 0;
  const done = all.filter((l) => l.completed).length;
  return Math.round((done / all.length) * 100);
}

export function findLesson(courseSlug: string, lessonId: string) {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return null;
  for (const [moduleIndex, module] of course.modules.entries()) {
    const lessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex !== -1) {
      return {
        course,
        module,
        moduleIndex,
        lesson: module.lessons[lessonIndex],
        lessonIndex,
      };
    }
  }
  return null;
}

export function nextLessonId(courseSlug: string, lessonId: string) {
  const found = findLesson(courseSlug, lessonId);
  if (!found) return null;
  const { module, lessonIndex } = found;
  return module.lessons[lessonIndex + 1]?.id ?? null;
}

export type Badge = {
  id: string;
  label: string;
  earned: boolean;
  color: "a" | "b" | "c" | "accent" | "success";
};

export const badges: Badge[] = [
  { id: "streak10", label: "10 semanas seguidas", earned: true, color: "a" },
  { id: "voz-ativa", label: "Voz ativa", earned: true, color: "accent" },
  { id: "mao-na-obra", label: "Mão na obra", earned: true, color: "b" },
  { id: "nota-maxima", label: "Nota máxima", earned: true, color: "c" },
  { id: "primeira-turma", label: "Primeira turma concluída", earned: true, color: "success" },
  { id: "referencia", label: "Referência", earned: false, color: "accent" },
  { id: "madrugador", label: "Madrugador", earned: false, color: "a" },
  { id: "mentor", label: "Mentor", earned: false, color: "b" },
];

export const leaderboard = [
  { name: "Mariana Silva", points: 1860, you: false },
  { name: "Pedro Costa", points: 1510, you: false },
  { name: "Lucas Andrade", points: 1240, you: true },
  { name: "Beatriz Lima", points: 1190, you: false },
  { name: "Diego Martins", points: 980, you: false },
  { name: "Ana Beatriz Melo", points: 860, you: false },
];

export const journey = [
  {
    date: "Set 2025",
    title: "Alcançou o Nível 4 · Engajado",
    detail: "12 dias de sequência e 90% de presença no módulo",
    color: "ink",
  },
  {
    date: "Ago 2025",
    title: "Serviu na equipe · Impacto 2025",
    detail: "",
    color: "b",
  },
  {
    date: "Jun 2025",
    title: "Concluiu Fundamentos da Fé",
    detail: "Certificado emitido",
    color: "accent",
  },
  {
    date: "Fev 2025",
    title: "Primeira sequência de 10 semanas",
    detail: 'Emblema "10 semanas seguidas" conquistado',
    color: "a",
  },
  {
    date: "Fev 2024",
    title: "Entrou pra Lifeshape",
    detail: "Cadastro como Universitário · Turma Liderança 24",
    color: "c",
    muted: true,
  },
];

export const pinnedAnnouncement = {
  author: "Equipe Lifeshape",
  text: "Inscrições da Semana Divertida abrem amanhã às 9h. Quem já tem 8+ semanas de presença garante prioridade.",
  likes: 48,
  replies: 12,
};

export const communityPosts = [
  {
    turma: "Liderança 24",
    author: "Beatriz Lima",
    time: "há 2h",
    text: "Gente, alguém tem o resumo da aula de terça? Perdi por causa do trabalho.",
    likes: 9,
    replies: 4,
  },
  {
    turma: "Liderança 24",
    author: "Pedro Costa",
    time: "há 5h",
    text: "Marcado pra amanhã: encontro de oração da turma antes da aula, 19h na sala 2.",
    likes: 21,
    replies: 6,
  },
  {
    turma: "Impacto 2025",
    author: "Diego Martins",
    time: "há 1d",
    text: "Time de logística do Impacto: reunião rápida sábado 10h, presencial.",
    likes: 14,
    replies: 3,
  },
  {
    turma: "Geral",
    author: "Ana Beatriz Melo",
    time: "há 2d",
    text: "Alguém mais vai pro encontro de líderes mês que vem? Bora ir junto?",
    likes: 7,
    replies: 5,
  },
];

export const storeCategories = ["Tudo", "Descontos", "Produtos", "Experiências"] as const;

export type Product = {
  id: string;
  title: string;
  category: (typeof storeCategories)[number];
  priceSementes?: number;
  priceFrom?: string;
  priceNow?: string;
  levelRequired?: number;
  icon: "shirt" | "ticket" | "mug" | "heart" | "hoodie" | "book" | "compass";
};

export const products: Product[] = [
  { id: "p1", title: "Camiseta Lifeshape", category: "Produtos", priceSementes: 320, icon: "shirt" },
  {
    id: "p2",
    title: "Ingresso · Semana Divertida",
    category: "Descontos",
    priceFrom: "R$120",
    priceNow: "R$90",
    icon: "ticket",
  },
  { id: "p3", title: "Caneca Lifeshape", category: "Produtos", priceSementes: 150, icon: "mug" },
  {
    id: "p4",
    title: "Mentoria 1:1 · Impacto 2025",
    category: "Experiências",
    priceSementes: 600,
    levelRequired: 3,
    icon: "heart",
  },
  { id: "p5", title: "Moletom Lifeshape", category: "Produtos", priceSementes: 540, icon: "hoodie" },
  {
    id: "p6",
    title: "15% off · Impacto 2025",
    category: "Descontos",
    priceFrom: "",
    priceNow: "Nível 4+",
    icon: "ticket",
  },
  {
    id: "p7",
    title: "Sessão de Aconselhamento",
    category: "Experiências",
    priceSementes: 400,
    levelRequired: 2,
    icon: "heart",
  },
  { id: "p8", title: "Devocional Lifeshape", category: "Produtos", priceSementes: 220, icon: "book" },
];

export const adminKpis = [
  { label: "Alunos ativos", value: "1.284", trend: "up", note: "6,2% vs. temporada anterior" },
  { label: "Presença média", value: "82%", trend: "up", note: "3,1 pts" },
  { label: "Engajamento médio", value: "71 / 100", trend: "up", note: "4 pts" },
  { label: "Receita do mês", value: "R$ 168.400", trend: "down", note: "1,4% vs. mês anterior" },
] as const;

export const engagementSeries = [58, 62, 60, 68, 71, 66, 74, 80];

export const atRiskStudents = [
  { name: "Rafael Nunes", detail: "3 faltas seguidas · Liderança 24" },
  { name: "Juliana Prado", detail: "Sem acesso há 9 dias" },
  { name: "Diego Martins", detail: "Entregas pendentes · 2 desafios" },
  { name: "Ana Beatriz Melo", detail: "Nível caiu de 3 para 2" },
  { name: "Carla Viana", detail: "Sem interação no mural há 3 semanas" },
];

export const adminNav = [
  { label: "Visão geral", icon: "grid" },
  { label: "Alunos", icon: "users" },
  { label: "Turmas", icon: "calendar" },
  { label: "Presença", icon: "check" },
  { label: "Financeiro", icon: "coin" },
  { label: "Loja", icon: "bag" },
  { label: "Gamificação", icon: "trophy" },
  { label: "Comunicação", icon: "megaphone" },
] as const;
