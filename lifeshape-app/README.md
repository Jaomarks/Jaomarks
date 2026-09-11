# Lifeshape App — protótipo

Protótipo clicável do app da Lifeshape: onboarding por perfil, aulas (o núcleo
que futuramente vem do ClassroomIO), presença, jornada, gamificação,
comunidade, loja e um painel administrativo. Next.js real, navegação de
verdade entre as telas — sem backend: os dados em `src/lib/data.ts` são
fictícios e ficam só na memória do navegador (recarregar a página reseta
qualquer coisa que você marcar como concluída).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000). A tela inicial (`/`)
é o onboarding; depois de escolher um perfil e continuar, o app vive dentro
de `/home`, `/cursos`, `/comunidade`, `/loja` e `/conquistas`. O painel
administrativo fica em `/admin`.

## Deploy na Vercel

1. Suba este repositório pro GitHub (já feito, se você está lendo isso no repo).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Se o projeto Next.js não estiver na raiz do repositório, aponte o **Root
   Directory** pra pasta `lifeshape-app`.
4. Não precisa configurar nenhuma variável de ambiente — é tudo estático.
5. Deploy. Pronto, link compartilhável pro chefão clicar.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

## Estrutura

- `src/app` — páginas (App Router), agrupadas em `(student)` (área do aluno,
  com menu inferior) e `admin` (painel administrativo, com menu lateral)
- `src/components` — ícones e componentes de UI reutilizáveis (cards, pílulas,
  anéis de progresso, navegação)
- `src/lib/data.ts` — todos os dados fictícios do protótipo (aluno, cursos,
  emblemas, ranking, loja, comunidade, métricas do admin)
