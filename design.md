# DESIGN.md — Diretrizes de UI/UX (PWA Salão de Beleza)

## 1. Direção Visual e Estética
- **Vibe:** Editorial, limpo, acolhedor e profissional (estilo app nativo moderno, nunca "template genérico").
- **Foco de uso:** Uso rápido no celular dentro do salão (muitas vezes com uma mão só). Priorize leitura imediata de nomes, datas e fórmulas de coloração.
- **Mobile-First absoluto:** Projete pensando em viewport `390x844` como padrão.

## 2. Design Tokens (Cores e Superfícies)
Use rigorosamente esta paleta. Não invente cores fora dela:
- **Fundo Principal (Background):** `#FAF8F6` (off-white quente, evita o branco estourado)
- **Superfície / Cards:** `#FFFFFF` com borda sutil `1px solid #EAE4DE`
- **Texto Primário:** `#1F1D1B` (grafite escuro, nunca preto `#000000` puro)
- **Texto Secundário / Labels:** `#736B65`
- **Cor de Destaque (Primary Accent):** `#C87A14` (Dourado Âmbar radiante — inspirado na identidade visual e na onda dourada da logotipo do Salão Essencial)
- **Hover / Active do Destaque:** `#A8630A`
- **Fundo Suave de Destaque (Badges/Chips):** `#FDF3E7` com texto `#8C530A`
- **Sucesso:** `#2E7D5B` (fundo `#E8F4EE`)
- **Alerta / Erro:** `#C94A4A` (fundo `#FCECEC`)

## 3. Tipografia e Hierarquia
- **Fonte Principal:** `Plus Jakarta Sans` ou `Inter` (Google Fonts).
- **Números e Medidas (CRÍTICO):** Use `font-variant-numeric: tabular-nums` em todas as quantidades de tinta, gramas, volumes de OX e datas para manter alinhamento perfeito.
- **Tamanhos:**
  - Título da tela: `22px`–`24px`, `font-semibold`, `tracking-tight`
  - Título de card / Nome da cliente: `16px`, `font-semibold`
  - Corpo / Descrição: `14px`–`15px`
  - Inputs de formulário: **Mínimo `16px`** (obrigatório para evitar zoom automático no iOS Safari)
  - Labels / Metadados: `12px`, `font-medium`, cor secundária

## 4. Regras de PWA com Cara de App Nativo
- **Navegação Inferior Fixa (Bottom Nav):** Máximo de 3 a 4 itens (ex: *Clientes*, *Novo*, *Tintas/Fórmulas*), altura de `64px` + `env(safe-area-inset-bottom)`. Nunca use menu hambúrguer no topo.
- **Header Limpo:** Apenas título da tela à esquerda e no máximo 1 ação principal à direita (ou barra de busca fixa logo abaixo). Respeite `env(safe-area-inset-top)`.
- **Área de Toque:** Todo botão, item de lista clicável e input deve ter altura mínima de `44px`.
- **Feedback Tátil:** Botões e cards clicáveis devem ter transição suave (`active:scale-[0.98] transition-transform`).
- **Modais no Mobile:** Prefira **Bottom Sheets** (gavetas que sobem de baixo com bordas superiores `rounded-t-3xl` e alça de arraste) em vez de modais quadrados no meio da tela.
- **Bordas e Sombras:** Use `rounded-2xl` em cards, `rounded-xl` em botões/inputs e `rounded-full` em badges/avatares. Sombras quase invisíveis (`shadow-xs` ou apenas borda `1px`).

## 5. Padrões Específicos do Domínio (Clientes e Tintas)
- **Lista de Clientes:**
  - Barra de busca fixa no topo com busca instantânea por nome ou telefone.
  - Cada item mostra: Avatar com iniciais (fundo `#FDF3E7`), Nome, Data da última visita e uma *pill/badge* discreta com a última tinta usada (ex: `7.0 + 7.1 • OX 20v`).
- **Histórico de Tintas (Ficha da Cliente):**
  - Exiba em formato de **linha do tempo limpa** (mais recente no topo).
  - Destaque visualmente a **Fórmula** dentro de um bloco levemente colorido (`#FAF8F6` com borda `#EAE4DE`), separando claramente: **Coloração/Mistura**, **Oxidante (OX)**, **Proporção/Gramas**, **Tempo de pausa** e **Observações**.
- **Estados Obrigatórios:**
  - Toda lista deve ter um *Empty State* amigável (ícone leve + texto curto + botão de ação).
  - Carregamentos devem usar *Skeleton*, nunca spinners gigantes no meio da tela.

## 6. Anti-Padrões (PROIBIDO)
- ❌ Proibido usar tabelas HTML tradicionais (`<table>`) no mobile — transforme em cards empilhados.
- ❌ Proibido colocar cards dentro de cards (excesso de caixas e bordas).
- ❌ Proibido gradientes genéricos (roxo/azul/rosa neon) ou sombras pesadas (`shadow-xl`).
- ❌ Proibido textos longos em botões (use verbos curtos: "Salvar fórmula", "Nova cliente").