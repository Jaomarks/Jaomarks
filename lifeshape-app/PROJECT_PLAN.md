# Plano geral — App Lifeshape

Frontend aprovado (este repo, `lifeshape-app/`) + backend real do ClassroomIO
(`classroomiols`). Este documento é o mapa: arquitetura, o que já dá pra usar
de verdade, o que falta construir, e a esteira de trabalho pra cada etapa.

## 1. Arquitetura

```mermaid
flowchart LR
    subgraph Frontend["lifeshape-app (Next.js) — este repo"]
        UI[Telas já aprovadas:\nonboarding, home, aula,\njornada, conquistas,\ncomunidade, loja, admin]
    end

    subgraph Backend["classroomiols (ClassroomIO) — self-hosted"]
        API["/public-api/v1\n(Hono)"]
        DASH[Dashboard SvelteKit\nadmin usa direto pro que\njá é forte lá]
        DB[(Postgres\ncursos, aulas, presença,\nnotas, certificados\n+ tabelas novas: gamificação, loja)]
    end

    UI -- "Bearer token\n(organization_api_key)" --> API
    API --> DB
    DASH --> DB
```

O Next.js nunca fala direto com o Postgres — tudo passa pela API do ClassroomIO,
autenticado por **API key da organização** (`Settings → Automation → API`,
tipo `api`). Essa chave já existe hoje, é gratuita (não depende de licença
Enterprise) e já vem com CORS liberado pra chamada externa — é o mecanismo
certo pra um frontend hospedado em outro domínio.

## 2. O que a API pública do ClassroomIO cobre hoje (checado no código)

| Recurso | Existe em `/public-api/v1`? |
|---|---|
| Cursos (listar/criar/editar) | ✅ `courses.ts` |
| Alunos / matrícula (audience) | ✅ `audience.ts` |
| Conteúdo de aula (módulos, lições, vídeo) | ❌ precisa estender |
| Presença | ❌ precisa estender |
| Notas / submissões / exercícios | ❌ precisa estender |
| Certificados | ❌ precisa estender |
| Analytics/admin (engajamento, KPIs) | ❌ é interno, não público |

Nada disso é ruim — o padrão (rota + serviço + validação + OpenAPI, tudo já
documentado em `prd/public-api [DONE]/README.md`) é claro e fácil de repetir.
Só significa que boa parte das etapas abaixo inclui "adicionar um endpoint
novo no ClassroomIO", não só "consumir o que já existe".

## 3. Decisões em aberto (preciso bater com você antes de codar a etapa correspondente)

1. **Onde o ClassroomIO vai rodar** (self-host via Docker, num VPS/PaaS) — é
   pré-requisito da Etapa 0, ainda não escolhido.
2. **Login de aluno**: a API pública é autenticada por chave de admin da
   organização, não por sessão de aluno. Pra aluno logar de verdade no
   Next.js e ver só o que é dele, as opções são: (a) estender a API pública
   com um endpoint de login/sessão de aluno, (b) rodar o Next.js no mesmo
   domínio do ClassroomIO pra reaproveitar o cookie de sessão dele, ou
   (c) usar SSO. Decide isso na Etapa 1.
3. **Licença AGPL**: como agora vai ser integração de verdade (não só
   inspiração visual), qualquer modificação no código do ClassroomIO rodando
   como serviço pros alunos, pela AGPL, precisa ter o código-fonte
   modificado disponível pra quem usa. Vale confirmar se isso é aceitável ou
   se faz sentido olhar uma licença comercial deles.
4. **Moeda interna e loja**: resgate só por "sementes" ganhas, ou vai ter
   pagamento real (boleto) em algum momento? Impacta o escopo da Etapa 7.

## 4. A esteira de trabalho

Cada etapa abaixo passa pelas mesmas 4 fases antes de eu marcar como pronta:

1. **Brainstorm** — alinho com você as decisões de regra de negócio daquela
   etapa específica antes de escrever código (nada de assumir sozinho coisa
   que muda comportamento pro aluno).
2. **Construção** — implemento (schema novo se precisar, rota + serviço +
   validação no ClassroomIO, integração no Next.js).
3. **Checagem de segurança** — rodo a skill `/security-review` em cima do
   diff daquela etapa antes de considerar fechada.
4. **Aprovação** — você testa e dá o sinal verde antes da próxima etapa.

## 5. Etapas de construção

| # | Etapa | O que muda | Depende de |
|---|---|---|---|
| 0 | Fundação | ClassroomIO rodando e acessível, org Lifeshape criada (single-org, invite-only), chave de API gerada, cliente HTTP no Next.js | Decisão #1 |
| 1 | Autenticação real | Login de aluno de verdade, sessão persistente, perfil (persona) salvo | Decisão #2 |
| 2 | Cursos e aulas | Trocar mock por dados reais; estender API pra trazer módulos/lições/conteúdo de aula | Etapa 0, 1 |
| 3 | Presença automática | Novo endpoint público de presença no ClassroomIO + consumo no Next.js | Etapa 2 |
| 4 | Avaliações e notas | Novo endpoint de submissão/nota + tela de exercício real | Etapa 2 |
| 5 | Jornada/timeline | Agregação dos dados já trazidos (sem API nova) | Etapas 2-4 |
| 6 | Gamificação | Tabelas novas (pontos, streak, nível, emblemas, ranking) + rotas `/public-api/v1/gamification/*` | Decisão de regras de pontuação |
| 7 | Loja virtual | Tabelas novas (produtos, sementes, resgates) + rotas `/public-api/v1/store/*` | Decisão #4 |
| 8 | Comunidade | Decidir: adaptar o Q&A que o ClassroomIO já tem, ou construir mural de turma novo | — |
| 9 | Painel administrativo | Métricas reais (parte pode vir do próprio dashboard do ClassroomIO; o que for diferencial novo — alunos em risco — fica no Next.js) | Etapas 3, 6 |

## 6. Próximo passo imediato

Etapa 0 começa com a Decisão #1 (onde hospedar o ClassroomIO). Assim que
definirmos isso, começo o brainstorm da Etapa 0 com você.
